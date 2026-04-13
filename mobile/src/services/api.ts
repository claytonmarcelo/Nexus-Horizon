import axios from 'axios'
import { Platform } from 'react-native'

const baseURL = Platform.OS === 'web'
  ? 'http://localhost:3333/api'
  : 'http://192.168.0.153:3333/api'

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization']
}