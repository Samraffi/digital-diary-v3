import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { format } from 'date-fns'

interface TsError {
  file: string
  line: number
  code: string
  message: string
  type: string
  context?: string
}

interface TsFix {
  error: TsError
  solution: string
  confidence: number
  action: 'addImport' | 'changeType' | 'fixSyntax'
  originalContent?: string
  codeSnippet?: string
}

interface LogEntry {
  timestamp: string
  error: TsError
  fix: TsFix
}

interface FileChange {
  filePath: string
  originalContent: string
  newContent: string
}

class ChangeStack {
  private changes: FileChange[] = []
  
  push(change: FileChange): void {
    this.changes.push(change)
  }
  
  rollback(): void {
    while (this.changes.length > 0) {
      const change = this.changes.pop()!
      writeFileSync(change.filePath, change.originalContent, 'utf-8')
    }
  }
}

const changeStack = new ChangeStack()

function runTypeCheck(): string {
  try {
    return execSync('npx tsc --noEmit', { encoding: 'utf-8' })
  } catch (error: any) {
    return error.stdout
  }
}

function parseErrors(output: string): TsError[] {
  const errors: TsError[] = []
  const lines = output.split('\n')

  for (const line of lines) {
    const match = line.match(/^(.*\.tsx?):(\d+):\d+ - error TS(\d+): (.*)$/)
    if (match) {
      const error: TsError = {
        file: match[1],
        line: parseInt(match[2]),
        code: `TS${match[3]}`,
        message: match[4],
        type: classifyError(match[4])
      }
      errors.push(error)
    }
  }

  return errors
}

function classifyError(message: string): string {
  if (message.includes('Cannot find module')) return 'module'
  if (message.includes('is not assignable to type')) return 'type-mismatch'
  if (message.includes('is missing the following properties')) return 'interface'
  if (message.includes('is used before being assigned')) return 'unassigned'
  if (message.includes('is possibly')) return 'null-check'
  if (message.includes('has no default export')) return 'export'
  if (message.includes('is not a function')) return 'function'
  if (message.includes('is not a constructor')) return 'constructor'
  if (message.includes('is not a valid JSX element')) return 'jsx'
  if (message.includes('is not iterable')) return 'iterable'
  if (message.includes('is read-only')) return 'immutable'
  if (message.includes('is not a valid child')) return 'jsx-child'
  if (message.includes('is not callable')) return 'callable'
  if (message.includes('is not a valid key')) return 'key'
  if (message.includes('is not a valid attribute')) return 'attribute'
  if (message.includes('is not a valid prop')) return 'prop'
  if (message.includes('is not a valid event')) return 'event'
  if (message.includes('is not a valid style')) return 'style'
  if (message.includes('is not a valid class')) return 'class'
  if (message.includes('is not a valid id')) return 'id'
  if (message.includes('is not a valid selector')) return 'selector'
  if (message.includes('is not a valid value')) return 'value'
  if (message.includes('is not a valid type')) return 'type'
  if (message.includes('is not a valid argument')) return 'argument'
  if (message.includes('is not a valid parameter')) return 'parameter'
  if (message.includes('is not a valid return')) return 'return'
  if (message.includes('is not a valid variable')) return 'variable'
  if (message.includes('is not a valid constant')) return 'constant'
  if (message.includes('is not a valid expression')) return 'expression'
  if (message.includes('is not a valid statement')) return 'statement'
  if (message.includes('is not a valid block')) return 'block'
  return 'other'
}

function applyFix(filePath: string, newContent: string, originalContent: string): void {
  changeStack.push({
    filePath,
    originalContent,
    newContent
  })
  writeFileSync(filePath, newContent, 'utf-8')
}

