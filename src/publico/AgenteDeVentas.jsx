import React from 'react'
import { AuthProvider } from '../admin/auth'
import { EntrenadorPage } from '../admin/pages/Entrenador'
import '../admin/admin.css'
import '../admin/admin-crm.css'

/** Entrenador de ventas abierto en /agentedeventas: sin login ni menú, no aparece en la landing. */
export default function AgenteDeVentasPage() {
  React.useEffect(() => {
    document.title = 'Agente de ventas | Código Norte Soluciones'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <AuthProvider>
      <div className="admin-shell" style={{ gridTemplateColumns: '1fr' }}>
        <main className="admin-main">
          <EntrenadorPage publico />
        </main>
      </div>
    </AuthProvider>
  )
}
