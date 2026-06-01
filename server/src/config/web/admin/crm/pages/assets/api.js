const API = window.location.origin + '/api'

function getToken() {
  return localStorage.getItem('token')
}

function getUser() {
  return {
    email: localStorage.getItem('userEmail') || '',
    name: localStorage.getItem('userName') || '',
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    window.location.href = '/admin/crm/pages/login.html'
    throw new Error('Unauthorized')
  }
  return res
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/admin/crm/pages/login.html'
  }
}

function goTo(page) {
  window.location.href = `/admin/crm/pages/${page}`
}
