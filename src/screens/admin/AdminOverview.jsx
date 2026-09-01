import { useMemo } from 'react'
import { Image, Pressable, Switch, Text, View } from 'react-native'
import { WifiOff } from 'lucide-react-native'
import { colors } from '../../theme'
import { formatIQD, productName } from '../../data/mock'

function FlatStat({ label, value, accent, isRTL, desktop }) {
  return (
    <View
      style={{
        flexGrow: 1,
        flexBasis: desktop ? '18%' : '46%',
        minWidth: desktop ? 150 : '45%',
        maxWidth: desktop ? 220 : undefined,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: desktop ? 16 : 14,
        borderWidth: 1,
        borderColor: colors.line,
        borderTopWidth: 3,
        borderTopColor: accent || colors.red,
      }}
    >
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: desktop ? 24 : 20,
          fontWeight: '900',
          marginTop: 6,
          color: colors.ink,
          textAlign: isRTL ? 'right' : 'left',
        }}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  )
}

function Panel({ title, children, isRTL, action }) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.line,
        padding: 14,
        marginTop: 4,
      }}
    >
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: '900', fontSize: 15, color: colors.ink, textAlign: isRTL ? 'right' : 'left' }}>
          {title}
        </Text>
        {action || null}
      </View>
      {children}
    </View>
  )
}

function statusColor(status) {
  if (status === 'delivered') return colors.open
  if (status === 'cancelled') return colors.red
  if (status === 'onway') return colors.busy
  return colors.ink
}

