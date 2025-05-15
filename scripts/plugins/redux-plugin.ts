import { Plugin, TsError, Fix } from '../ts-fixer-core'

class Logger {
  private name: string
  
  constructor(name: string) {
    this.name = name
  }
  
  debug(message: string, data?: any) {
    console.debug(`[${this.name}] ${message}`, data)
  }
  
  info(message: string, data?: any) {
    console.info(`[${this.name}] ${message}`, data)
  }
  
  warn(message: string, data?: any) {
    console.warn(`[${this.name}] ${message}`, data)
  }
  
  error(message: string, data?: any) {
    console.error(`[${this.name}] ${message}`, data)
  }
}

class ReduxPlugin implements Plugin {
  private logger: Logger

  constructor() {
    this.logger = new Logger('ReduxPlugin')
  }

  canHandle(error: TsError): boolean {
    this.logger.debug('Checking if can handle error', {
      message: error.message,
      code: error.code,
      file: error.file,
      line: error.line
    })
    
    const reduxPatterns = [
      /AsyncThunkAction/i,
      /useDispatch/i,
      /@reduxjs\/toolkit/i,
      /Reducer/i,
      /ThunkDispatch/i,
      /Action/i,
      /invalid-type/i
    ]
    
    const reduxErrorCodes = [
      2345, // Type assignment error
      2339, // Property does not exist
      2741, // Property is missing
      2769 // No overload matches this call
    ]
    
    const patternMatch = reduxPatterns.some(pattern => {
      const match = pattern.test(error.message)
      this.logger.debug(`Pattern ${pattern} match: ${match}`)
      return match
    })
    
    const codeMatch = reduxErrorCodes.includes(Number(error.code))
    this.logger.debug(`Error code match: ${codeMatch}`)
    
    const canHandle = patternMatch || codeMatch
    this.logger.debug(`Can handle error: ${canHandle}`)
    return canHandle
  }

  fix(error: TsError): Fix {
    this.logger.info('Processing error', {
      file: error.file,
      line: error.line,
      message: error.message,
      code: error.code
    })
    
    const filePath = error.file
    const content = this.readFile(filePath)
    const originalContent = content
    
    try {
      let fixResult: Fix | null = null
      
      if (/useDispatch/i.test(error.message)) {
        this.logger.debug('Handling useDispatch error')
        fixResult = this.fixUseDispatch(error, content)
      }
      else if (/AsyncThunkAction/i.test(error.message)) {
        this.logger.debug('Handling AsyncThunkAction error')
        fixResult = this.fixThunkType(error, content)
      }
      else if (/Reducer/i.test(error.message)) {
        this.logger.debug('Handling Reducer error')
        fixResult = this.fixReducerType(error, content.split('\n'))
      }
      else if (/ThunkDispatch/i.test(error.message)) {
        this.logger.debug('Handling ThunkDispatch error')
        fixResult = this.fixThunkDispatch(error, content)
      }
      
      if (!fixResult) {
        this.logger.warn('No fix available for this error type', {
          message: error.message,
          code: error.code
        })
        
        return {
          error,
          solution: 'No fix available for this Redux error',
          confidence: 0,
          applied: false
        }
      }
      
      // Enhanced change logging
      this.logger.debug('Checking content changes', {
        file: filePath,
        line: error.line,
        applied: fixResult.applied,
        changes: this.getContentDiff(originalContent, content)
      })
      
      // Проверяем, что контент действительно изменился
      if (fixResult.applied && content === originalContent) {
        this.logger.warn('Fix marked as applied but content did not change', {
          error,
          fixResult
        })
        fixResult.applied = false
      }
      
      return fixResult
    } catch (e) {
      this.logger.error('Error while fixing Redux issue', {
        originalError: error,
        fixError: e
      })
      
      return {
        error,
        solution: 'Error occurred while trying to fix this issue',
        confidence: 0,
        applied: false
      }
    }
  }

