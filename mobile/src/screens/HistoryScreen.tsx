import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { colors, spacing } from '../theme'

const items = [
  { icon: 'SAT', label: 'Satélite — SAT-BR-001', time: 'Hoje, 20:33', signal: '92%', latency: '28ms', color: colors.primary },
  { icon: 'LFI', label: 'Li-Fi — LIFI-LAB-001', time: 'Hoje, 19:55', signal: '100%', latency: '1ms', color: '#00FF88' },
  { icon: '5G', label: 'Celular — TOWER-SP-042', time: 'Hoje, 19:12', signal: '87%', latency: '8ms', color: colors.secondary },
  { icon: 'DTC', label: 'Direct-to-Cell — DTC-BR-001', time: 'Hoje, 18:47', signal: '82%', latency: '15ms', color: colors.gray },
  { icon: 'SAT', label: 'Satélite — SAT-BR-005', time: 'Hoje, 18:00', signal: '95%', latency: '22ms', color: colors.primary },
  { icon: '5G', label: 'Celular — TOWER-RJ-018', time: 'Ontem, 22:15', signal: '76%', latency: '11ms', color: colors.secondary },
  { icon: 'LFI', label: 'Li-Fi — LIFI-LAB-001', time: 'Ontem, 20:30', signal: '100%', latency: '1ms', color: '#00FF88' },
]

export function HistoryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>HISTÓRICO DE CONEXÕES</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.left}>
            <View style={[styles.icon, { borderColor: item.color }]}>
              <Text style={[styles.iconText, { color: item.color }]}>{item.icon}</Text>
            </View>
            <View>
              <Text style={styles.info}>{item.label}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={styles.signal}>{item.signal}</Text>
            <Text style={styles.latency}>{item.latency}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { fontSize: 11, color: colors.primary, letterSpacing: 2, marginBottom: spacing.md },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  icon: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 10, fontWeight: '700' },
  info: { fontSize: 13, color: colors.white },
  time: { fontSize: 11, color: colors.gray, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  signal: { fontSize: 16, fontWeight: '700', color: colors.primary },
  latency: { fontSize: 11, color: colors.gray },
})
