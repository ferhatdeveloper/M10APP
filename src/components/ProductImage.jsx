import { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { aisleFallback, fallbackProductImg, src } from '../utils/images'

/**
 * Product photo with onError safety net — never leaves a blank gray box.
 * Primary images must still be set on catalog data.
 */
export default function ProductImage({ uri, aisle, style, resizeMode = 'cover', ...rest }) {
  const [source, setSource] = useState(() => src(uri, aisle))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    setSource(src(uri, aisle))
  }, [uri, aisle])

  return (
    <Image
      {...rest}
      source={failed ? (aisle ? aisleFallback(aisle) : fallbackProductImg) : source}
      style={style}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
    />
  )
}
