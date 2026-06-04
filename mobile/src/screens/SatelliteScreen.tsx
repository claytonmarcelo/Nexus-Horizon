import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { colors, spacing, typography } from '../theme'

type SatelliteStatus = 'online' | 'offline'

type SatelliteNode = {
  id: string
  signal: number
  status: SatelliteStatus
  region: string
  marker: string
}

const satellites: SatelliteNode[] = [
  { id: 'SAT-BR-001', signal: 92, status: 'online', region: 'Norte', marker: 'N' },
  { id: 'SAT-BR-002', signal: 87, status: 'online', region: 'Sudeste', marker: 'SE' },
  { id: 'SAT-BR-003', signal: 78, status: 'online', region: 'Sul', marker: 'S' },
  { id: 'SAT-BR-004', signal: 0, status: 'offline', region: 'Nordeste', marker: 'NE' },
  { id: 'SAT-BR-005', signal: 95, status: 'online', region: 'Centro-Oeste', marker: 'CO' },
  { id: 'SAT-BR-006', signal: 65, status: 'online', region: 'Amazonia', marker: 'AM' },
]

export function SatelliteScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>NOS ORBITAIS - COBERTURA BRASIL</Text>

      {satellites.map((sat) => {
        const isOffline = sat.status === 'offline'

        return (
          <View key={sat.id} style={[styles.card, isOffline && styles.cardOffline]}>
            <View style={styles.row}>
              <View style={styles.identity}>
                <View style={[styles.dot, isOffline ? styles.dotOff : styles.dotOn]} />
                <Text style={styles.id}>{sat.id}</Text>
              </View>

              <View style={styles.statusStack}>
                <Text style={[styles.badge, isOffline ? styles.badgeOff : styles.badgeOn]}>
                  {isOffline ? 'OFFLINE' : 'ONLINE'}
                </Text>

                <View
                  style={[
                    styles.satelliteChip,
                    isOffline ? styles.satelliteChipOff : styles.satelliteChipOn,
                  ]}
                >
                  <Text style={styles.satelliteEmoji}>🛰️</Text>
                  <Text
                    style={[
                      styles.satelliteCode,
                      isOffline && styles.satelliteCodeOff,
                    ]}
                  >
                    {sat.marker}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.region}>{sat.region}</Text>

            <Text style={[styles.signal, isOffline && styles.signalOff]}>
              {isOffline ? 'OFFLINE' : `${sat.signal}%`}
            </Text>

            <View style={styles.bar}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${sat.signal}%`,
                    backgroundColor: isOffline ? colors.danger : colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        )
      })}
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
  title: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardOffline: {
    borderColor: colors.danger,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 3,
  },
  dotOn: {
    backgroundColor: 'colors.success',
  },
  dotOff: {
    backgroundColor: colors.danger,
  },
  id: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    fontWeight: '700',
    color: colors.white,
  },
  statusStack: {
    alignItems: 'flex-end',
  },
  badge: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  badgeOn: {
    backgroundColor: 'rgba(0,255,136,0.1)',
    color: 'colors.success',
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.3)',
  },
  badgeOff: {
    backgroundColor: 'rgba(255,49,49,0.1)',
    color: colors.danger,
    borderWidth: 1,
    borderColor: 'rgba(255,49,49,0.3)',
  },
  satelliteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  satelliteChipOn: {
    backgroundColor: 'rgba(0, 245, 255, 0.08)',
    borderColor: 'rgba(0, 245, 255, 0.22)',
  },
  satelliteChipOff: {
    backgroundColor: 'rgba(255, 49, 49, 0.08)',
    borderColor: 'rgba(255, 49, 49, 0.22)',
  },
  satelliteEmoji: {
    fontSize: 15,
    marginRight: 6,
  },
  satelliteCode: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.primary,
  },
  satelliteCodeOff: {
    color: colors.danger,
  },
  region: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 8,
  },
  signal: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  signalOff: {
    color: colors.danger,
  },
  bar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
})
