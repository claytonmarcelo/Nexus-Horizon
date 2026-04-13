import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { colors, typography, spacing } from '../theme'
import { api } from '../services/api'

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      Alert.alert('Sucesso', 'Conta criada! Faça login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ])
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha no cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>NEXUS</Text>
        <Text style={styles.subtitle}>CADASTRO</Text>

        <View style={styles.card}>
          <Text style={styles.label}>NOME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={colors.gray}
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.gray}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>CRIAR CONTA</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Já tem conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.secondary,
    letterSpacing: 8,
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.grayDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    color: colors.white,
    fontSize: typography.fontSizes.md,
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.fontSizes.sm,
    letterSpacing: 2,
  },
  link: {
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.fontSizes.sm,
  },
})