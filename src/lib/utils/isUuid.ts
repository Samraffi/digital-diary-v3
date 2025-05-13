/**
 * Проверяет является ли строка UUID
 */
export function isUuid(str: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidPattern.test(str)
}

/**
 * Генерирует имя по умолчанию для дворянина
 */
export function getDefaultNobleName(rank: string): string {
  const timestamp = Date.now()
  const number = Math.floor(Math.random() * 100)
  return `${rank}_${number}_${timestamp}`
}
