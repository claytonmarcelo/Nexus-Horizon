import { Dimensions, Platform } from 'react-native'

export type ClientContext = {
  deviceType: string
  deviceLabel: string
  systemName: string
  systemVersion: string
  runtime: string
}

function getViewportWidth() {
  return Dimensions.get('window').width
}

function getWebBrowserInfo(userAgent: string) {
  if (/Edg\/([\d.]+)/.test(userAgent)) {
    return `Microsoft Edge ${RegExp.$1}`
  }

  if (/Chrome\/([\d.]+)/.test(userAgent) && !/Edg\//.test(userAgent)) {
    return `Google Chrome ${RegExp.$1}`
  }

  if (/Firefox\/([\d.]+)/.test(userAgent)) {
    return `Mozilla Firefox ${RegExp.$1}`
  }

  if (/Version\/([\d.]+).*Safari/.test(userAgent) && !/Chrome\//.test(userAgent)) {
    return `Safari ${RegExp.$1}`
  }

  return 'Navegador Web'
}

function getWebSystemInfo() {
  if (typeof navigator === 'undefined') {
    return {
      deviceType: 'web',
      deviceLabel: 'Navegador Web',
      systemName: 'Web',
      systemVersion: '--',
      runtime: 'Navegador Web',
    }
  }

  const userAgent = navigator.userAgent
  const width = getViewportWidth()

  let systemName = 'Web'
  let systemVersion = '--'
  let deviceLabel = width >= 1180 ? 'Desktop Web' : width >= 768 ? 'Tablet Web' : 'Mobile Web'
  let deviceType = width >= 1180 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile'

  if (/Android\s([\d.]+)/i.test(userAgent)) {
    systemName = 'Android'
    systemVersion = RegExp.$1
    deviceLabel = width >= 768 ? 'Tablet Android' : 'Smartphone Android'
    deviceType = width >= 768 ? 'tablet' : 'mobile'
  } else if (/iPhone OS\s([\d_]+)/i.test(userAgent)) {
    systemName = 'iOS'
    systemVersion = RegExp.$1.replace(/_/g, '.')
    deviceLabel = 'iPhone'
    deviceType = 'mobile'
  } else if (/iPad.*OS\s([\d_]+)/i.test(userAgent) || /MacIntel/i.test(navigator.platform) && navigator.maxTouchPoints > 1) {
    systemName = 'iPadOS'
    systemVersion = /OS\s([\d_]+)/i.test(userAgent) ? RegExp.$1.replace(/_/g, '.') : '--'
    deviceLabel = 'iPad'
    deviceType = 'tablet'
  } else if (/Windows NT\s([\d.]+)/i.test(userAgent)) {
    systemName = 'Windows'
    systemVersion = RegExp.$1
    deviceLabel = width >= 1180 ? 'Desktop Windows' : 'Notebook Windows'
    deviceType = 'desktop'
  } else if (/Mac OS X\s([\d_]+)/i.test(userAgent)) {
    systemName = 'macOS'
    systemVersion = RegExp.$1.replace(/_/g, '.')
    deviceLabel = width >= 1180 ? 'iMac / Mac Studio' : 'MacBook'
    deviceType = 'desktop'
  } else if (/Linux/i.test(userAgent)) {
    systemName = 'Linux'
    systemVersion = '--'
    deviceLabel = 'Desktop Linux'
    deviceType = 'desktop'
  }

  return {
    deviceType,
    deviceLabel,
    systemName,
    systemVersion,
    runtime: getWebBrowserInfo(userAgent),
  }
}

export function getClientContext(): ClientContext {
  if (Platform.OS === 'web') {
    return getWebSystemInfo()
  }

  const width = getViewportWidth()
  const systemVersion = String(Platform.Version ?? '--')
  const isTablet = width >= 768

  if (Platform.OS === 'android') {
    return {
      deviceType: isTablet ? 'tablet' : 'mobile',
      deviceLabel: isTablet ? 'Tablet Android' : 'Smartphone Android',
      systemName: 'Android',
      systemVersion,
      runtime: 'Expo Android',
    }
  }

  if (Platform.OS === 'ios') {
    return {
      deviceType: isTablet ? 'tablet' : 'mobile',
      deviceLabel: isTablet ? 'iPad' : 'iPhone',
      systemName: 'iOS',
      systemVersion,
      runtime: 'Expo iOS',
    }
  }

  return {
    deviceType: 'desktop',
    deviceLabel: 'Dispositivo React Native',
    systemName: Platform.OS,
    systemVersion,
    runtime: 'Expo',
  }
}
