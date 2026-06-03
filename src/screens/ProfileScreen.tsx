import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { colors, spacing, typography } from '../theme'
import { api, removeAuthToken } from '../services/api'
import { deleteItem } from '../services/secureStorage'
import { WaveScrollScreen } from '../components/WaveScrollScreen'
import { getClientContext } from '../services/deviceContext'

type LoginContext = {
  deviceLabel?: string
  systemName?: string
  systemVersion?: string
  runtime?: string
  recordedAt?: string
}

export function ProfileScreen() {
  const navigation = useNavigation() as any
  const [profile, setProfile] = useState<any>(null)
  const currentContext = useMemo(() => getClientContext(), [])
  const loginContext = (profile?.lastLoginContext || null) as LoginContext | null

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const res = await api.get('/auth/profile')

        if (isMounted) {
          setProfile(res.data)
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await deleteItem('token')
          removeAuthToken()
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
          return
        }

        if (isMounted) {
          Alert.alert('Erro', 'Nao foi possivel carregar o perfil.')
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [navigation])

  const lastAccessDevice = loginContext?.deviceLabel || currentContext.deviceLabel
  const lastAccessSystem = loginContext?.systemName
    ? `${loginContext.systemName} ${loginContext.systemVersion || ''}`.trim()
    : `${currentContext.systemName} ${currentContext.systemVersion}`.trim()
  const lastAccessRuntime = loginContext?.runtime || currentContext.runtime

  return (
    <WaveScrollScreen
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profile?.name?.charAt(0)?.toUpperCase() || 'N'}</Text>
      </View>

      <Text style={styles.name}>{profile?.name || 'Carregando...'}</Text>
      <Text style={styles.email}>{profile?.email || '--'}</Text>

      <Field label="PLANO" value={profile?.plan || 'Nexus Pro'} />
      <Field
        label="MEMBRO DESDE"
        value={profile?.createdAt ? new Date(profile.createdAt).getFullYear().toString() : '2026'}
      />
      <Field label="CONEXOES" value={String(profile?.totalConnections || 0)} />
      <Field
        label="ULTIMO ACESSO"
        value={profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString('pt-BR') : '--'}
      />

      <View style={styles.deviceCard}>
        <Text style={styles.deviceTitle}>DISPOSITIVO DA SESSAO</Text>

        <View style={styles.deviceGrid}>
          <View style={styles.deviceField}>
            <Text style={styles.deviceLabel}>TIPO</Text>
            <Text style={styles.deviceValue}>{lastAccessDevice}</Text>
          </View>

          <View style={styles.deviceField}>
            <Text style={styles.deviceLabel}>SISTEMA</Text>
            <Text style={styles.deviceValue}>{lastAccessSystem}</Text>
          </View>
        </View>

        <View style={styles.deviceFieldFull}>
          <Text style={styles.deviceLabel}>AMBIENTE</Text>
          <Text style={styles.deviceValue}>{lastAccessRuntime}</Text>
        </View>
      </View>

      <View style={styles.securityCard}>
        <Text style={styles.securityTitle}>SEGURANCA</Text>
        <Text style={styles.securityText}>
          Dados protegidos com JWT e conexoes autenticadas. O sistema registra o contexto
          do dispositivo no login para facilitar validacao de acesso e acompanhamento da sessao.
        </Text>
      </View>
    </WaveScrollScreen>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.background,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  email: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.lg,
  },
  field: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
    letterSpacing: 2,
  },
  fieldValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  deviceCard: {
    width: '100%',
    backgroundColor: 'rgba(22, 27, 34, 0.88)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.18)',
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  deviceTitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  deviceGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  deviceField: {
    flex: 1,
    backgroundColor: colors.grayDark,
    borderRadius: 10,
    padding: spacing.md,
  },
  deviceFieldFull: {
    backgroundColor: colors.grayDark,
    borderRadius: 10,
    padding: spacing.md,
  },
  deviceLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  deviceValue: {
    fontSize: typography.fontSizes.sm,
    color: colors.white,
    fontWeight: '700',
    lineHeight: 20,
  },
  securityCard: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  securityTitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.secondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  securityText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    letterSpacing: 1,
    lineHeight: 20,
  },
})
