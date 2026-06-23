const API = window.location.origin + '/api'
const HEARTBEAT_INTERVAL = 300000
const SESSION_WARNING_TIME = 840000
const TOAST_DURATION = 4000

let heartbeatTimer = null
let sessionTimer = null
let connectionQuality = 'excellent'
let lastPing = 0

function getToken() {
  return localStorage.getItem('token')
}

function getUser() {
  return {
    email: localStorage.getItem('userEmail') || '',
    name: localStorage.getItem('userName') || '',
  }
}

function startHeartbeat() {
  stopHeartbeat()
  heartbeatTimer = setInterval(async () => {
    try {
      await apiFetch('/auth/profile', { method: 'GET', retries: 0 })
      checkConnectionQuality()
    } catch (e) { /* ignore */ }
  }, HEARTBEAT_INTERVAL)
  sessionTimer = setTimeout(() => {
    showToast('Sua sessão expirará em 1 minuto. Faça login novamente.', 'warning')
  }, SESSION_WARNING_TIME)
}

function stopHeartbeat() {
  if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null }
  if (sessionTimer) { clearTimeout(sessionTimer); sessionTimer = null }
}

async function checkConnectionQuality() {
  const start = performance.now()
  try {
    await fetch(`${API}/health`, { method: 'GET', cache: 'no-store' })
    lastPing = performance.now() - start
    if (lastPing < 150) connectionQuality = 'excellent'
    else if (lastPing < 500) connectionQuality = 'good'
    else connectionQuality = 'poor'
  } catch {
    connectionQuality = 'poor'
  }
  updateConnectionBadge()
}

function updateConnectionBadge() {
  const badges = document.querySelectorAll('.connection-badge')
  const dots = document.querySelectorAll('.connection-dot')
  badges.forEach(b => { b.className = `connection-badge ${connectionQuality}`; b.innerHTML = `<span class="connection-dot ${connectionQuality}"></span>${connectionQuality === 'excellent' ? 'LIVE' : connectionQuality === 'good' ? 'ESTÁVEL' : 'INSTÁVEL'}` })
  dots.forEach(d => { d.className = `connection-dot ${connectionQuality}` })
}

function startClock() {
  function tick() {
    const clocks = document.querySelectorAll('.header-clock')
    clocks.forEach(el => { el.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) })
  }
  tick(); setInterval(tick, 1000)
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer')
  if (!container) {
    container = document.createElement('div'); container.id = 'toastContainer'; container.className = 'toast-container'
    document.body.appendChild(container)
  }
  const toast = document.createElement('div'); toast.className = `toast ${type}`; toast.textContent = message
  container.appendChild(toast)
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)'; toast.style.transition = 'all 0.4s ease'; setTimeout(() => toast.remove(), 400) }, TOAST_DURATION)
}

async function apiFetch(path, options = {}) {
  const { retries = 2, ...fetchOptions } = options
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  }
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API}${path}`, { ...fetchOptions, headers })
      if (res.status === 401) {
        localStorage.removeItem('token'); localStorage.removeItem('userEmail'); localStorage.removeItem('userName')
        stopHeartbeat()
        window.location.href = '/admin/crm/pages/login.html'
        throw new Error('Unauthorized')
      }
      if (!res.ok && attempt < retries) {
        await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, attempt), 5000)))
        continue
      }
      return res
    } catch (err) {
      if (err.message === 'Unauthorized' || err.message === 'Failed to fetch') {
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, attempt), 5000)))
          continue
        }
      }
      throw err
    }
  }
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/admin/crm/pages/login.html'
    return
  }
  startHeartbeat()
  checkConnectionQuality()
  startClock()
  showToast('Conectado ao Nexus Horizon', 'success')
}

function goTo(page) {
  window.location.href = `/admin/crm/pages/${page}`
}

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId)
  if (!input || !button) return

  const shouldShow = input.type === 'password'
  input.type = shouldShow ? 'text' : 'password'
  button.textContent = shouldShow ? 'Ocultar' : 'Mostrar'
}

const MODAL_ICONS = {
  success: '&#10003;',
  error: '&#10007;',
  warning: '&#9888;',
  info: '&#9670;',
  confirm: '&#63;',
}

function showModal({ type = 'info', title, message, confirmText, cancelText, onConfirm, onClose, showClose = true }) {
  const existing = document.querySelector('.modal-overlay')
  if (existing) existing.remove()

  const iconHtml = `<div class="modal-icon ${type}">${MODAL_ICONS[type] || MODAL_ICONS.info}</div>`

  let actionsHtml = ''
  if (type === 'confirm') {
    actionsHtml = `<div class="modal-actions"><button class="btn-secondary" id="modalCancelBtn">${cancelText || 'Cancelar'}</button><button class="btn-primary" id="modalConfirmBtn">${confirmText || 'Confirmar'}</button></div>`
  } else {
    actionsHtml = `<div class="modal-actions"><button class="btn-primary" id="modalOkBtn">OK</button></div>`
  }

  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal-box">${showClose ? '<button class="modal-close" id="modalCloseBtn">&times;</button>' : ''}
      ${iconHtml}
      <div class="modal-body">
        <div class="modal-title">${title || ''}</div>
        <div class="modal-message">${message || ''}</div>
        ${actionsHtml}
      </div>
    </div>`

  document.body.appendChild(overlay)

  function closeModal() {
    overlay.classList.add('closing')
    const box = overlay.querySelector('.modal-box')
    if (box) box.classList.add('closing')
    setTimeout(() => { overlay.remove(); if (onClose) onClose() }, 350)
  }

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })

  setTimeout(() => {
    const closeBtn = document.getElementById('modalCloseBtn')
    if (closeBtn) closeBtn.addEventListener('click', closeModal)

    const okBtn = document.getElementById('modalOkBtn')
    if (okBtn) okBtn.addEventListener('click', closeModal)

    const confirmBtn = document.getElementById('modalConfirmBtn')
    if (confirmBtn) confirmBtn.addEventListener('click', () => { if (onConfirm) onConfirm(); closeModal() })

    const cancelBtn = document.getElementById('modalCancelBtn')
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal)
  }, 0)
}
