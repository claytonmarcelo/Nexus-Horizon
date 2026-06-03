import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native'
import { colors, spacing } from '../theme'

export function LiFiScreen() {
  const [active, setActive] = useState(true)
  const [speed, setSpeed] = useState(100)
  const anim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const interval = setInterval(() => {
      const val = active ? Math.floor(Math.random() * 20) + 85 : Math.floor(Math.random() * 5)
      setSpeed(val)
    }, 600)

    return () => clearInterval(interval)
  }, [active])

  const toggle = () => {
    setActive((prev) => !prev)
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.6, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start()
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>SIMULADOR Li-Fi — TRANSMISSÃO VIA LUZ</Text>
        <View style={styles.simulator}>
          <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
            <Animated.View style={[styles.light, { opacity: anim }, !active && styles.lightOff]}>
              <Text style={[styles.lightText, !active && styles.lightTextOff]}>
                LUZ{'\n'}
                {active ? 'ON' : 'OFF'}
              </Text>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={styles.status}>
              {active ? 'Transmitindo dados via luz...' : 'Sinal bloqueado — sensor coberto'}
            </Text>
            <Text style={[styles.speed, !active && styles.speedOff]}>{speed}</Text>
            <Text style={styles.unit}>Gbps</Text>
            <TouchableOpacity style={[styles.btn, !active && styles.btnBlocked]} onPress={toggle}>
              <Text style={[styles.btnText, !active && styles.btnTextBlocked]}>
                {active ? 'BLOQUEAR SINAL' : 'LIBERAR SINAL'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>COMO FUNCIONA O Li-Fi</Text>
        <Text style={styles.infoText}>
          Transmite dados através de ondas de luz visível. Velocidade de até 100 Gbps, mais
          seguro que Wi‑Fi pois a luz não atravessa paredes, sem interferência eletromagnética —
          ideal para hospitais e aviões.
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
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  simulator: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  light: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  lightOff: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
  },
  lightText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.background,
    textAlign: 'center',
    letterSpacing: 1,
  },
  lightTextOff: {
    color: colors.gray,
  },
  info: {
    flex: 1,
  },
  status: {
    fontSize: 13,
    color: colors.white,
    marginBottom: 8,
  },
  speed: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  speedOff: {
    color: colors.danger,
  },
  unit: {
    fontSize: 11,
    color: colors.gray,
    letterSpacing: 2,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: 'rgba(0,245,255,0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  btnBlocked: {
    backgroundColor: 'rgba(255,49,49,0.1)',
    borderColor: colors.danger,
  },
  btnText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  btnTextBlocked: {
    color: colors.danger,
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
