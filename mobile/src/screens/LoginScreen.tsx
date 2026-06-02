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
  Modal,
  Pressable,
} from 'react-native'
import { colors, typography, spacing } from '../theme'
import { api, setAuthToken } from '../services/api'
import * as SecureStore from 'expo-secure-store'

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccessModalVisible, setLoginSuccessModalVisible] = useState(false)
  const [forgotModalVisible, setForgotModalVisible] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }
    setLoading(true)
    try {
      console.log('[Login] Iniciando login com email:', email)
      const response = await api.post('/auth/login', { email, password })
      console.log('[Login] Resposta:', response.data)
      
      const { token } = response.data
      await SecureStore.setItemAsync('token', token)
      setAuthToken(token)
      setLoginSuccessModalVisible(true)
    } catch (error: any) {
      console.log('[Login] Erro:', error.message)
      console.log('[Login] Response:', error.response?.data)
      
      const errorMsg = error.response?.data?.error || error.message || 'Falha na conexão com servidor'
      Alert.alert('Erro', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordRequest = async () => {
    if (!forgotEmail) {
      Alert.alert('Erro', 'Informe seu email para recuperação.')
      return
    }

    setForgotLoading(true)
    try {
      console.log('[ForgotPassword] Solicitando recuperação para:', forgotEmail)
      const response = await api.post('/auth/forgot-password', {
        email: forgotEmail,
      })
      console.log('[ForgotPassword] Resposta:', response.data)
      
      Alert.alert('Recuperação de senha', response.data?.message || 'Verifique sua caixa de entrada.')
      setForgotModalVisible(false)
      setForgotEmail('')
    } catch (error: any) {
      console.log('[ForgotPassword] Erro:', error.message)
      console.log('[ForgotPassword] Response:', error.response?.data)
      
      const errorMsg = error.response?.data?.error || error.message || 'Falha na conexão com servidor'
      Alert.alert('Erro', errorMsg)
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>NEXUS</Text>
        <Text style={styles.subtitle}>HORIZON</Text>
        <Text style={styles.tagline}>Next-Gen Connectivity</Text>

        <View style={styles.card}>
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
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>ACESSAR SISTEMA</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
            <Text style={styles.forgotLink}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Faça seu cadastro</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={loginSuccessModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Conectado</Text>
              <Text style={styles.modalSubtitle}>
                Está conectado ao fazer o login no sistema.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setLoginSuccessModalVisible(false)
                  navigation.replace('Dashboard')
                }}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={forgotModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Recuperar senha</Text>
              <Text style={styles.modalSubtitle}>
                Informe o email cadastrado para receber o link de redefinição.
              </Text>

              <TextInput
                style={styles.input}
                value={forgotEmail}
                onChangeText={setForgotEmail}
                placeholder="seu@email.com"
                placeholderTextColor={colors.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.button, forgotLoading && styles.buttonDisabled]}
                onPress={handleForgotPasswordRequest}
                disabled={forgotLoading}
              >
                {forgotLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.buttonText}>Enviar email</Text>
                )}
              </TouchableOpacity>

              <Pressable
                style={styles.modalClose}
                onPress={() => setForgotModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.xl,
    letterSpacing: 2,
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
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: typography.fontSizes.sm,
    letterSpacing: 2,
  },
  forgotLink: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: typography.fontSizes.sm,
  },
  link: {
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.fontSizes.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    color: colors.gray,
    fontSize: typography.fontSizes.xs,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  modalClose: {
    padding: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  modalCloseText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: typography.fontSizes.sm,
  },
})