export default function AdminOverview({
  t,
  lang,
  isRTL,
  desktop,
  orders,
  liveCatalog,
  liveCampaigns,
  customersCount,
  enabledProducts,
  simulateOffline,
  setOfflineSim,
  setAppDemoMode,
  openStorefront,
  leaveToShop,
  demoMode,
  adminAddProductsToCampaign,
  onOpenProduct,
  onGoCampaigns,
}) {
  const startOfDay = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }, [])

  const ordersToday = orders.filter((o) => (o.createdAt || 0) >= startOfDay)
  const revenueToday = ordersToday.reduce((n, o) => n + (Number(o.total) || 0), 0)
  const activeCampaigns = liveCampaigns.filter((c) => c.active !== false).length

  const salesMap = useMemo(() => {
    const map = {}
    for (const o of orders) {
      if (o.status === 'cancelled') continue
      for (const item of o.items || []) {
        const id = item.productId
        if (!id) continue
        map[id] = (map[id] || 0) + (Number(item.qty) || 1)
      }
    }
    return map
  }, [orders])

  const bestSellers = useMemo(() => {
    return Object.entries(salesMap)
      .map(([id, qty]) => ({ id, qty, product: liveCatalog.find((p) => p.id === id) }))
      .filter((x) => x.product && !x.product.disabled)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8)
  }, [salesMap, liveCatalog])

  const staleProducts = useMemo(() => {
    return liveCatalog
      .filter((p) => !p.disabled)
      .map((p) => ({ product: p, qty: salesMap[p.id] || 0 }))
      .sort((a, b) => a.qty - b.qty || productName(a.product, lang).localeCompare(productName(b.product, lang)))
      .slice(0, 8)
  }, [liveCatalog, salesMap, lang])

  const recentActivity = useMemo(
    () => [...orders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 10),
    [orders],
  )

  const addToAktuel = (productId) => {
    adminAddProductsToCampaign([productId])
    onGoCampaigns?.()
  }

  return (
    <>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10 }}>
        <FlatStat label={t('adminStatOrdersToday')} value={ordersToday.length} isRTL={isRTL} desktop={desktop} />
        <FlatStat
          label={t('adminStatRevenueToday')}
          value={formatIQD(revenueToday, lang)}
          accent={colors.yellow}
          isRTL={isRTL}
          desktop={desktop}
        />
        <FlatStat label={t('adminStatCustomers')} value={customersCount} isRTL={isRTL} desktop={desktop} />
        <FlatStat label={t('adminStatProducts')} value={enabledProducts} isRTL={isRTL} desktop={desktop} />
        <FlatStat
          label={t('adminStatCampaigns')}
          value={activeCampaigns}
          accent="#161616"
          isRTL={isRTL}
          desktop={desktop}
        />
      </View>

      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.line,
          padding: 14,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <WifiOff size={18} color={colors.red} />
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontWeight: '800' }}>{t('simulateOffline')}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{t('simulateOfflineHint')}</Text>
          </View>
        </View>
        <Switch value={simulateOffline} onValueChange={setOfflineSim} trackColor={{ true: colors.red, false: '#ddd' }} />
      </View>

      <View
        style={{
          backgroundColor: '#161616',
          borderRadius: 10,
          padding: 14,
          borderWidth: 1,
          borderColor: '#2A2A2A',
        }}
      >
        <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 11, letterSpacing: 0.5 }}>DEMO</Text>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15, marginTop: 4 }}>{t('adminHint')}</Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginTop: 12 }}>
          {['customer', 'admin', 'courier'].map((m) => {
            const on = demoMode === m
            return (
              <Pressable
                key={m}
                onPress={() => {
                  setAppDemoMode(m)
                  if (m === 'customer') leaveToShop()
                  if (m === 'courier') openStorefront('CourierHome')
                }}
                style={{
                  flex: 1,
                  backgroundColor: on ? colors.yellow : 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: '800', color: on ? colors.ink : '#fff', fontSize: 12 }}>
                  {t(`demoMode.${m}`)}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <Panel title={t('adminRecentActivity')} isRTL={isRTL}>
        {recentActivity.length === 0 ? (
          <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>{t('noOrders')}</Text>
        ) : (
          recentActivity.map((o) => {
            const st = o.status || 'confirmed'
            return (
              <View
                key={o.id}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderTopWidth: 1,
                  borderTopColor: colors.line,
                  gap: 8,
                }}
              >
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ fontWeight: '800' }}>{o.id}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleString(lang === 'ar' ? 'ar' : lang === 'tr' ? 'tr-TR' : 'en') : '—'}
                  </Text>
                </View>
                <Text style={{ fontWeight: '800', color: colors.red }}>{formatIQD(o.total, lang)}</Text>
                <View
                  style={{
                    backgroundColor: colors.bg,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: colors.line,
                  }}
                >
                  <Text style={{ fontWeight: '800', fontSize: 11, color: statusColor(st) }}>
                    {t(st === 'cancelled' ? 'cancelled' : st)}
                  </Text>
                </View>
              </View>
            )
          })
        )}
      </Panel>

      <View style={{ flexDirection: desktop ? (isRTL ? 'row-reverse' : 'row') : 'column', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Panel title={t('adminBestSellers')} isRTL={isRTL}>
            {bestSellers.length === 0 ? (
              <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>{t('adminNoSalesYet')}</Text>
            ) : (
              bestSellers.map((row, i) => (
                <Pressable
                  key={row.id}
                  onPress={() => onOpenProduct?.(row.product)}
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingVertical: 8,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: colors.line,
                  }}
                >
                  <Text style={{ fontWeight: '900', color: colors.muted, width: 22 }}>{i + 1}</Text>
                  {row.product.image ? (
                    <Image source={{ uri: row.product.image }} style={{ width: 36, height: 36, borderRadius: 6 }} />
                  ) : (
                    <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: colors.bg }} />
                  )}
                  <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                    <Text style={{ fontWeight: '800' }} numberOfLines={1}>
                      {productName(row.product, lang)}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 11 }}>
                      {t('adminSoldQty', { n: row.qty })}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </Panel>
        </View>

        <View style={{ flex: 1 }}>
          <Panel title={t('adminStaleProducts')} isRTL={isRTL}>
            {staleProducts.length === 0 ? (
              <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>{t('adminNoProducts')}</Text>
            ) : (
              staleProducts.map((row, i) => (
                <View
                  key={row.product.id}
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingVertical: 8,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: colors.line,
                  }}
                >
                  <Pressable
                    onPress={() => onOpenProduct?.(row.product)}
                    style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}
                  >
                    {row.product.image ? (
                      <Image source={{ uri: row.product.image }} style={{ width: 36, height: 36, borderRadius: 6 }} />
                    ) : (
                      <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: colors.bg }} />
                    )}
                    <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                      <Text style={{ fontWeight: '800' }} numberOfLines={1}>
                        {productName(row.product, lang)}
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 11 }}>
                        {row.qty === 0 ? t('adminZeroSales') : t('adminSoldQty', { n: row.qty })}
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => addToAktuel(row.product.id)}
                    style={{
                      backgroundColor: colors.yellow,
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                    }}
                  >
                    <Text style={{ fontWeight: '900', fontSize: 11, color: colors.ink }}>{t('adminAddToAktuel')}</Text>
                  </Pressable>
                </View>
              ))
            )}
          </Panel>
        </View>
      </View>
    </>
  )
}
