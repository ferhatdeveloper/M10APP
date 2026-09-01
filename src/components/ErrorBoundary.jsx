import { Component } from 'react'
import { Pressable, Text, View } from 'react-native'
import { colors } from '../theme'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, info?.componentStack)
    }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const message = error?.message || String(error)
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.bg,
        }}
      >
        <Text style={{ fontWeight: '900', fontSize: 18, color: colors.ink, marginBottom: 8, textAlign: 'center' }}>
          {this.props.title || 'Something went wrong'}
        </Text>
        <Text style={{ color: colors.muted, textAlign: 'center', marginBottom: 16, lineHeight: 20 }}>{message}</Text>
        {this.props.onRetry ? (
          <Pressable
            onPress={() => {
              this.setState({ error: null })
              this.props.onRetry?.()
            }}
            style={{ backgroundColor: colors.red, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{this.props.retryLabel || 'Retry'}</Text>
          </Pressable>
        ) : null}
      </View>
    )
  }
}
