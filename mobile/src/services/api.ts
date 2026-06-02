import axios, { type InternalAxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

let apiBaseUrl = ''

// Detectar a URL da API dinamicamente
async function detectApiUrl(): Promise<string> {
  if (apiBaseUrl) return apiBaseUrl

  const urls = [
    'http://10.0.2.2:3333/api',      // Android emulator
    'http://localhost:3333/api',      // iOS simulator
    'http://127.0.0.1:3333/api',      // Fallback
    `http://${getHostIp()}:3333/api`,  // Detectado automaticamente
  ]

  for (const url of urls) {
    try {
      const response = await axios.get(`${url.replace('/api', '')}/health`, {
        timeout: 2000,
      })
      if (response.status === 200) {
        apiBaseUrl = url
        console.log('[API] Detected at:', apiBaseUrl)
        return apiBaseUrl
      }
    } catch (e) {
      // Continue trying next URL
    }
  }

  // Fallback padrão
  apiBaseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:3333/api'
    : 'http://localhost:3333/api'
  console.warn('[API] Using fallback:', apiBaseUrl)
  return apiBaseUrl
}

function getHostIp(): string {
  // Tenta extrair do Expo debuggerHost ou usar IP padrão
  // Este é o IP local onde o servidor está rodando
  return '192.168.0.153' // IP da máquina local
}

export const api = axios.create({
  baseURL: `http://10.0.2.2:3333/api`, // URL padrão, será atualizada
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Inicializar detecção de API no carregamento
detectApiUrl().then(url => {
  api.defaults.baseURL = url
})

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync('token')

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
