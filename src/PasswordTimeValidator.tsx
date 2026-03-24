import type { PasswordData } from './passwordTypes'

type PasswordTimeValidatorProps = {
  passwordData: PasswordData
  minEntryTimeMs?: number
  maxEntryTimeMs?: number
}

export type PasswordTimeValidationResult = {
  isValid: boolean
  tooFast: boolean
  tooSlow: boolean
  elapsedMs: number | null
  minEntryTimeMs: number
  maxEntryTimeMs: number
}

const DEFAULT_MIN_ENTRY_TIME_MS = 1000
const DEFAULT_MAX_ENTRY_TIME_MS = 5000

function PasswordTimeValidator({
  passwordData,
  minEntryTimeMs = DEFAULT_MIN_ENTRY_TIME_MS,
  maxEntryTimeMs = DEFAULT_MAX_ENTRY_TIME_MS,
}: PasswordTimeValidatorProps): PasswordTimeValidationResult {
  const resolvedMinEntryTimeMs = Math.max(0, minEntryTimeMs)
  const resolvedMaxEntryTimeMs = Math.max(resolvedMinEntryTimeMs, maxEntryTimeMs)

  const { value, createdAt, updatedAt } = passwordData
  if (!value || createdAt === null || updatedAt === null) {
    return {
      isValid: false,
      tooFast: false,
      tooSlow: false,
      elapsedMs: null,
      minEntryTimeMs: resolvedMinEntryTimeMs,
      maxEntryTimeMs: resolvedMaxEntryTimeMs,
    }
  }

  const elapsedMs = Math.max(0, updatedAt - createdAt)
  const tooFast = elapsedMs < resolvedMinEntryTimeMs
  const tooSlow = elapsedMs > resolvedMaxEntryTimeMs

  return {
    isValid: !tooFast && !tooSlow,
    tooFast,
    tooSlow,
    elapsedMs,
    minEntryTimeMs: resolvedMinEntryTimeMs,
    maxEntryTimeMs: resolvedMaxEntryTimeMs,
  }
}

export default PasswordTimeValidator
