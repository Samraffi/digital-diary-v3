import { TsFixer, TsError } from './ts-fixer-core'
import { ReduxPlugin } from './plugins/redux-plugin'

function main() {
  const fixer = new TsFixer()
  
  // Регистрируем плагины
  fixer.registerPlugin(new ReduxPlugin())
  
  try {
    console.log('Starting TypeScript error fixing...')
    let errors = []
    try {
      errors = fixer.getTypeScriptErrors()
    } catch (tscError) {
      console.log('TypeScript compilation failed, but continuing with error processing')
      const output = (tscError as { output: [any, string, string] }).output[1]
      errors = output.split('\n')
        .filter((line: string) => line.includes('error TS'))
        .map((line: string) => {
          const match = line.match(/(.*)\((\d+),(\d+)\): error TS(\d+): (.*)/)
          if (match) {
            return {
              file: match[1].trim(),
              line: parseInt(match[2]),
              column: parseInt(match[3]),
              code: match[4],
              message: match[5].trim(),
              type: 'typescript'
            }
          }
          return null
        })
        .filter(Boolean) as TsError[]
    }
    
    console.log(`Found ${errors.length} TypeScript errors`)
    
    for (const error of errors) {
      console.log(`Processing error in ${error.file}:${error.line}`)
      console.log(`Error: ${error.message}`)
      
      for (const plugin of fixer.getPlugins()) {
        console.log(`Checking plugin ${plugin.constructor.name} for error in ${error.file}:${error.line}`)
        if (plugin.canHandle(error)) {
          console.log(`Plugin ${plugin.constructor.name} can handle this error`)
          const fix = plugin.fix(error)
          console.log(`Fix: ${fix.solution}`)
          console.log(`Confidence: ${fix.confidence}`)
          fixer.applyFix(fix, error)
          break
        } else {
          console.log(`Plugin ${plugin.constructor.name} cannot handle this error`)
        }
      }
    }
    
    console.log('Error fixing completed successfully')
  } catch (error) {
    console.error('Error during fixing process:', error)
    console.log('Rolling back changes...')
    fixer.rollback()
  }
}

main()