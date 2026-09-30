export const LANDINGS = [
  { dir: 'landing-ecom', route: 'sistema-ecommerce' },
  { dir: 'landing-gym', route: 'sistema-gimnasios' },
]

// Mirrors the external redirects in vercel.json so they also work in `npm run dev`.
export const EXTERNAL_LANDINGS = [
  { route: 'sistema-gastronomia', url: 'https://cafe-resto-zeta.vercel.app/' },
]
