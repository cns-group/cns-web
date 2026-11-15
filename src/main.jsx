import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import AdminApp from './admin/AdminApp'
import { TermsPage, PrivacyPage } from './legal-pages'
import { ArticuloPage, ArticulosPage } from './articulos'
const AgenteDeVentasPage = lazy(() => import('./publico/AgenteDeVentas'))
import '@fontsource-variable/manrope'
import './fonts.css'
import './styles.css'
import './skill-landing.css'
import './legibility.css'

// El contenido prerenderizado para buscadores ya no hace falta cuando la app carga.
document.getElementById('seo-prerender')?.remove()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/articulos" element={<ArticulosPage />} />
        <Route path="/articulos/:slug" element={<ArticuloPage />} />
        <Route path="/agentedeventas" element={<Suspense fallback={null}><AgenteDeVentasPage /></Suspense>} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
