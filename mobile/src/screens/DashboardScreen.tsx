import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import { colors, typography, spacing } from '../theme'
import { api, removeAuthToken } from '../services/api'
import { deleteItem } from '../services/secureStorage'
import { WaveScrollScreen } from '../components/WaveScrollScreen'

interface ConnectivityData {
  type: string
  status: string
  latency: number
  signal: number
}

export function DashboardScreen() {
  const navigation = useNavigation() as any
  const [data, setData] = useState<ConnectivityData | null>(null)
  const [activeProvider, setActiveProvider] = useState('satellite')

  const fetchData = useCallback(
    async (type: string) => {
      try {
        const response = await api.get(`/connectivity/${type}`)
        setData(response.data)
        setActiveProvider(type)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await deleteItem('token')
          removeAuthToken()
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
          return
        }

        Alert.alert('Erro', 'Falha ao buscar dados.')
      }
    },
    [navigation]
  )

  useFocusEffect(
    useCallback(() => {
      fetchData('satellite')
    }, [fetchData])
  )

  const providers = [
    { key: 'satellite', label: 'SAT' },
    { key: 'cellular', label: '5G' },
    { key: 'lifi', label: 'Li-Fi' },
    { key: 'directcell', label: 'DTC' },
  ]

  return (
    <WaveScrollScreen
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.providerRow}>
        {providers.map((provider, index) => (
          <TouchableOpacity
            key={provider.key}
            style={[
              styles.providerBtn,
              index < providers.length - 1 && styles.providerBtnMargin,
              activeProvider === provider.key && styles.providerBtnActive,
            ]}
            onPress={() => fetchData(provider.key)}
          >
            <Text
              style={[
                styles.providerText,
                activeProvider === provider.key && styles.providerTextActive,
              ]}
            >
              {provider.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {data ? (
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
      ) : null}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>TECNOLOGIAS ATIVAS</Text>
        <Text style={styles.infoText}>Direct-to-Cell · Open RAN · Li-Fi · 5G · Satélite</Text>
      </View>
    </WaveScrollScreen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  providerRow: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  providerBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: 'rgba(13, 17, 23, 0.54)',
  },
  providerBtnMargin: {
    marginRight: spacing.sm,
  },
  providerBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 245, 255, 0.12)',
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
    marginTop: 0,
    backgroundColor: 'rgba(22, 27, 34, 0.88)',
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
    marginTop: 0,
    backgroundColor: 'rgba(22, 27, 34, 0.88)',
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
    lineHeight: 21,
  },
})
