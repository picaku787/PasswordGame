import CountryFlagValidator from './CountryFlagValidator'
import CharacterSequenceValidator from './CharacterSequenceValidator'
import PasswordTimeValidator from './PasswordTimeValidator'
import type { PasswordData } from './passwordTypes'

type PasswordStrengthProps = {
  passwordData: PasswordData
  passwordStrength: string
}

type Requirement = {
  id: string
  label: string
  met: boolean
}

type StrengthTone = 'neutral' | 'weak' | 'medium' | 'strong'

type StrengthResult = {
  label: string
  tone: StrengthTone
  helper: string
}

function getStrength(
  score: number,
  totalRequirements: number,
  hasPassword: boolean,
): StrengthResult {
  if (!hasPassword) {
    return {
      label: 'Nezadano',
      tone: 'neutral',
      helper: 'Zacnete psat heslo pro vyhodnoceni.',
    }
  }

  const completion = totalRequirements > 0 ? score / totalRequirements : 0

  if (completion < 0.4) {
    return {
      label: 'Slabe',
      tone: 'weak',
      helper: 'Heslo je prilis slabe. Pridejte vice ruznych znaku.',
    }
  }

  if (completion < 0.85) {
    return {
      label: 'Stredni',
      tone: 'medium',
      helper: 'Heslo je pouzitelne, ale jeste neni maximalne silne.',
    }
  }

  return {
    label: 'Silne',
    tone: 'strong',
    helper: 'Skvele, heslo splnuje vsechna kriteria.',
  }
}

function formatSeconds(milliseconds: number) {
  const seconds = milliseconds / 1000
  return Number.isInteger(seconds) ? `${seconds}` : seconds.toFixed(1)
}

function PasswordStrength({
  passwordData,
  passwordStrength,
}: PasswordStrengthProps) {
  const password = passwordData.value
  const sequenceValidation = CharacterSequenceValidator({ passwordData })
  const timeValidation = PasswordTimeValidator({ passwordData })

  const requirements: Requirement[] = [
    {
      id: 'length',
      label: 'Alespon 8 znaku',
      met: password.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'Alespon jedno velke pismeno',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'Alespon jedno cislo',
      met: /[0-9]/.test(password),
    },
    {
      id: 'special',
      label: 'Alespon jeden specialni znak (!@#$%^&*)',
      met: /[!@#$%^&*]/.test(password),
    },
    {
      id: 'sequence',
      label:
        'Sekvence obsahuje maly znak, velky znak, cislo a specialni znak za sebou',
      met: sequenceValidation.isValid,
    },
    {
      id: 'time-window',
      label: `Zadano v intervalu ${formatSeconds(
        timeValidation.minEntryTimeMs,
      )}-${formatSeconds(timeValidation.maxEntryTimeMs)} sekund`,
      met: timeValidation.isValid,
    },
  ]

  const score = requirements.filter((requirement) => requirement.met).length
  const strength = getStrength(score, requirements.length, password.length > 0)
  const progress = (score / requirements.length) * 100
  const toneClass = `tone-${strength.tone}`
  const missing = requirements
    .filter((requirement) => !requirement.met)
    .map((requirement) => requirement.label)
  const elapsedSeconds =
    timeValidation.elapsedMs === null
      ? null
      : (timeValidation.elapsedMs / 1000).toFixed(2)
  const timeMessage =
    password.length === 0 || elapsedSeconds === null
      ? null
      : timeValidation.tooFast
        ? `Heslo bylo zadano prilis rychle (${elapsedSeconds} s).`
        : timeValidation.tooSlow
          ? `Heslo bylo zadavano prilis dlouho (${elapsedSeconds} s).`
          : `Casova validace uspesna (${elapsedSeconds} s).`

  return (
    <section className="strength-panel mt-4" aria-live="polite">
      <p className="helper-text mb-2">
        Aktualni hodnoceni (useEffect):{' '}
        <span className="fw-semibold">{passwordStrength}</span>
      </p>

      <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
        <span className="section-label">Sila hesla</span>
        <span className={`badge rounded-pill strength-badge ${toneClass}`}>
          {strength.label}
        </span>
      </div>

      <div
        className="progress strength-progress mb-3"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className={`progress-bar ${toneClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="helper-text mb-2">{strength.helper}</p>
      {password.length > 0 && (
        <p className="helper-text mb-2">
          Nalezeno validnich sekvenci typu maly/velky/cislo/special:{' '}
          <span className="fw-semibold">{sequenceValidation.validSequenceCount}</span>
        </p>
      )}
      {timeMessage && (
        <p
          className={`helper-text mb-2 ${
            timeValidation.isValid ? 'time-success' : 'warning-text'
          }`}
        >
          {timeMessage}
        </p>
      )}

      {password.length > 0 && missing.length > 0 && (
        <div className="warning-alert mb-3" role="alert">
          <span className="fw-semibold">Chybi:</span> {missing.join(', ')}.
        </div>
      )}

      <ul className="list-group criteria-list">
        {requirements.map((requirement) => (
          <li
            key={requirement.id}
            className={`list-group-item d-flex justify-content-between align-items-center gap-3 ${
              requirement.met ? 'is-met' : 'is-unmet'
            }`}
          >
            <span>{requirement.label}</span>
            <span
              className={`status-pill ${requirement.met ? 'is-met' : 'is-unmet'}`}
            >
              {requirement.met ? 'OK' : 'Chybi'}
            </span>
          </li>
        ))}
      </ul>

      <CountryFlagValidator password={password} />
    </section>
  )
}

export default PasswordStrength
