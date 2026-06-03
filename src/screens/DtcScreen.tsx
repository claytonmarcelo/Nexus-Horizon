import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { colors, spacing } from '../theme'

export function DtcScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.dtcCard}>
        <Text style={styles.dtcTitle}>DIRECT-TO-CELL — SATÉLITE DIRETO PARA O CELULAR</Text>
        <View style={styles.grid}>
          <View style={styles.box}>
            <Text style={styles.boxLabel}>NÓ ATIVO</Text>
            <Text style={styles.boxValue}>DTC-BR-001</Text>
            <Text style={styles.boxSub}>Cobertura: Brasil</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxLabel}>ALTITUDE</Text>
            <Text style={styles.boxValue}>550 km</Text>
            <Text style={styles.boxSub}>Órbita baixa (LEO)</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxLabel}>LATÊNCIA</Text>
            <Text style={styles.boxValue}>12ms</Text>
            <Text style={styles.boxSub}>em tempo real</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxLabel}>SINAL</Text>
            <Text style={styles.boxValue}>85%</Text>
            <Text style={styles.boxSub}>de cobertura</Text>
          </View>
        </View>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>STATUS DA CONEXÃO</Text>
        <Text style={styles.metricValue}>Connected — Direct-to-Cell node DTC-BR-001</Text>
        <View style={styles.bar}>
          <View style={styles.fill} />
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>O QUE É DIRECT-TO-CELL</Text>
        <Text style={styles.infoText}>
          O satélite funciona como uma "torre de celular no espaço". Empresas como SpaceX e AST
          SpaceMobile testam nos EUA a conexão direta do satélite para o smartphone comum, sem
          antena extra. Acabaria com as "zonas mortas" em estradas, fazendas e áreas rurais do
          Brasil.
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
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  dtcCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  dtcTitle: {
    fontSize: 11,
    color: colors.gray,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  box: {
    width: '48.5%',
    backgroundColor: colors.grayDark,
    borderRadius: 8,
    padding: spacing.md,
  },
  boxLabel: {
    fontSize: 11,
    color: colors.gray,
    letterSpacing: 2,
    marginBottom: 8,
  },
  boxValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  boxSub: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 4,
  },
  metricCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 14,
    color: colors.white,
    marginBottom: spacing.md,
  },
  bar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    width: '85%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  infoCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: spacing.lg,
  },
  infoTitle: {
    fontSize: 11,
    color: colors.secondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 13,
    color: colors.gray,
    letterSpacing: 1,
    lineHeight: 20,
  },
})
