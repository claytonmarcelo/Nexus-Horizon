import React, { useEffect, useState } from 'react'
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
import * as storage from '../services/secureStorage'
import { WaveBackground } from '../components/WaveBackground'
import { getClientContext } from '../services/deviceContext'

export function LoginScreen({ navigation, route }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginSuccessModalVisible, setLoginSuccessModalVisible] = useState(false)
  const [forgotModalVisible, setForgotModalVisible] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [registerNotice, setRegisterNotice] = useState('')

  useEffect(() => {
    const params = route?.params

    if (!params) {
      return
    }

    if (params.prefillEmail) {
      setEmail(params.prefillEmail)
      setForgotEmail(params.prefillEmail)
    }

    if (params.prefillPassword) {
      setPassword(params.prefillPassword)
    }

    if (params.justRegistered) {
      setRegisterNotice(
        `Cadastro concluído${params.registeredName ? ` para ${params.registeredName}` : ''}. Revise seus dados e toque em "Acessar sistema".`
      )
    }
  }, [route?.params])

  useEffect(() => {
    if (!loginSuccessModalVisible) {
      return
    }

    const timer = setTimeout(() => {
      setLoginSuccessModalVisible(false)
      navigation.replace('Dashboard')
    }, 3000)

    return () => clearTimeout(timer)
  }, [loginSuccessModalVisible, navigation])

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()

    if (!normalizedEmail || !normalizedPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }

    setLoading(true)

    try {
      const clientContext = getClientContext()
      console.log('[Login] Tentando login para:', normalizedEmail)
      
      const response = await api.post('/auth/login', {
        email: normalizedEmail,
        password: normalizedPassword,
        clientContext,
      })

      console.log('[Login] Resposta recebida:', response.status)
      const { token } = response.data
      
      if (!token) {
        throw new Error('Token não recebido do servidor.')
      }

      await storage.setItem('token', token)
      setAuthToken(token)
      setRegisterNotice('')
      setLoginSuccessModalVisible(true)
    } catch (error: any) {
      console.error('[Login] Erro:', error)
      
      let errorMsg = 'Falha na conexão com o servidor.'
      
      if (error.response) {
        console.error('[Login] Status:', error.response.status)
        console.error('[Login] Data:', error.response.data)
        errorMsg = error.response?.data?.error || `Erro ${error.response.status}`
      } else if (error.request) {
        errorMsg = 'Servidor não respondeu. Verifique sua conexão.'
      } else {
        errorMsg = error.message || errorMsg
      }
      
      Alert.alert('Erro no login', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordRequest = async () => {
    const normalizedEmail = forgotEmail.trim().toLowerCase()

    if (!normalizedEmail) {
      Alert.alert('Erro', 'Informe seu email para recuperação.')
      return
    }

    setForgotLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { email: normalizedEmail })
      const resetLink = response.data?.resetLink as string | undefined

      if (resetLink) {
        console.log('[ForgotPassword] Link de desenvolvimento:', resetLink)
      }

      Alert.alert(
        'Recuperação de senha',
        resetLink
          ? `Link de desenvolvimento gerado:\n${resetLink}`
          : response.data?.message || 'Verifique sua caixa de entrada.'
      )

      setForgotModalVisible(false)
      setForgotEmail('')
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || error.message || 'Falha na conexão com o servidor.'
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
      <WaveBackground />

      <View style={styles.inner}>
        <Text style={styles.logo}>NEXUS</Text>
        <Text style={styles.subtitle}>HORIZON</Text>
        <Text style={styles.tagline}>Next-Gen Connectivity</Text>

        <View style={styles.card}>
          {registerNotice ? (
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>Cadastro confirmado</Text>
              <Text style={styles.noticeText}>{registerNotice}</Text>
              <TouchableOpacity onPress={() => setRegisterNotice('')}>
                <Text style={styles.noticeAction}>Ocultar aviso</Text>
              </TouchableOpacity>
            </View>
          ) : null}

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
          <View style={styles.successOverlay}>
            <View style={styles.successModal}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>OK</Text>
              </View>
              <Text style={styles.successTitle}>Tudo certo</Text>
              <Text style={styles.successSubtitle}>
                Login confirmado com sucesso. Seu painel será aberto automaticamente em instantes.
              </Text>
              <View style={styles.successBar}>
                <View style={styles.successBarFill} />
              </View>
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
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.button, forgotLoading && styles.buttonDisabled]}
                onPress={handleForgotPasswordRequest}
                disabled={forgotLoading}
              >
                {forgotLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.buttonText}>Enviar link</Text>
                )}
              </TouchableOpacity>

              <Pressable style={styles.modalClose} onPress={() => setForgotModalVisible(false)}>
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
    maxWidth: 560,
    backgroundColor: 'rgba(22, 27, 34, 0.88)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  noticeCard: {
    backgroundColor: 'rgba(112, 0, 255, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(112, 0, 255, 0.28)',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  noticeTitle: {
    color: colors.secondary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  noticeText: {
    color: colors.gray,
    fontSize: typography.fontSizes.xs,
    lineHeight: 20,
  },
  noticeAction: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: '700',
    marginTop: spacing.sm,
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
  successOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(3, 8, 14, 0.18)',
  },
  successModal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(13, 17, 23, 0.96)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.24)',
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  successIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 245, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  successIconText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '800',
    letterSpacing: 1,
  },
  successTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    color: colors.gray,
    fontSize: typography.fontSizes.xs,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  successBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
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
    maxWidth: 420,
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
