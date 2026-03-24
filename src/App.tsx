import { useEffect, useState } from 'react'
import PasswordInput from './PasswordInput'
import PasswordStrength from './PasswordStrength'
import type { PasswordData } from './passwordTypes'
import './App.css'

type PasswordStrengthLabel = 'Nezadano' | 'Slabe' | 'Stredni' | 'Silne'

function evaluatePassword(password: string): PasswordStrengthLabel {
  if (password.length === 0) {
    return 'Nezadano'
  }

  let score = 0

  if (password.length >= 8) {
    score += 1
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  }

  if (/[a-z]/.test(password)) {
    score += 1
  }

  if (/[0-9]/.test(password)) {
    score += 1
  }

  if (/[!@#$%^&*]/.test(password)) {
    score += 1
  }

  if (score <= 2) {
    return 'Slabe'
  }

  if (score <= 4) {
    return 'Stredni'
  }

  return 'Silne'
}

function App() {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    value: '',
    createdAt: null,
    updatedAt: null,
  })
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrengthLabel>('Nezadano')

  useEffect(() => {
    const strength = evaluatePassword(passwordData.value)
    setPasswordStrength(strength)
  }, [passwordData.value])

  useEffect(() => {
    document.title = `Sila hesla: ${passwordStrength}`
  }, [passwordStrength])

  useEffect(() => {
    const sabotageInterval = window.setInterval(() => {
      setPasswordData((currentValue) => {
        const previousPassword = currentValue.value
        if (previousPassword.length === 0) {
          return currentValue
        }

        let nextPassword = previousPassword
        if (Math.random() < 0.5) {
          nextPassword = `${previousPassword}\u{1F61C}`
        } else {
          const index = Math.floor(Math.random() * previousPassword.length)
          nextPassword =
            previousPassword.slice(0, index) + previousPassword.slice(index + 1)
        }

        if (nextPassword.length === 0) {
          return {
            value: '',
            createdAt: null,
            updatedAt: null,
          }
        }

        const now = Date.now()
        return {
          value: nextPassword,
          createdAt: currentValue.createdAt ?? now,
          updatedAt: now,
        }
      })
    }, 10000)

    return () => window.clearInterval(sabotageInterval)
  }, [])

  return (
    <main className="app-shell">
      <div className="container py-4 py-md-5">
        <section className="card password-card border-0 mx-auto">
          <div className="card-body p-4 p-md-5">
            <p className="eyebrow mb-2">Password Checker</p>
            <h1 className="h2 fw-bold mb-2">Kontrola sily hesla</h1>
            <p className="subtitle mb-4">
              Zadejte heslo a okamzite uvidite, jak je silne podle
              pozadovanych kriterii.
            </p>

            <PasswordInput
              passwordData={passwordData}
              setPasswordData={setPasswordData}
            />
            <PasswordStrength
              passwordData={passwordData}
              passwordStrength={passwordStrength}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
