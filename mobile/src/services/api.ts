import axios, { type InternalAxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'
import { getItem } from './secureStorage'

const DEFAULT_ANDROID = 'http://10.0.2.2:3333/api'
const DEFAULT_IOS = 'http://localhost:3333/api'

const defaultUrl = Platform.OS === 'android' ? DEFAULT_ANDROID : DEFAULT_IOS

let apiBaseUrl = defaultUrl

async function detectApiUrl(): Promise<string> {
  if (apiBaseUrl && apiBaseUrl !== defaultUrl) return apiBaseUrl

  const urls = Platform.OS === 'android'
    ? [DEFAULT_ANDROID, 'http://localhost:3333/api', 'http://127.0.0.1:3333/api']
    : [DEFAULT_IOS, DEFAULT_ANDROID, 'http://127.0.0.1:3333/api']

  for (const url of urls) {
    try {
      const response = await axios.get(`${url.replace('/api', '')}/health`, { timeout: 2000 })
      if (response.status === 200) {
        apiBaseUrl = url
        console.log('[API] Detectado em:', apiBaseUrl)
        return apiBaseUrl
      }
    } catch (e) {
      // Continuar tentando
    }
  }

  console.warn('[API] Usando fallback:', apiBaseUrl)
  return apiBaseUrl
}

export const api = axios.create({
  baseURL: defaultUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

detectApiUrl().then(url => { api.defaults.baseURL = url })

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
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
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization']
}
