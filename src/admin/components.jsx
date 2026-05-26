import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './auth'

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/planes', label: 'Planes' },
  { to: '/admin/pagos', label: 'Pagos' },
  { to: '/admin/demos', label: 'Demos' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">CN</span>
          <div>
            <strong>Código Norte</strong>
            <small>CRM Admin</small>
          </div>
        </div>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <span>{user?.email}</span>
          <button type="button" className="admin-link-btn" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="admin-page-hd">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="admin-actions">{actions}</div>}
    </header>
  )
}

export function Badge({ tone = 'neutral', children }) {
  return <span className={`admin-badge admin-badge--${tone}`}>{children}</span>
}

export function EmptyState({ children }) {
  return <div className="admin-empty">{children}</div>
}

export function ErrorBox({ message }) {
  if (!message) return null
  return <div className="admin-error">{message}</div>
}

export function Card({ title, children, actions }) {
  return (
    <section className="admin-card">
      {(title || actions) && (
        <div className="admin-card-hd">
          {title && <h2>{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

export function Modal({ open, title, onClose, children }) {
  if (!open) return null
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-hd">
          <h2>{title}</h2>
          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Btn({ variant = 'primary', type = 'button', ...props }) {
  return <button type={type} className={`admin-btn admin-btn--${variant}`} {...props} />
}

export function Select({ size = 'default', className = '', children, ...props }) {
  const sizeClass = size === 'compact' ? ' admin-select--compact' : ''
  const extra = className ? ` ${className}` : ''
  return (
    <select className={`admin-select${sizeClass}${extra}`} {...props}>
      {children}
    </select>
  )
}

export function Table({ columns, rows, onRowClick, rowClassName }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const extra = rowClassName ? rowClassName(row) : ''
            const clickable = onRowClick ? ' clickable' : ''
            return (
              <tr
                key={row.id}
                className={`${extra}${clickable}`.trim() || undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
