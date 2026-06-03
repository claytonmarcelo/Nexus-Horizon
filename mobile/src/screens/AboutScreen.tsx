import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { colors, spacing, typography } from '../theme'
import { WaveScrollScreen } from '../components/WaveScrollScreen'

const quickSteps = [
  'Entre com seu email e senha para abrir o painel principal.',
  'Use o botão de menu (☰) no canto superior esquerdo para acessar todas as opções.',
  'Escolha no menu a tecnologia que deseja acompanhar: Satelite, Li-Fi, Open RAN, Direct-to-Cell, Perfil ou Historico.',
  'Leia os cards de status, latencia e sinal para entender a qualidade da conexao em tempo real.',
]

const highlights = [
  'Satelite: mostra cobertura e disponibilidade dos nos orbitais.',
  'Li-Fi: demonstra transmissao de dados por luz visivel.',
  'Open RAN: acompanha o estado da rede aberta e seus nos.',
  'Direct-to-Cell: apresenta a conexao direta do satelite para o celular.',
  'Segurança: validação de senha robusta e proteção de credenciais.',
  'Limpeza de cache: função para limpar dados temporários mantendo sessão ativa.',
]

export function AboutScreen() {
  return (
    <WaveScrollScreen
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>SOBRE O PROJETO</Text>
        <Text style={styles.heroTitle}>Nexus Horizon</Text>
        <Text style={styles.heroText}>
          O Nexus Horizon e um painel visual para apresentar, de forma simples, como diferentes
          tecnologias de conectividade funcionam juntas. Ele organiza informacoes de sinal,
          latencia, cobertura e status para que qualquer pessoa consiga entender a operacao sem
          precisar de conhecimento tecnico avancado.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Como funciona</Text>
        {quickSteps.map((step, index) => (
          <View key={step} style={styles.listRow}>
            <Text style={styles.listIndex}>{index + 1}</Text>
            <Text style={styles.listText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>O que voce encontra no sistema</Text>
        {highlights.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Dica de uso</Text>
        <Text style={styles.tipText}>
          Se voce acabou de criar sua conta, revise os dados preenchidos na tela de login e toque
          em acessar sistema. O menu lateral sempre mostra as areas principais para facilitar a
          navegacao.
        </Text>
      </View>

      <View style={styles.signatureCard}>
        <Text style={styles.signatureLabel}>Desenvolvedor do projeto</Text>
        <Text style={styles.signatureName}>Clayton Marcelo</Text>
        <Text style={styles.signatureVersion}>Versão 2.0 - Atualizado com segurança e performance</Text>
      </View>
    </WaveScrollScreen>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: 'rgba(22, 27, 34, 0.92)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.18)',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  heroText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.secondary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  listIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 245, 255, 0.12)',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: typography.fontSizes.xs,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  listText: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    lineHeight: 21,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    lineHeight: 21,
  },
  tipCard: {
    backgroundColor: 'rgba(112, 0, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(112, 0, 255, 0.24)',
    padding: spacing.lg,
  },
  tipTitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.secondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray,
    lineHeight: 21,
  },
  signatureCard: {
    backgroundColor: 'rgba(0, 245, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.18)',
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  signatureLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  signatureName: {
    fontSize: typography.fontSizes.md,
    color: colors.white,
    fontWeight: '700',
  },
  signatureVersion: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray,
    marginTop: spacing.xs,
  },
})
