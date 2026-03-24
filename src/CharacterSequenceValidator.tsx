import type { PasswordData } from './passwordTypes'

type CharacterType = 'lowercase' | 'uppercase' | 'number' | 'special'

type CharacterSequenceValidatorProps = {
  passwordData: PasswordData
  minimumSequenceLength?: number
  requiredTypes?: CharacterType[]
}

export type CharacterSequenceValidationResult = {
  isValid: boolean
  validSequenceCount: number
  matchedSequences: string[]
  requiredTypes: CharacterType[]
  minimumSequenceLength: number
}

const DEFAULT_REQUIRED_TYPES: CharacterType[] = [
  'lowercase',
  'uppercase',
  'number',
  'special',
]

const CHARACTER_TYPE_PATTERNS: Record<CharacterType, RegExp> = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
}

function CharacterSequenceValidator({
  passwordData,
  minimumSequenceLength,
  requiredTypes = DEFAULT_REQUIRED_TYPES,
}: CharacterSequenceValidatorProps): CharacterSequenceValidationResult {
  const password = passwordData.value
  const resolvedMinimumSequenceLength = Math.max(
    minimumSequenceLength ?? requiredTypes.length,
    requiredTypes.length,
  )

  if (password.length < resolvedMinimumSequenceLength) {
    return {
      isValid: false,
      validSequenceCount: 0,
      matchedSequences: [],
      requiredTypes,
      minimumSequenceLength: resolvedMinimumSequenceLength,
    }
  }

  const matchedSequences: string[] = []
  for (let index = 0; index <= password.length - resolvedMinimumSequenceLength; index += 1) {
    const candidateSequence = password.slice(
      index,
      index + resolvedMinimumSequenceLength,
    )

    const hasAllRequiredTypes = requiredTypes.every((requiredType) => {
      const typePattern = CHARACTER_TYPE_PATTERNS[requiredType]
      return Array.from(candidateSequence).some((character) =>
        typePattern.test(character),
      )
    })

    if (hasAllRequiredTypes) {
      matchedSequences.push(candidateSequence)
    }
  }

  return {
    isValid: matchedSequences.length > 0,
    validSequenceCount: matchedSequences.length,
    matchedSequences,
    requiredTypes,
    minimumSequenceLength: resolvedMinimumSequenceLength,
  }
}

export default CharacterSequenceValidator
