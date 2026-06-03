import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { colors, spacing } from '../theme'

const satellites = [
  { id: 'SAT-BR-001', signal: 92, status: 'online', region: 'Norte' },
  { id: 'SAT-BR-002', signal: 87, status: 'online', region: 'Sudeste' },
  { id: 'SAT-BR-003', signal: 78, status: 'online', region: 'Sul' },
  { id: 'SAT-BR-004', signal: 0, status: 'offline', region: 'Nordeste' },
  { id: 'SAT-BR-005', signal: 95, status: 'online', region: 'Centro-Oeste' },
  { id: 'SAT-BR-006', signal: 65, status: 'online', region: 'Amazônia' },
]

export function SatelliteScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>NÓS ORBITAIS — COBERTURA BRASIL</Text>
      {satellites.map((sat) => (
        <View key={sat.id} style={[styles.card, sat.status === 'offline' && styles.cardOffline]}>
          <View style={styles.row}>
            <View style={[styles.dot, sat.status === 'offline' ? styles.dotOff : sat.status === 'online' ? styles.dotOn : styles.dotWarn]} />
            <Text style={styles.id}>{sat.id}</Text>
            <Text style={[styles.badge, sat.status === 'online' ? styles.badgeOn : styles.badgeOff]}>
              {sat.status === 'online' ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
          <Text style={styles.region}>{sat.region}</Text>
          <Text style={[styles.signal, sat.status === 'offline' && { color: colors.danger }]}>
            {sat.status === 'online' ? `${sat.signal}%` : 'OFFLINE'}
          </Text>
          <View style={styles.bar}>
            <View style={[styles.fill, { width: `${sat.signal}%`, backgroundColor: sat.status === 'online' ? colors.primary : colors.danger }]} />
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
  card: { backgroundColor: colors.cardBg, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  cardOffline: { borderColor: colors.danger },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  dotOn: { backgroundColor: '#00FF88' },
  dotOff: { backgroundColor: colors.danger },
  dotWarn: { backgroundColor: '#FFB800' },
  id: { fontSize: 13, fontWeight: '700', color: colors.white, flex: 1 },
  badge: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '700', letterSpacing: 1 },
  badgeOn: { backgroundColor: 'rgba(0,255,136,0.1)', color: '#00FF88', borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)' },
  badgeOff: { backgroundColor: 'rgba(255,49,49,0.1)', color: colors.danger, borderWidth: 1, borderColor: 'rgba(255,49,49,0.3)' },
  region: { fontSize: 12, color: colors.gray, marginBottom: 8 },
  signal: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 8 },
  bar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
})
