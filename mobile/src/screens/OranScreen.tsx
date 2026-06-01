import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { colors, spacing } from '../theme'

const nodes = [
  { name: 'RAN-SP-001', region: 'São Paulo', cpu: 42, traffic: '8.2G', users: '1.2M', latency: '3ms', status: 'online' },
  { name: 'RAN-RJ-001', region: 'Rio de Janeiro', cpu: 67, traffic: '5.8G', users: '890K', latency: '4ms', status: 'online' },
  { name: 'RAN-MG-001', region: 'Minas Gerais', cpu: 89, traffic: '3.1G', users: '560K', latency: '12ms', status: 'warning' },
  { name: 'RAN-RS-001', region: 'Rio Grande do Sul', cpu: 31, traffic: '2.4G', users: '340K', latency: '5ms', status: 'online' },
  { name: 'RAN-BA-001', region: 'Bahia', cpu: 0, traffic: '0', users: '0', latency: '--', status: 'offline' },
]

export function OranScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}><Text style={styles.summaryLabel}>NÓS ATIVOS</Text><Text style={styles.summaryValue}>5</Text></View>
        <View style={styles.summaryBox}><Text style={styles.summaryLabel}>UPTIME</Text><Text style={[styles.summaryValue, { color: '#00FF88' }]}>99.8%</Text></View>
      </View>
      <Text style={styles.title}>NÓS DE RÁDIO ABERTO — OPEN RAN</Text>
      {nodes.map((node) => (
        <View key={node.name} style={[styles.card, node.status === 'offline' && styles.cardOffline]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.dot, node.status === 'online' ? styles.dotOn : node.status === 'warning' ? styles.dotWarn : styles.dotOff]} />
              <Text style={styles.nodeName}>{node.name} — {node.region}</Text>
            </View>
            <Text style={[styles.badge, node.status === 'online' ? styles.badgeOn : node.status === 'warning' ? styles.badgeWarn : styles.badgeOff]}>
              {node.status === 'online' ? 'ONLINE' : node.status === 'warning' ? 'ALERTA' : 'OFFLINE'}
            </Text>
          </View>
          <View style={styles.metrics}>
            <View style={styles.metric}><Text style={styles.metricLabel}>CPU</Text><Text style={styles.metricValue}>{node.cpu}%</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>TRÁFEGO</Text><Text style={styles.metricValue}>{node.traffic}</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>USUÁRIOS</Text><Text style={styles.metricValue}>{node.users}</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>LATÊNCIA</Text><Text style={styles.metricValue}>{node.latency}</Text></View>
          </View>
          <View style={styles.bar}><View style={[styles.fill, { width: `${node.cpu}%`, backgroundColor: node.status === 'offline' ? colors.danger : node.status === 'warning' ? '#FFB800' : colors.primary }]} /></View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  summaryBox: { flex: 1, backgroundColor: colors.cardBg, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: 'center' },
  summaryLabel: { fontSize: 10, color: colors.gray, letterSpacing: 2, marginBottom: 8 },
  summaryValue: { fontSize: 24, fontWeight: '800', color: colors.primary },
  title: { fontSize: 11, color: colors.secondary, letterSpacing: 2, marginBottom: spacing.md },
  card: { backgroundColor: colors.cardBg, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  cardOffline: { borderColor: colors.danger },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  dotOn: { backgroundColor: '#00FF88' },
  dotWarn: { backgroundColor: '#FFB800' },
  dotOff: { backgroundColor: colors.danger },
  nodeName: { fontSize: 13, fontWeight: '700', color: colors.white, flex: 1 },
  badge: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '700', letterSpacing: 1 },
  badgeOn: { backgroundColor: 'rgba(0,255,136,0.1)', color: '#00FF88', borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)' },
  badgeWarn: { backgroundColor: 'rgba(255,184,0,0.1)', color: '#FFB800', borderWidth: 1, borderColor: 'rgba(255,184,0,0.3)' },
  badgeOff: { backgroundColor: 'rgba(255,49,49,0.1)', color: colors.danger, borderWidth: 1, borderColor: 'rgba(255,49,49,0.3)' },
  metrics: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  metric: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 10, color: colors.gray, letterSpacing: 1, marginBottom: 4 },
  metricValue: { fontSize: 16, fontWeight: '700', color: colors.primary },
  bar: { height: 3, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
})
