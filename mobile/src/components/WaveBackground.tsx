import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../theme'

export function WaveBackground() {
  const driftA = useRef(new Animated.Value(0)).current
  const driftB = useRef(new Animated.Value(0)).current
  const driftC = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const createLoop = (
      value: Animated.Value,
      distance: number,
      duration: number
    ) => Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: distance,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    )

    const animationA = createLoop(driftA, 24, 7000)
    const animationB = createLoop(driftB, -18, 9000)
    const animationC = createLoop(driftC, 16, 8200)

    animationA.start()
    animationB.start()
    animationC.start()

    return () => {
      animationA.stop()
      animationB.stop()
      animationC.stop()
    }
  }, [driftA, driftB, driftC])

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View style={[styles.wave, styles.waveLarge, { transform: [{ translateX: driftA }] }]}>
        <LinearGradient
          colors={['rgba(0, 245, 255, 0.14)', 'rgba(112, 0, 255, 0.04)', 'rgba(0, 245, 255, 0)']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          style={styles.fill}
        />
      </Animated.View>

      <Animated.View style={[styles.wave, styles.waveMedium, { transform: [{ translateX: driftB }] }]}>
        <LinearGradient
          colors={['rgba(112, 0, 255, 0.16)', 'rgba(0, 245, 255, 0.05)', 'rgba(112, 0, 255, 0)']}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.fill}
        />
      </Animated.View>

      <Animated.View style={[styles.wave, styles.waveTop, { transform: [{ translateX: driftC }] }]}>
        <LinearGradient
          colors={['rgba(0, 245, 255, 0.07)', 'rgba(13, 17, 23, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  wave: {
    position: 'absolute',
    borderRadius: 999,
  },
  waveLarge: {
    width: 520,
    height: 240,
    left: -120,
    bottom: -130,
    opacity: 0.9,
    transform: [{ rotate: '-8deg' }],
  },
  waveMedium: {
    width: 420,
    height: 220,
    right: -120,
    bottom: -120,
    opacity: 0.75,
    transform: [{ rotate: '9deg' }],
  },
  waveTop: {
    width: 320,
    height: 160,
    top: -90,
    right: -80,
    opacity: 0.45,
    transform: [{ rotate: '-12deg' }],
  },
  fill: {
    flex: 1,
    borderRadius: 999,
  },
})