function fixError(error: TsError): TsFix {
  const filePath = join(process.cwd(), error.file)
  const originalContent = readFileSync(filePath, 'utf-8')
  const content = originalContent.split('\n')
  
  try {
    switch (error.type) {
      case 'module':
        const moduleMatch = error.message.match(/Cannot find module ['"](.*)['"]/)
        if (moduleMatch) {
          const modulePath = moduleMatch[1]
          const moduleName = modulePath.split('/').pop()?.replace(/[^a-zA-Z0-9_$]/g, '') || 'module'
          const importStatement = `import ${moduleName} from '${modulePath}'`
          content.splice(error.line - 1, 0, importStatement)
          const newContent = content.join('\n')
          return {
            error,
            solution: `Added import: ${importStatement}`,
            confidence: 0.95,
            action: 'addImport',
            originalContent
          }
        }
        break;
      
      case 'type-mismatch':
        const typeMatch = error.message.match(/Type '(.+)' is not assignable to type '(.+)'/)
        if (typeMatch) {
          const [_, actualType, expectedType] = typeMatch
          const newContent = originalContent.replace(actualType, expectedType)
          return {
            error,
            solution: `Change type from ${actualType} to ${expectedType}`,
            confidence: 0.8,
            action: 'changeType',
            originalContent
          }
        }
        break;
      
      case 'interface':
        return {
          error,
          solution: 'Implement missing interface properties',
          confidence: 0.7,
          action: 'fixSyntax',
          originalContent
        }
      
      case 'jsx-child':
        return {
          error,
          solution: 'Add proper JSX child elements',
          confidence: 0.6,
          action: 'fixSyntax',
          originalContent
        }
      
      case 'callable':
        return {
          error,
          solution: 'Ensure function is properly defined and called',
          confidence: 0.7,
          action: 'fixSyntax',
          originalContent
        }
      
      case 'prop':
        const propMatch = error.message.match(/Property '(.+)' does not exist/)
        if (propMatch) {
          const propName = propMatch[1]
          return {
            error,
            solution: `Add or correct prop: ${propName}`,
            confidence: 0.75,
            action: 'fixSyntax',
            originalContent
          }
        }
        break;
      
      default:
        return {
          error,
          solution: 'No automatic fix available',
          confidence: 0.0,
          action: 'fixSyntax',
          originalContent
        }
    }
  } catch (e) {
    return {
      error,
      solution: `Error during fix attempt: ${(e as Error).message}`,
      confidence: 0.0,
      action: 'fixSyntax',
      originalContent
    }
  }

  return {
    error,
    solution: 'No fix available',
    confidence: 0.0,
    action: 'fixSyntax',
    originalContent
  }
}

function logError(error: TsError, fix: TsFix): void {
  const logEntry: LogEntry = {
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
    error: {
      ...error,
      context: getErrorContext(error)
    },
    fix: {
      ...fix,
      codeSnippet: getCodeSnippet(fix.originalContent || '', error.line)
    }
  }
  
  const logPath = join(process.cwd(), 'ts-error-fixes.log')
  const logLine = JSON.stringify(logEntry, null, 2)
  
  writeFileSync(logPath, logLine + '\n', { flag: 'a' })
}

function getErrorContext(error: TsError): string {
  try {
    const filePath = join(process.cwd(), error.file)
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const start = Math.max(0, error.line - 3)
    const end = Math.min(lines.length, error.line + 2)
    return lines.slice(start, end).join('\n')
  } catch (e) {
    return 'Unable to retrieve error context'
  }
}

function getCodeSnippet(content: string, line: number): string {
  const lines = content.split('\n')
  const start = Math.max(0, line - 2)
  const end = Math.min(lines.length, line + 1)
  return lines.slice(start, end).join('\n')
}

function main() {
  let errors: TsError[] = []
  let attempts = 0
  const maxAttempts = 10

  try {
    do {
      const output = runTypeCheck()
      errors = parseErrors(output)
      
      if (errors.length > 0) {
        console.log(`Found ${errors.length} TypeScript errors`)
        
        for (const error of errors) {
          console.log(`Fixing error in ${error.file}:${error.line} - ${error.message}`)
          const fixResult = fixError(error)
          
          console.log(`Fix attempt: ${fixResult.solution}`)
          console.log(`Confidence: ${(fixResult.confidence * 100).toFixed(0)}%`)
          
          if (fixResult.confidence > 0.5 && fixResult.originalContent) {
            console.log('Applying fix...')
            applyFix(join(process.cwd(), error.file), fixResult.solution, fixResult.originalContent)
          } else {
            console.log('Fix not applied due to low confidence')
          }
          
          logError(error, fixResult)
        }
        
        attempts++
      }
    } while (errors.length > 0 && attempts < maxAttempts)

    if (errors.length > 0) {
      console.log('Unable to fix all errors automatically')
      console.log('Rolling back changes...')
      changeStack.rollback()
    } else {
      console.log('All TypeScript errors fixed successfully')
    }
  } catch (error) {
    console.error('Error during fix process:', error)
    console.log('Rolling back changes...')
    changeStack.rollback()
  }
}

main()