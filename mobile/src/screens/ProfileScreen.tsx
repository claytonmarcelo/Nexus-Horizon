import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { colors, spacing } from '../theme'
import { api, removeAuthToken } from '../services/api'
import { deleteItem } from '../services/secureStorage'

export function ProfileScreen() {
  const navigation = useNavigation() as any
  const [profile, setProfile] = useState<any>(null)

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
          Alert.alert('Erro', 'Não foi possível carregar o perfil.')
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [navigation])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profile?.name?.charAt(0)?.toUpperCase() || 'N'}</Text>
      </View>
      <Text style={styles.name}>{profile?.name || 'Carregando...'}</Text>
      <Text style={styles.email}>{profile?.email || '--'}</Text>
      <Field label="PLANO" value={profile?.plan || 'Nexus Pro'} />
      <Field label="MEMBRO DESDE" value={profile?.createdAt ? new Date(profile.createdAt).getFullYear().toString() : '2026'} />
      <Field label="CONEXÕES" value={String(profile?.totalConnections || 0)} />
      <Field label="ÚLTIMO ACESSO" value={profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString('pt-BR') : '--'} />
      <View style={styles.securityCard}>
        <Text style={styles.securityTitle}>SEGURANÇA</Text>
        <Text style={styles.securityText}>Dados protegidos com JWT + AES-256. Todas as conexões são criptografadas. Token expira em 7 dias.</Text>
      </View>
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  avatarText: { fontSize: 28, fontWeight: '800', color: colors.background },
  name: { fontSize: 20, fontWeight: '700', color: colors.white, marginBottom: 4 },
  email: { fontSize: 13, color: colors.gray, marginBottom: spacing.lg },
  field: { width: '100%', backgroundColor: colors.cardBg, borderRadius: 8, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { fontSize: 11, color: colors.gray, letterSpacing: 2 },
  fieldValue: { fontSize: 13, fontWeight: '600', color: colors.primary },
  securityCard: { width: '100%', backgroundColor: colors.cardBg, borderRadius: 16, borderWidth: 1, borderColor: colors.secondary, padding: spacing.lg, marginTop: spacing.sm },
  securityTitle: { fontSize: 11, color: colors.secondary, letterSpacing: 2, marginBottom: spacing.sm },
  securityText: { fontSize: 13, color: colors.gray, letterSpacing: 1, lineHeight: 20 },
})
