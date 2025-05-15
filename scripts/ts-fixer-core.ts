import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

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
  content?: string
}

interface Plugin {
  canHandle(error: TsError): boolean
  fix(error: TsError): Fix
}

class TsFixer {
  private plugins: Plugin[] = []
  private changes: Array<{ file: string; originalContent: string }> = []

  getPlugins(): Plugin[] {
    return this.plugins
  }

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin)
  }

  run() {
    const errors = this.getTypeScriptErrors()
    
    for (const error of errors) {
      for (const plugin of this.plugins) {
        if (plugin.canHandle(error)) {
          const fix = plugin.fix(error)
          this.applyFix(fix, error)
          break
        }
      }
    }
  }

  getTypeScriptErrors(): TsError[] {
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8' })
    return this.parseErrors(output)
  }

  parseErrors(output: string): TsError[] {
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
          type: this.classifyError(match[4])
        })
      }
    }

    return errors
  }

  classifyError(message: string): string {
    if (message.includes('is not assignable to type')) return 'type-mismatch'
    if (message.includes('Cannot find module')) return 'module'
    return 'other'
  }

  applyFix(fix: Fix, error: TsError) {
    console.log('Attempting to apply fix', {
      file: error.file,
      applied: fix.applied,
      confidence: fix.confidence,
      hasContent: !!fix.content
    })
    
    if (fix.applied && fix.confidence > 0.8) {
      const filePath = join(process.cwd(), error.file)
      const originalContent = readFileSync(filePath, 'utf-8')
      
      console.log('Saving changes for file', {
        file: filePath,
        contentLength: fix.content?.length
      })
      
      this.changes.push({ file: filePath, originalContent })
      writeFileSync(filePath, fix.content || '', 'utf-8')
      
      console.log('Changes successfully applied')
    } else {
      console.log('Fix not applied or confidence too low', {
        applied: fix.applied,
        confidence: fix.confidence
      })
    }
  }

  rollback() {
    while (this.changes.length > 0) {
      const change = this.changes.pop()!
      writeFileSync(change.file, change.originalContent, 'utf-8')
    }
  }
}

export { TsFixer }
export type { Plugin, TsError, Fix }