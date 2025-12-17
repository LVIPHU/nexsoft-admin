export function updateNavbarStyle(value: 'sticky' | 'scroll') {
  const target = document.querySelector('header[data-navbar-style]')
  if (target) {
    target.setAttribute('data-navbar-style', value)
  }
}
