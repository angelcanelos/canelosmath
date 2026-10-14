// Catálogo de temas de color. Cada tema define las variables CSS de la página;
// `resta` y `caret` se derivan de `error` y `main` si no se indican.

export const TEMAS = [
  // Oscuros
  { id: 'canelos', nombre: 'canelos', oscuro: true, bg: '#2b2637', main: '#b6a0e6', sub: '#6f6787', subAlt: '#241f2f', text: '#e6e1f0', error: '#e0707f', suma: '#7fcf9a', oro: '#f2c46d' },
  { id: 'serika-dark', nombre: 'serika dark', oscuro: true, bg: '#323437', main: '#e2b714', sub: '#646669', subAlt: '#2c2e31', text: '#d1d0c5', error: '#ca4754', suma: '#8fbf6f', oro: '#f0a04b' },
  { id: 'dracula', nombre: 'dracula', oscuro: true, bg: '#282a36', main: '#bd93f9', sub: '#6272a4', subAlt: '#20222c', text: '#f8f8f2', error: '#ff5555', suma: '#50fa7b', oro: '#f1fa8c' },
  { id: 'nord', nombre: 'nord', oscuro: true, bg: '#2e3440', main: '#88c0d0', sub: '#4c566a', subAlt: '#272c36', text: '#eceff4', error: '#bf616a', suma: '#a3be8c', oro: '#ebcb8b' },
  { id: 'monokai', nombre: 'monokai', oscuro: true, bg: '#272822', main: '#66d9ef', sub: '#75715e', subAlt: '#1e1f1c', text: '#f8f8f2', error: '#f92672', suma: '#a6e22e', oro: '#e6db74' },
  { id: 'gruvbox-dark', nombre: 'gruvbox dark', oscuro: true, bg: '#282828', main: '#d79921', sub: '#665c54', subAlt: '#1d2021', text: '#ebdbb2', error: '#fb4934', suma: '#b8bb26', oro: '#fe8019' },
  { id: 'solarized-dark', nombre: 'solarized dark', oscuro: true, bg: '#002b36', main: '#268bd2', sub: '#586e75', subAlt: '#00212b', text: '#93a1a1', error: '#dc322f', suma: '#859900', oro: '#b58900' },
  { id: 'catppuccin-mocha', nombre: 'catppuccin mocha', oscuro: true, bg: '#1e1e2e', main: '#cba6f7', sub: '#6c7086', subAlt: '#181825', text: '#cdd6f4', error: '#f38ba8', suma: '#a6e3a1', oro: '#f9e2af' },
  { id: 'tokyo-night', nombre: 'tokyo night', oscuro: true, bg: '#1a1b26', main: '#7aa2f7', sub: '#565f89', subAlt: '#16161e', text: '#c0caf5', error: '#f7768e', suma: '#9ece6a', oro: '#e0af68' },
  { id: 'rose-pine', nombre: 'rosé pine', oscuro: true, bg: '#191724', main: '#ebbcba', sub: '#6e6a86', subAlt: '#1f1d2e', text: '#e0def4', error: '#eb6f92', suma: '#9ccfd8', oro: '#f6c177' },
  { id: 'synthwave', nombre: 'synthwave', oscuro: true, bg: '#262335', main: '#ff7edb', sub: '#6d5f8f', subAlt: '#1e1b2b', text: '#f2f2f2', error: '#fe4450', suma: '#72f1b8', oro: '#fede5d' },
  { id: '8008', nombre: '8008', oscuro: true, bg: '#333a45', main: '#f44c7f', sub: '#939eae', subAlt: '#2b313a', text: '#e9ecf0', error: '#da3333', suma: '#7fd18b', oro: '#f2c46d' },
  { id: 'carbon', nombre: 'carbon', oscuro: true, bg: '#313131', main: '#f66e0d', sub: '#616161', subAlt: '#2a2a2a', text: '#f5e6c8', error: '#e72d2d', suma: '#8bc34a', oro: '#ffc107' },
  { id: 'olivia', nombre: 'olivia', oscuro: true, bg: '#1c1b1d', main: '#deaf9d', sub: '#4e3e3e', subAlt: '#151415', text: '#f2efed', error: '#bf616a', suma: '#a3be8c', oro: '#ebcb8b' },
  { id: 'bosque', nombre: 'bosque', oscuro: true, bg: '#1f2a24', main: '#8fc79b', sub: '#5b6e62', subAlt: '#19221d', text: '#dfe8e1', error: '#e07b6f', suma: '#b5d98a', oro: '#e8c76a' },
  { id: 'oceano', nombre: 'océano', oscuro: true, bg: '#0f2633', main: '#4fd1c5', sub: '#3d6475', subAlt: '#0b1e29', text: '#d6eef5', error: '#ff7a7a', suma: '#7ee39a', oro: '#ffd166' },
  { id: 'cafe', nombre: 'café', oscuro: true, bg: '#2a211c', main: '#d9a066', sub: '#6e5a4c', subAlt: '#221a16', text: '#eadccf', error: '#e06c5f', suma: '#9cc27a', oro: '#f0c24b' },
  { id: 'terminal', nombre: 'terminal', oscuro: true, bg: '#000000', main: '#00ff66', sub: '#3d6b4c', subAlt: '#0a120d', text: '#c8ffd9', error: '#ff3355', suma: '#00ff66', oro: '#ffee00' },
  // Claros
  { id: 'serika', nombre: 'serika', oscuro: false, bg: '#e1e1e3', main: '#e2b714', sub: '#aaaeb3', subAlt: '#d1d3d8', text: '#323437', error: '#da3333', suma: '#4e9a43', oro: '#c98a1c' },
  { id: 'nord-light', nombre: 'nord light', oscuro: false, bg: '#eceff4', main: '#5e81ac', sub: '#9aa5b8', subAlt: '#dfe3eb', text: '#2e3440', error: '#bf616a', suma: '#6f9a55', oro: '#c59a3c' },
  { id: 'gruvbox-light', nombre: 'gruvbox light', oscuro: false, bg: '#fbf1c7', main: '#b57614', sub: '#a89984', subAlt: '#ebdbb2', text: '#3c3836', error: '#cc241d', suma: '#79740e', oro: '#d65d0e' },
  { id: 'solarized-light', nombre: 'solarized light', oscuro: false, bg: '#fdf6e3', main: '#268bd2', sub: '#93a1a1', subAlt: '#eee8d5', text: '#586e75', error: '#dc322f', suma: '#859900', oro: '#b58900' },
  { id: 'catppuccin-latte', nombre: 'catppuccin latte', oscuro: false, bg: '#eff1f5', main: '#8839ef', sub: '#9ca0b0', subAlt: '#e6e9ef', text: '#4c4f69', error: '#d20f39', suma: '#40a02b', oro: '#df8e1d' },
  { id: 'rose-pine-dawn', nombre: 'rosé pine dawn', oscuro: false, bg: '#faf4ed', main: '#d7827e', sub: '#9893a5', subAlt: '#f2e9e1', text: '#575279', error: '#b4637a', suma: '#286983', oro: '#ea9d34' },
  { id: 'fresa', nombre: 'fresa', oscuro: false, bg: '#f7e3e6', main: '#e05a7a', sub: '#c4a1a8', subAlt: '#efd2d7', text: '#5a2e38', error: '#c0392b', suma: '#3f8f5a', oro: '#d98b2b' },
  { id: 'papel', nombre: 'papel', oscuro: false, bg: '#eeeeee', main: '#444444', sub: '#b2b2b2', subAlt: '#dddddd', text: '#444444', error: '#d70000', suma: '#2e7d32', oro: '#b8860b' },
]

export const getTema = (id) => TEMAS.find((t) => t.id === id) ?? TEMAS[0]

export function aplicarTema(tema) {
  const r = document.documentElement.style
  r.setProperty('--bg', tema.bg)
  r.setProperty('--main', tema.main)
  r.setProperty('--caret', tema.caret ?? tema.main)
  r.setProperty('--sub', tema.sub)
  r.setProperty('--sub-alt', tema.subAlt)
  r.setProperty('--text', tema.text)
  r.setProperty('--error', tema.error)
  r.setProperty('--suma', tema.suma)
  r.setProperty('--resta', tema.resta ?? tema.error)
  r.setProperty('--oro', tema.oro)
  r.setProperty('color-scheme', tema.oscuro ? 'dark' : 'light')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema.bg)
}
