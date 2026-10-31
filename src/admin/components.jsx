import React from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth'
import { api } from './api'

// Páginas que puede ver cada acceso limitado (el servidor también lo exige). Sin entrada = acceso completo.
const RUTAS_POR_ACCESO = {
  ingles: ['/admin/ingles'],
  entrenadores: ['/admin/ingles', '/admin/entrenador'],
}

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/consultas', label: 'Consultas', badge: true },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/planes', label: 'Planes' },
  { to: '/admin/pagos', label: 'Pagos' },
  { to: '/admin/demos', label: 'Demos' },
  { to: '/admin/whatsapp', label: 'WhatsApp' },
  { to: '/admin/entrenador', label: 'Entrenador de ventas' },
  { to: '/admin/ingles', label: 'Entrenador de inglés' },
  { to: '/admin/articulos', label: 'Artículos' },
  { to: '/admin/asistente', label: 'Asistente IA' },
  { to: '/admin/embudo', label: 'Embudo' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Usuarios con acceso limitado: solo ven algunas páginas.
  const permitidas = RUTAS_POR_ACCESO[user?.acceso]
  const restringido = Boolean(permitidas)
  const [unread, setUnread] = React.useState(0)
  const [menuCerrado, setMenuCerrado] = React.useState(() => {
    try {
      return localStorage.getItem('cns_admin_menu') === 'cerrado'
    } catch {
      return false
    }
  })
  const alternarMenu = () =>
    setMenuCerrado((c) => {
      try {
        localStorage.setItem('cns_admin_menu', c ? 'abierto' : 'cerrado')
      } catch {
        /* sin almacenamiento: no pasa nada */
      }
      return !c
    })

  // Mensajes de WhatsApp sin leer: se muestran como globito en "Consultas".
  React.useEffect(() => {
    if (restringido) return undefined
    let alive = true
    const tick = () =>
      api.whatsapp.unread().then((d) => alive && setUnread(d.total || 0)).catch(() => {})
    tick()
    const t = setInterval(tick, 15000)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [restringido])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  if (restringido && !permitidas.includes(location.pathname.replace(/\/+$/, ''))) {
    return <Navigate to={permitidas[0]} replace />
  }

  const nav = restringido ? NAV.filter((item) => permitidas.includes(item.to)) : NAV

  return (
    <div className={`admin-shell${menuCerrado ? ' admin-shell--menu-cerrado' : ''}`}>
      <button
        type="button"
        className="admin-menu-toggle"
        onClick={alternarMenu}
        aria-expanded={!menuCerrado}
        aria-label={menuCerrado ? 'Mostrar menú' : 'Ocultar menú'}
        title={menuCerrado ? 'Mostrar menú' : 'Ocultar menú'}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </button>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img className="admin-brand-logo" src="/cnslogo.png" alt="CNS" width="111" height="40" />
          <div>
            <strong>CNS</strong>
            <small>CRM Admin</small>
          </div>
        </div>
        <nav className="admin-nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
              {item.badge && unread > 0 && <span className="admin-nav-badge">{unread}</span>}
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
