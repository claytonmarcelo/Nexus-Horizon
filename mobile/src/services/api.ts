import axios, { type InternalAxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'
import { deleteItem, getItem } from './secureStorage'

const REMOTE_API_URL = 'https://nexus-horizon.onrender.com/api'
const LOCAL_WEB_API_URL = 'http://localhost:3333/api'
const LOCAL_LOOPBACK_API_URL = 'http://127.0.0.1:3333/api'
const LOCAL_ANDROID_API_URL = 'http://10.0.2.2:3333/api'
const envApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim()

function getDefaultApiUrl(): string {
  if (envApiUrl) return envApiUrl
  if (Platform.OS === 'android') return LOCAL_ANDROID_API_URL
  return LOCAL_WEB_API_URL
}

function getCandidateApiUrls(): string[] {
  const urls = [
    envApiUrl,
    Platform.OS === 'android' ? LOCAL_ANDROID_API_URL : LOCAL_WEB_API_URL,
    LOCAL_WEB_API_URL,
    LOCAL_LOOPBACK_API_URL,
    REMOTE_API_URL,
  ].filter(Boolean) as string[]

  return [...new Set(urls)]
}

function getHealthUrl(apiUrl: string) {
  return `${apiUrl.replace(/\/api$/, '')}/health`
}

const defaultUrl = getDefaultApiUrl()
let apiBaseUrl = defaultUrl

export const api = axios.create({
  baseURL: defaultUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

async function detectApiUrl(force = false): Promise<string> {
  if (!force && apiBaseUrl && apiBaseUrl !== defaultUrl && !envApiUrl) {
    return apiBaseUrl
  }

  for (const candidate of getCandidateApiUrls()) {
    try {
      const response = await axios.get(getHealthUrl(candidate), { timeout: 3000 })

      if (response.status === 200) {
        apiBaseUrl = candidate
        api.defaults.baseURL = candidate
        console.log('[API] Detectada em:', candidate)
        return candidate
      }
    } catch {
      // Continua testando outras URLs até encontrar uma API válida.
    }
  }

  api.defaults.baseURL = apiBaseUrl
  console.warn('[API] Nenhuma API local detectada. Usando fallback:', apiBaseUrl)
  return apiBaseUrl
}

void detectApiUrl()

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!config.baseURL || config.baseURL === defaultUrl) {
    config.baseURL = await detectApiUrl()
  }

  const token = await getItem('token')
  if (token) {
    config.headers = {
      ...(config.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    } as any
  }

  return config
})

export const setAuthToken = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const removeAuthToken = () => {
  delete api.defaults.headers.common.Authorization
}

export async function restoreAuthSession() {
  const token = await getItem('token')

  if (!token) {
    return false
  }

  setAuthToken(token)

  try {
    await detectApiUrl(true)
    await api.get('/auth/profile')
    return true
  } catch (error) {
    console.warn('[Auth] Sessão inválida ou expirada. Limpando credenciais salvas.')
    await deleteItem('token')
    removeAuthToken()
    return false
  }
}
