import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import { ErrorBox } from '../components'

export function LoginPage() {
  const { user, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = React.useState('admin@codigonorte.com')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  if (user) {
    const from = location.state?.from?.pathname || '/admin'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message === 'UNAUTHORIZED' ? 'Credenciales inválidas' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-brand admin-brand--center">
          <span className="admin-brand-mark">CN</span>
          <div>
            <strong>Código Norte CRM</strong>
            <small>Panel de administración</small>
          </div>
        </div>
        <ErrorBox message={error} />
        <label className="admin-field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="admin-btn admin-btn--primary admin-btn--block" disabled={loading}>
          {loading ? 'Entrando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
