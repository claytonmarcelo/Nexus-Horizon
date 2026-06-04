import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { colors, spacing, typography } from '../theme'
import { api, removeAuthToken } from '../services/api'
import * as SecureStore from 'expo-secure-store'
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
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
          await SecureStore.deleteItemAsync('token')
          removeAuthToken()
          navigation.navigate('Login')
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

  const handleDeleteAccount = async () => {
    console.log('[DeleteAccount] Iniciando exclusão de conta...')
    setDeleteLoading(true)
    try {
      console.log('[DeleteAccount] Chamando API DELETE /auth/account')
      await api.delete('/auth/account')
      console.log('[DeleteAccount] Conta excluída com sucesso na API')
      await SecureStore.deleteItemAsync('token')
      console.log('[DeleteAccount] Token deletado do SecureStore')
      removeAuthToken()
      console.log('[DeleteAccount] Auth token removido da API')
      Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso. Esta ação não pode ser revertida.')
      console.log('[DeleteAccount] Alerta exibida, navegando para Login')
      navigation.navigate('Login')
      console.log('[DeleteAccount] Navegação para Login concluída')
    } catch (error: any) {
      console.error('[DeleteAccount] Erro:', error)
      console.error('[DeleteAccount] Resposta do erro:', error.response?.data)
      const errorMsg = error.response?.data?.error || 'Falha ao excluir conta. Tente novamente.'
      Alert.alert('Erro', errorMsg)
    } finally {
      console.log('[DeleteAccount] Finalizando processo de exclusão')
      setDeleteLoading(false)
      setDeleteModalVisible(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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

      <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
        <Text style={styles.deleteButtonText}>Excluir Conta</Text>
      </TouchableOpacity>

      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Excluir Conta</Text>
            <Text style={styles.modalSubtitle}>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser revertida e todos
              os seus dados serão permanentemente removidos.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleteLoading}
              >
                <Text style={styles.modalButtonTextCancel}>Não</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalButtonTextConfirm}>Sim, Excluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    backgroundColor: colors.background,
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
  deleteButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 49, 49, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 49, 49, 0.3)',
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: typography.fontSizes.sm,
    fontWeight: '700',
    letterSpacing: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.grayDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonConfirm: {
    backgroundColor: colors.danger,
  },
  modalButtonTextCancel: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalButtonTextConfirm: {
    color: colors.background,
    fontSize: typography.fontSizes.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },
})
