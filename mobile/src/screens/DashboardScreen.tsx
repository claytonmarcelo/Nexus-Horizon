import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { colors, typography, spacing } from '../theme'
import { api, removeAuthToken } from '../services/api'
import * as SecureStore from 'expo-secure-store'

interface ConnectivityData {
  type: string
  status: string
  latency: number
  signal: number
}

export function DashboardScreen({ navigation }: any) {
  const [data, setData] = useState<ConnectivityData | null>(null)
  const [activeProvider, setActiveProvider] = useState('satellite')

  const fetchData = async (type: string) => {
    try {
      const token = await SecureStore.getItemAsync('token')
      const response = await api.get(`/connectivity/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setData(response.data)
      setActiveProvider(type)
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar dados.')
    }
  }

  useEffect(() => {
    fetchData('satellite')
  }, [])

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token')
    removeAuthToken()
    navigation.replace('Login')
  }

  const providers = [
    { key: 'satellite', label: 'SAT' },
    { key: 'cellular', label: '5G' },
    { key: 'lifi', label: 'Li-Fi' },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>NEXUS HORIZON</Text>
          <Text style={styles.headerSub}>Sistema de Conectividade</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.providerRow}>
        {providers.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.providerBtn,
              activeProvider === p.key && styles.providerBtnActive,
            ]}
            onPress={() => fetchData(p.key)}
          >
            <Text
              style={[
                styles.providerText,
                activeProvider === p.key && styles.providerTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {data && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>STATUS</Text>
          <Text style={styles.cardValue}>{data.status}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>LATÊNCIA</Text>
              <Text style={styles.metricValue}>{data.latency} ms</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>SINAL</Text>
              <Text style={styles.metricValue}>{data.signal}%</Text>
            </View>
          </View>

          <View style={styles.signalBar}>
            <View style={[styles.signalFill, { width: `${data.signal}%` }]} />
          </View>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>TECNOLOGIAS ATIVAS</Text>
        <Text style={styles.infoText}>
          Direct-to-Cell · Open RAN · Li-Fi
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 4,
  },
  headerSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
    letterSpacing: 1,
  },
  logout: {
    color: colors.danger,
    fontSize: typography.fontSizes.sm,
    letterSpacing: 2,
  },
  providerRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  providerBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  providerBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
  },
  providerText: {
    color: colors.gray,
    fontWeight: '700',
    letterSpacing: 2,
  },
  providerTextActive: {
    color: colors.primary,
  },
  card: {
    margin: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: typography.fontSizes.md,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metric: {
    flex: 1,
    backgroundColor: colors.grayDark,
    borderRadius: 8,
    padding: spacing.md,
  },
  metricLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  signalBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  signalFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  infoCard: {
    margin: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: spacing.lg,
  },
  infoTitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.secondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    letterSpacing: 1,
  },
})