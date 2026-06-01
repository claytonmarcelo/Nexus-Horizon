import axios, { type InternalAxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const host =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3333'
    : 'http://localhost:3333'

export const api = axios.create({
  baseURL: `${host}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
