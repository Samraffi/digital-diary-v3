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
}

interface Fix {
  error: TsError
  solution: string
  confidence: number
  applied: boolean
}

class ChangeStack {
  private changes: Array<{ file: string; originalContent: string }> = []

  push(file: string, originalContent: string) {
    this.changes.push({ file, originalContent })
  }

  rollback() {
    while (this.changes.length > 0) {
      const change = this.changes.pop()!
      writeFileSync(change.file, change.originalContent, 'utf-8')
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
      errors.push({
        file: match[1],
        line: parseInt(match[2]),
        code: `TS${match[3]}`,
        message: match[4],
        type: classifyError(match[4])
      })
    }
  }

  return errors
}

function classifyError(message: string): string {
  if (message.includes('is not assignable to type')) return 'type-mismatch'
  if (message.includes('Cannot find module')) return 'module'
  if (message.includes('is missing the following properties')) return 'interface'
  return 'other'
}

function fixReduxError(error: TsError): Fix {
  const filePath = join(process.cwd(), error.file)
  const originalContent = readFileSync(filePath, 'utf-8')
  
  try {
    switch (error.type) {
      case 'type-mismatch':
        if (error.message.includes('AsyncThunkAction')) {
          return fixThunkTypeMismatch(error, filePath, originalContent)
        }
        break
        
      case 'module':
        if (error.message.includes('@reduxjs/toolkit')) {
          return fixReduxToolkitImport(error, filePath, originalContent)
        }
        break
    }
    
    return {
      error,
      solution: 'No automatic fix available',
      confidence: 0,
      applied: false
    }
  } catch (e) {
    return {
      error,
      solution: `Error during fix: ${(e as Error).message}`,
      confidence: 0,
      applied: false
    }
  }
}

function fixThunkTypeMismatch(error: TsError, filePath: string, content: string): Fix {
  const lines = content.split('\n')
  const line = lines[error.line - 1]
  
  if (line.includes('useDispatch')) {
    const fixedLine = line.replace('useDispatch', 'useAppDispatch')
    lines[error.line - 1] = fixedLine
    
    return {
      error,
      solution: `Replaced useDispatch with useAppDispatch`,
      confidence: 0.9,
      applied: true
    }
  }
  
  return {
    error,
    solution: 'No fix available for this thunk type mismatch',
    confidence: 0,
    applied: false
  }
}

function fixReduxToolkitImport(error: TsError, filePath: string, content: string): Fix {
  const importStatement = "import { createAsyncThunk } from '@reduxjs/toolkit';"
  const lines = content.split('\n')
  lines.splice(0, 0, importStatement)
  
  return {
    error,
    solution: `Added Redux Toolkit import`,
    confidence: 0.95,
    applied: true
  }
}

function applyFix(filePath: string, newContent: string, originalContent: string) {
  changeStack.push(filePath, originalContent)
  writeFileSync(filePath, newContent, 'utf-8')
}

function main() {
  console.log('Running Redux TypeScript fixer...')
  
  let errors = parseErrors(runTypeCheck())
  let fixedCount = 0
  
  for (const error of errors) {
    console.log(`\nProcessing error in ${error.file}:${error.line}`)
    console.log(`Error: ${error.message}`)
    
    const fix = fixReduxError(error)
    console.log(`Solution: ${fix.solution}`)
    console.log(`Confidence: ${(fix.confidence * 100).toFixed(0)}%`)
    
    if (fix.applied && fix.confidence > 0.8) {
      const filePath = join(process.cwd(), error.file)
      const originalContent = readFileSync(filePath, 'utf-8')
      const newContent = originalContent.split('\n')
      newContent[error.line - 1] = fix.solution
      
      applyFix(filePath, newContent.join('\n'), originalContent)
      fixedCount++
    }
  }
  
  if (fixedCount > 0) {
    console.log(`\nSuccessfully fixed ${fixedCount} errors`)
  } else {
    console.log('\nNo fixes were applied')
    changeStack.rollback()
  }
}

main()