import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Alert } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import { LoginScreen } from '../screens/LoginScreen'
import { RegisterScreen } from '../screens/RegisterScreen'
import { DashboardScreen } from '../screens/DashboardScreen'
import { SatelliteScreen } from '../screens/SatelliteScreen'
import { LiFiScreen } from '../screens/LiFiScreen'
import { OranScreen } from '../screens/OranScreen'
import { DtcScreen } from '../screens/DtcScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { HistoryScreen } from '../screens/HistoryScreen'
import { AboutScreen } from '../screens/AboutScreen'
import { colors } from '../theme'
import { removeAuthToken, restoreAuthSession } from '../services/api'
import * as SecureStore from 'expo-secure-store'


const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function DrawerContent(props: any) {
  const navigation = useNavigation() as any

  const handleLogout = async () => {
    console.log('[Logout] Iniciando logout...')
    try {
      // Tenta deletar do SecureStore
      try {
        await SecureStore.deleteItemAsync('token')
        console.log('[Logout] Token deletado do SecureStore')
      } catch (e) {
        console.log('[Logout] SecureStore não disponível, usando localStorage')
      }
      
      // Limpa token do localStorage (fallback para web)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token')
        console.log('[Logout] Token deletado do localStorage')
      }
      
      removeAuthToken()
      console.log('[Logout] Auth token removido da API')
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
      console.log('[Logout] Navegação resetada para Login')
    } catch (error) {
      console.error('[Logout] Erro:', error)
      Alert.alert('Erro', 'Falha ao fazer logout.')
    }
  }

  const handleClearCache = async () => {
    console.log('[ClearCache] Iniciando limpeza de cache...')
    try {
      // Tenta obter token do SecureStore
      let token = null
      try {
        token = await SecureStore.getItemAsync('token')
        console.log('[ClearCache] Token obtido do SecureStore:', token ? 'sim' : 'não')
      } catch (e) {
        console.log('[ClearCache] SecureStore não disponível, usando localStorage')
        if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem('token')
        }
      }
      
      // Limpa AsyncStorage
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default
        await AsyncStorage.clear()
        console.log('[ClearCache] AsyncStorage limpo')
      } catch (e) {
        console.log('[ClearCache] AsyncStorage não disponível')
      }
      
      // Limpa outros dados do SecureStore
      try {
        await SecureStore.deleteItemAsync('userContext')
        await SecureStore.deleteItemAsync('deviceContext')
        console.log('[ClearCache] Contextos deletados do SecureStore')
      } catch (e) {
        console.log('[ClearCache] SecureStore não disponível, limpando localStorage')
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('userContext')
          localStorage.removeItem('deviceContext')
        }
      }
      
      // Limpa localStorage (fallback para web)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('userContext')
        localStorage.removeItem('deviceContext')
        console.log('[ClearCache] Contextos deletados do localStorage')
      }
      
      // Restaura o token para manter sessão
      if (token) {
        const { setAuthToken } = require('../services/api')
        setAuthToken(token)
        console.log('[ClearCache] Token restaurado na API')
      }
      
      Alert.alert('Sucesso', 'Cache limpo com sucesso. Você continua logado.')
      console.log('[ClearCache] Limpeza concluída com sucesso')
    } catch (error) {
      console.error('[ClearCache] Erro:', error)
      Alert.alert('Erro', 'Falha ao limpar cache.')
    }
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={drawerStyles.scroll}>
      <View style={drawerStyles.contentContainer}>
        <Text style={drawerStyles.brand}>NEXUS</Text>
        <Text style={drawerStyles.sub}>HORIZON</Text>
        <DrawerItemList {...props} />
        <TouchableOpacity style={drawerStyles.cacheBtn} onPress={handleClearCache}>
          <Text style={drawerStyles.cacheText}>🗑️ Limpar Cache</Text>
        </TouchableOpacity>
        <TouchableOpacity style={drawerStyles.logoutBtn} onPress={handleLogout}>
          <Text style={drawerStyles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  )
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { letterSpacing: 2 } as any,
        drawerStyle: { backgroundColor: colors.background, width: 280 },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.gray,
        drawerActiveBackgroundColor: 'rgba(0, 245, 255, 0.08)',
        drawerLabelStyle: { letterSpacing: 1, fontSize: 13 },
        headerLeft: ({ tintColor }) => {
          const navigation = useNavigation() as any
          return (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Text style={{ color: tintColor, fontSize: 24, marginLeft: 16 }}>☰</Text>
            </TouchableOpacity>
          )
        },
      }}
    >
      <Drawer.Screen
        name="Conectividade"
        component={DashboardScreen}
        options={{ headerTitle: 'NEXUS HORIZON' }}
      />
      <Drawer.Screen name="Mapa Satelital" component={SatelliteScreen} />
      <Drawer.Screen name="Simulador Li-Fi" component={LiFiScreen} />
      <Drawer.Screen name="Open RAN" component={OranScreen} />
      <Drawer.Screen name="Direct-to-Cell" component={DtcScreen} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Historico" component={HistoryScreen} />
      <Drawer.Screen name="Sobre" component={AboutScreen} />
    </Drawer.Navigator>
  )
}

export function Navigation() {
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [initialRouteName, setInitialRouteName] = useState<'Login' | 'Dashboard'>('Login')

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      const isAuthenticated = await restoreAuthSession()

      if (!isMounted) {
        return
      }

      setInitialRouteName(isAuthenticated ? 'Dashboard' : 'Login')
      setIsBootstrapping(false)
    }

    void bootstrap()

    return () => {
      isMounted = false
    }
  }, [])

  if (isBootstrapping) {
    return (
      <View style={bootStyles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={bootStyles.label}>Carregando sessão...</Text>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { letterSpacing: 2 } as any,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'CADASTRO' }} />
        <Stack.Screen name="Dashboard" component={MainDrawer} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const drawerStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 32,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  contentContainer: {
    zIndex: 1,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.secondary,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 32,
  },
  cacheBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.4)',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 255, 0.05)',
  },
  cacheText: {
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
    fontSize: 13,
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,49,49,0.4)',
    alignItems: 'center',
    backgroundColor: 'rgba(255,49,49,0.05)',
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '700',
    letterSpacing: 3,
    fontSize: 13,
  },
})

const bootStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 16,
    overflow: 'hidden',
  },
  label: {
    color: colors.gray,
    fontSize: 14,
    letterSpacing: 1,
  },
})
