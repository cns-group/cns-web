const SCROLL_OFFSET = 60

export function scrollToSection(id, { focus } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
    behavior: 'smooth',
  })
  if (focus) {
    el.querySelector('input, select, textarea')?.focus({ preventScroll: true })
  }
}

export function sectionClick(id, onSection, opts) {
  return (e) => {
    e.preventDefault()
    onSection?.(id, opts)
  }
}
