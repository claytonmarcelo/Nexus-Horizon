import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native'
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
import { deleteItem } from '../services/secureStorage'
import { WaveBackground } from '../components/WaveBackground'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function DrawerContent(props: any) {
  const navigation = useNavigation() as any

  const handleLogout = async () => {
    await deleteItem('token')
    removeAuthToken()
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={drawerStyles.scroll}>
      <WaveBackground />
      <Text style={drawerStyles.brand}>NEXUS</Text>
      <Text style={drawerStyles.sub}>HORIZON</Text>
      <DrawerItemList {...props} />
      <TouchableOpacity style={drawerStyles.logoutBtn} onPress={handleLogout}>
        <Text style={drawerStyles.logoutText}>SAIR</Text>
      </TouchableOpacity>
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
        <WaveBackground />
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
    position: 'relative',
    overflow: 'hidden',
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
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
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
