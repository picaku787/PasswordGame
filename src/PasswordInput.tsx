import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { PasswordData } from './passwordTypes'

type PasswordInputProps = {
  passwordData: PasswordData
  setPasswordData: Dispatch<SetStateAction<PasswordData>>
}

function PasswordInput({ passwordData, setPasswordData }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { value } = passwordData

  const handlePasswordChange = (nextValue: string) => {
    const now = Date.now()
    setPasswordData((currentValue) => {
      if (nextValue.length === 0) {
        return {
          value: '',
          createdAt: null,
          updatedAt: null,
        }
      }

      return {
        value: nextValue,
        createdAt: currentValue.createdAt ?? now,
        updatedAt: now,
      }
    })
  }

  return (
    <div className="password-input">
      <label htmlFor="password-field" className="form-label fw-semibold">
        Heslo
      </label>
      <div className="input-group input-group-lg">
        <input
          className="form-control password-field"
          id="password-field"
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => handlePasswordChange(event.target.value)}
          placeholder="Zadejte heslo"
          autoComplete="new-password"
        />
        <button
          type="button"
          className="btn btn-primary toggle-button"
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? 'Skryt' : 'Zobrazit'}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