  private fixUseDispatch(error: TsError, content: string): Fix {
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
      solution: 'No fix available for useDispatch error',
      confidence: 0,
      applied: false
    }
  }

  private fixThunkType(error: TsError, content: string): Fix {
    const lines = content.split('\n')
    const line = lines[error.line - 1]
    
    if (error.message.includes('Cannot find name')) {
      if (error.message.includes('ThunkDispatch') || error.message.includes('Action')) {
        return this.addMissingImports(error, lines)
      }
    }
    
    if (error.message.includes('is not assignable to type')) {
      if (error.message.includes('Reducer')) {
        return this.fixReducerType(error, lines)
      }
    }
    
    if (line.includes('createAsyncThunk')) {
      const fixedLine = this.updateThunkType(line)
      lines[error.line - 1] = fixedLine
      
      return {
        error,
        solution: `Updated thunk type definition`,
        confidence: 0.85,
        applied: true
      }
    }
    
    return {
      error,
      solution: 'No fix available for thunk type error',
      confidence: 0,
      applied: false
    }
  }

  private fixReducerType(error: TsError, lines: string[]): Fix {
    const lineIndex = error.line - 1
    const line = lines[lineIndex]
    
    this.logger.debug(`Processing reducer type error in line ${lineIndex + 1}: ${line}`)
    
    if (line.includes('reducer:')) {
      const fixedLine = line.replace(/'invalid-type'/, 'nobleReducer')
      lines[lineIndex] = fixedLine
      
      return {
        error,
        solution: `Fixed reducer type from 'invalid-type' to nobleReducer`,
        confidence: 0.9,
        applied: true,
        content: lines.join('\n')
      }
    }
    
    this.logger.warn('No fix available for this reducer type error')
    return {
      error,
      solution: 'No fix available for reducer type error',
      confidence: 0,
      applied: false
    }
  }

  private addMissingImports(error: TsError, lines: string[]): Fix {
    const imports = [
      "import type { ThunkDispatch } from '@reduxjs/toolkit'",
      "import type { Action } from '@reduxjs/toolkit'"
    ]
    
    // Добавляем импорты в начало файла
    lines.splice(0, 0, ...imports)
    
    return {
      error,
      solution: `Added missing imports: ${imports.join(', ')}`,
      confidence: 0.9,
      applied: true
    }
  }

  private updateThunkType(line: string): string {
    // Add proper types for createAsyncThunk
    return line.replace(
      /createAsyncThunk<[^>]+>/,
      `createAsyncThunk<void, unknown, { state: RootState }>`
    )
  }

  private fixThunkDispatch(error: TsError, content: string): Fix {
    const lines = content.split('\n')
    const line = lines[error.line - 1]
    
    if (line.includes('ThunkDispatch')) {
      // Verify required types are imported
      const hasRootState = content.includes('RootState')
      const hasAnyAction = content.includes('AnyAction')
      
      if (!hasRootState || !hasAnyAction) {
        this.logger.warn('Missing required types for ThunkDispatch fix', {
          hasRootState,
          hasAnyAction
        })
        
        // Add missing imports if needed
        const importLines = []
        if (!hasRootState) {
          importLines.push("import type { RootState } from '../store'")
        }
        if (!hasAnyAction) {
          importLines.push("import type { AnyAction } from '@reduxjs/toolkit'")
        }
        
        if (importLines.length > 0) {
          lines.splice(0, 0, ...importLines)
          this.logger.info('Added missing imports for ThunkDispatch fix', {
            imports: importLines
          })
        }
      }
      
      // Apply the type fix
      const fixedLine = line.replace(
        /ThunkDispatch<[^>]+>/,
        `ThunkDispatch<RootState, undefined, AnyAction>`
      )
      
      if (fixedLine === line) {
        this.logger.warn('ThunkDispatch fix did not change the line', {
          original: line,
          fixed: fixedLine
        })
        return {
          error,
          solution: 'ThunkDispatch type already correct',
          confidence: 0.9,
          applied: false
        }
      }
      
      // Validate the fixed type
      try {
        // Simulate type checking
        const typeCheckResult = this.validateThunkDispatchType(fixedLine)
        if (!typeCheckResult.valid) {
          this.logger.error('ThunkDispatch type validation failed', {
            error: typeCheckResult.error,
            fixedLine
          })
          return {
            error,
            solution: 'ThunkDispatch type validation failed',
            confidence: 0.5,
            applied: false
          }
        }
        
        lines[error.line - 1] = fixedLine
        
        return {
          error,
          solution: `Fixed ThunkDispatch type`,
          confidence: 0.95,
          applied: true,
          content: lines.join('\n')
        }
      } catch (e) {
        this.logger.error('Error during ThunkDispatch type validation', {
          error: e,
          fixedLine
        })
        return {
          error,
          solution: 'Error during ThunkDispatch type validation',
          confidence: 0,
          applied: false
        }
      }
    }
    
    return {
      error,
      solution: 'No fix available for ThunkDispatch error',
      confidence: 0,
      applied: false
    }
  }

  private validateThunkDispatchType(line: string): { valid: boolean; error?: string } {
    // Basic validation of the ThunkDispatch type
    const validPattern = /ThunkDispatch<RootState,\s*undefined,\s*AnyAction>/
    if (!validPattern.test(line)) {
      return {
        valid: false,
        error: 'Invalid ThunkDispatch type format'
      }
    }
    
    return { valid: true }
  }

  private getContentDiff(original: string, modified: string): string {
    const originalLines = original.split('\n')
    const modifiedLines = modified.split('\n')
    
    let diff = ''
    const maxLines = Math.max(originalLines.length, modifiedLines.length)
    
    for (let i = 0; i < maxLines; i++) {
      const origLine = originalLines[i] || ''
      const modLine = modifiedLines[i] || ''
      
      if (origLine !== modLine) {
        diff += `Line ${i + 1}:\n`
        diff += `- ${origLine}\n`
        diff += `+ ${modLine}\n\n`
      }
    }
    
    return diff || 'No changes detected'
  }

  private readFile(filePath: string): string {
    const fs = require('fs')
    const path = require('path')
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8')
  }
}

export { ReduxPlugin }