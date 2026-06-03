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
import { WaveBackground } from '../components/WaveBackground'

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }

    if (normalizedPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword,
      })

      if (!response.data) {
        throw new Error('Não foi possível concluir o cadastro.')
      }

      Alert.alert(
        'Cadastro concluído',
        'Sua conta foi criada com sucesso. Você será levado para a tela de login para revisar seus dados e entrar no sistema.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.replace('Login', {
                prefillEmail: normalizedEmail,
                prefillPassword: normalizedPassword,
                justRegistered: true,
                registeredName: normalizedName,
              }),
          },
        ]
      )
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || error.message || 'Falha na conexão com o servidor.'
      Alert.alert('Erro', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <WaveBackground />

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
            autoCorrect={false}
          />

          <Text style={styles.label}>SENHA</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              placeholderTextColor={colors.gray}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setPasswordVisible((current) => !current)}
            >
              <Text style={styles.passwordToggleText}>
                {passwordVisible ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

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
    overflow: 'hidden',
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
    maxWidth: 560,
    backgroundColor: 'rgba(22, 27, 34, 0.88)',
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
  passwordRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 88,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: spacing.sm,
    justifyContent: 'center',
  },
  passwordToggleText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
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
