import React from 'react'
import { ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native'
import { colors } from '../theme'
import { WaveBackground } from './WaveBackground'

type WaveScrollScreenProps = ScrollViewProps & {
  screenStyle?: ViewStyle
}

export function WaveScrollScreen({
  children,
  screenStyle,
  contentContainerStyle,
  style,
  ...props
}: WaveScrollScreenProps) {
  return (
    <View style={[styles.screen, screenStyle]}>
      <WaveBackground />
      <ScrollView
        {...props}
        style={[styles.scroll, style]}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
})
