import { Image, Platform, Text, View } from 'react-native'
import { colors, radius, shadow } from '../theme'

/**
 * iPhone 17 Pro Max (430x932 pt) çerçevesi.
 * Öncelik sırası:
 *   1. `image`    → gerçek ekran görüntüsü (PNG)
 *   2. children   → mock bileşen (MockXxx)
 *
 * NOT: `webview` prop burada KULLANILMAZ; iframe'ler kararlılık sorunu
 * yarattığı için yalnızca "Tam önizleme" modal'ında (PreviewModal)
 * gösterilir. Bu prop geriye dönük uyumluluk için kabul edilir ama yok
 * sayılır.
 */
export default function PhoneMockup({
  children,
  image,
  webview: _webview, // eslint-disable-line no-unused-vars
  statusBarBg = '#fff',
  statusBarText = '#161616',
}) {
  return (
    <View
      style={{
        width: 280,
        height: 600,
        borderRadius: 56,
        backgroundColor: '#0F0F12',
        padding: 9,
        ...shadow.float,
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 48,
          backgroundColor: '#fff',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Status bar — iPhone 17 Pro Max: Dynamic Island */}
        <View
          style={{
            height: 50,
            backgroundColor: statusBarBg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 22,
            paddingTop: 14,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '800', color: statusBarText }}>9:41</Text>
          <View
            style={{
              width: 100,
              height: 26,
              borderRadius: 18,
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 10,
              left: '50%',
              marginLeft: -50,
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: '#1A1A1F',
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={{ fontSize: 11, color: statusBarText, fontWeight: '700' }}>●●●</Text>
            <Text style={{ fontSize: 11, color: statusBarText, fontWeight: '700' }}>5G</Text>
            <View
              style={{
                width: 18,
                height: 9,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: statusBarText,
              }}
            />
          </View>
        </View>
        {/* Content */}
        <View style={{ flex: 1, backgroundColor: '#F6F6F7' }}>
          {image ? (
            <Image
              source={image}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            children
          )}
        </View>
      </View>
    </View>
  )
}

/* ---------------- mock screens ---------------- */

function MockTopBar({ title, bg = colors.red, fg = '#fff' }) {
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}
      />
      <Text style={{ color: fg, fontWeight: '900', fontSize: 14, flex: 1 }} numberOfLines={1}>
        {title}
      </Text>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}
      />
    </View>
  )
}

function MockBottomNav({ active = 'home' }) {
  const items = [
    { id: 'home', label: 'Anasayfa' },
    { id: 'search', label: 'Ara' },
    { id: 'butler', label: 'Şoför' },
    { id: 'orders', label: 'Sipariş' },
    { id: 'profile', label: 'Hesap' },
  ]
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ECECEC',
        paddingVertical: 8,
        paddingHorizontal: 4,
      }}
    >
      {items.map((it) => (
        <View key={it.id} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              backgroundColor: it.id === active ? colors.red : '#D8D8DC',
            }}
          />
          <Text
            style={{
              fontSize: 9,
              fontWeight: it.id === active ? '800' : '600',
              color: it.id === active ? colors.red : '#9A9A9A',
            }}
          >
            {it.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

export function MockLanguage() {
  return (
    <View style={{ flex: 1, padding: 14, justifyContent: 'center', gap: 10 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          backgroundColor: colors.red,
          alignSelf: 'center',
        }}
      />
      <Text style={{ fontSize: 18, fontWeight: '900', textAlign: 'center', color: '#161616' }}>
        M10
      </Text>
      <Text style={{ fontSize: 10, color: '#7A7A7A', textAlign: 'center', marginBottom: 8 }}>
        Fiyat ve kalite 10/10
      </Text>
      {[
        { name: 'العربية', sub: 'AR', on: false },
        { name: 'English', sub: 'EN', on: false },
        { name: 'Türkçe', sub: 'TR', on: true },
      ].map((l) => (
        <View
          key={l.sub}
          style={{
            backgroundColor: l.on ? '#FDECEE' : '#fff',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: l.on ? colors.red : '#ECECEC',
          }}
        >
          <Text style={{ fontWeight: '800', color: l.on ? colors.red : '#161616' }}>{l.name}</Text>
          <Text style={{ color: '#7A7A7A', fontWeight: '700' }}>{l.sub}</Text>
        </View>
      ))}
      <View
        style={{
          backgroundColor: colors.red,
          borderRadius: 12,
          paddingVertical: 10,
          alignItems: 'center',
          marginTop: 6,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>Devam</Text>
      </View>
    </View>
  )
}

export function MockLogin() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <MockTopBar title="Giriş" />
      <View style={{ flex: 1, padding: 14, gap: 10 }}>
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: colors.red,
            }}
          />
          <Text style={{ fontWeight: '900', fontSize: 14, marginTop: 8 }}>Telefon numaran</Text>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderWidth: 1,
            borderColor: '#ECECEC',
          }}
        >
          <Text style={{ fontWeight: '800', fontSize: 10 }}>🇮🇶 +964</Text>
          <View style={{ width: 1, height: 14, backgroundColor: '#ECECEC' }} />
          <Text style={{ flex: 1, fontWeight: '700', fontSize: 11, color: '#7A7A7A' }}>
            0771 555 0001
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.red,
            borderRadius: 12,
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>Kod gönder</Text>
        </View>
        <View
          style={{
            backgroundColor: '#FFF8D6',
            borderRadius: 8,
            padding: 8,
            marginTop: 6,
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: '800', textAlign: 'center' }}>Demo OTP: 12345</Text>
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 8, marginTop: 4 }}>
          <Text style={{ fontSize: 9, color: '#7A7A7A' }}>Demo hesaplar</Text>
          {['Müşteri · 0771 555 0001', 'Kurye · 0771 555 0002', 'Admin · 0772 999 0000'].map((t) => (
            <Text key={t} style={{ fontSize: 9, color: '#161616', marginTop: 3 }}>
              {t}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}

export function MockHome() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="M10 · Dora" />
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: 10, gap: 8 }}>
        {/* Story halkası */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {['#E31E24', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'].map((c, i) => (
            <View key={i} style={{ alignItems: 'center', gap: 3 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: c,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c }} />
              </View>
              <Text style={{ fontSize: 8, color: '#7A7A7A' }}>Story</Text>
            </View>
          ))}
        </View>
        {/* Search */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderWidth: 1,
            borderColor: '#ECECEC',
          }}
        >
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#9A9A9A' }} />
          <Text style={{ fontSize: 10, color: '#7A7A7A' }}>Mağaza veya ürün ara…</Text>
        </View>
        {/* Banner */}
        <View
          style={{
            height: 80,
            borderRadius: 14,
            backgroundColor: colors.red,
            padding: 12,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.yellow, fontSize: 18, fontWeight: '900' }}>M10+</Text>
          <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>
            30 gün abonelik · 5.000 IQD
          </Text>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#fff',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
              marginTop: 6,
            }}
          >
            <Text style={{ fontSize: 9, color: colors.red, fontWeight: '900' }}>Detay →</Text>
          </View>
        </View>
        {/* Categories */}
        <Text style={{ fontSize: 11, fontWeight: '900', color: '#161616' }}>Reyonlar</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {['Meyve', 'Et', 'Süt', 'Ekmek', 'İçecek', 'Atıştırmalık', 'Dondurulmuş', 'Temizlik'].map(
            (c) => (
              <View
                key={c}
                style={{
                  width: '23%',
                  aspectRatio: 1,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#ECECEC',
                }}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    backgroundColor: colors.redSoft,
                  }}
                />
                <Text style={{ fontSize: 8, fontWeight: '700', marginTop: 3 }}>{c}</Text>
              </View>
            ),
          )}
        </View>
      </View>
      <MockBottomNav active="home" />
    </View>
  )
}

export function MockStore() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Dora Süpermarket" />
      <View style={{ flex: 1, padding: 10, gap: 8, backgroundColor: colors.bg }}>
        <View
          style={{
            height: 60,
            borderRadius: 12,
            backgroundColor: '#FCD7D9',
            padding: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '800' }}>⭐ 4.8 · 12 dk ETA</Text>
          <Text style={{ fontSize: 8, color: '#7A7A7A', marginTop: 2 }}>
            Min. sipariş 5.000 IQD · Ücretsiz teslimat 25.000+
          </Text>
        </View>
        {/* Aisle tabs */}
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {['Meyve', 'Et', 'Süt', 'Ekmek'].map((c, i) => (
            <View
              key={c}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: i === 0 ? colors.red : '#fff',
                borderWidth: 1,
                borderColor: i === 0 ? colors.red : '#ECECEC',
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '800',
                  color: i === 0 ? '#fff' : '#161616',
                }}
              >
                {c}
              </Text>
            </View>
          ))}
        </View>
        {/* Product grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              style={{
                width: '31%',
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 6,
                borderWidth: 1,
                borderColor: '#ECECEC',
              }}
            >
              <View
                style={{
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: '#FCD7D9',
                  marginBottom: 4,
                }}
              />
              <Text style={{ fontSize: 8, fontWeight: '800' }} numberOfLines={1}>
                Ürün adı {i}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: '900', color: colors.red, marginTop: 2 }}>
                {(i * 1500).toLocaleString('tr-TR')} IQD
              </Text>
              <View
                style={{
                  backgroundColor: colors.red,
                  borderRadius: 6,
                  paddingVertical: 4,
                  alignItems: 'center',
                  marginTop: 4,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>+</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export function MockCart() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Sepetim" />
      <View style={{ flex: 1, padding: 10, gap: 6, backgroundColor: colors.bg }}>
        {[
          { name: 'Domates', qty: 2, price: '3.000 IQD' },
          { name: 'Süt 1L', qty: 1, price: '1.500 IQD' },
          { name: 'Ekmek', qty: 3, price: '2.250 IQD' },
          { name: 'Yumurta', qty: 1, price: '4.500 IQD' },
        ].map((it) => (
          <View
            key={it.name}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderWidth: 1,
              borderColor: '#ECECEC',
            }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#FCD7D9' }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: '800' }}>{it.name}</Text>
              <Text style={{ fontSize: 9, color: '#7A7A7A', marginTop: 2 }}>x{it.qty}</Text>
            </View>
            <Text style={{ fontSize: 10, fontWeight: '900', color: colors.red }}>{it.price}</Text>
          </View>
        ))}
        <View
          style={{
            backgroundColor: '#E8F8EE',
            borderRadius: 10,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.open,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>✓</Text>
          </View>
          <Text style={{ fontSize: 10, fontWeight: '700' }}>Ücretsiz teslimata 4.750 IQD kaldı</Text>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ECECEC',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 10, color: '#7A7A7A' }}>Ara toplam</Text>
            <Text style={{ fontSize: 10, fontWeight: '800' }}>11.250 IQD</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 10, color: '#7A7A7A' }}>Teslimat</Text>
            <Text style={{ fontSize: 10, fontWeight: '800', color: colors.open }}>Ücretsiz</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.red,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>Ödemeye geç · 11.250 IQD</Text>
      </View>
    </View>
  )
}

export function MockCheckout() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Ödeme" />
      <View style={{ flex: 1, padding: 10, gap: 8, backgroundColor: colors.bg }}>
        {/* Address */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ECECEC',
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '900' }}>📍 Adres</Text>
          <Text style={{ fontSize: 9, color: '#7A7A7A', marginTop: 2 }}>
            Bağdat · Seyyidiye mah. 12. sok.
          </Text>
        </View>
        {/* Slot */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ECECEC',
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '900' }}>🕐 Teslimat saati</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {['10-12', '12-14', '14-16', '16-18', '18-20', '20-22'].map((s, i) => (
              <View
                key={s}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: i === 1 ? colors.red : colors.bg,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '800',
                    color: i === 1 ? '#fff' : '#161616',
                  }}
                >
                  {s}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* Payment methods */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ECECEC',
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '900' }}>💳 Ödeme</Text>
          {[
            { name: 'Cüzdan (15.000 IQD)', on: true },
            { name: 'Nakit', on: false },
            { name: 'Kart', on: false },
            { name: 'Apple Pay', on: false },
          ].map((p) => (
            <View
              key={p.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 4,
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: p.on ? colors.red : '#D8D8DC',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {p.on && (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.red,
                    }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#161616' }}>{p.name}</Text>
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.red,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>Siparişi onayla</Text>
      </View>
    </View>
  )
}

export function MockTracking() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Sipariş Takibi" />
      <View style={{ flex: 1, backgroundColor: '#E5F4E0' }}>
        {/* Map background */}
        <View style={{ height: 220, position: 'relative' }}>
          <View
            style={{
              position: 'absolute',
              top: 30,
              left: 40,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.red,
              borderWidth: 3,
              borderColor: '#fff',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 90,
              left: 130,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: '#fff',
              borderWidth: 3,
              borderColor: colors.red,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red }} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 150,
              right: 50,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.open,
              borderWidth: 3,
              borderColor: '#fff',
            }}
          />
        </View>
        {/* Steps card */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 14,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '900' }}>Kurye yolda · ETA 12 dk</Text>
          {[
            { label: 'Sipariş alındı', done: true },
            { label: 'Hazırlanıyor', done: true },
            { label: 'Kurye yolda', done: true, on: true },
            { label: 'Teslim edildi', done: false },
          ].map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: s.done ? colors.open : '#ECECEC',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: s.on ? 2 : 0,
                  borderColor: colors.red,
                }}
              >
                {s.done && <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>✓</Text>}
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: s.on ? '900' : '600',
                  color: s.done ? '#161616' : '#7A7A7A',
                }}
              >
                {s.label}
              </Text>
            </View>
          ))}
          <View
            style={{
              backgroundColor: colors.bg,
              borderRadius: 10,
              padding: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.red,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: '800' }}>Ahmed K.</Text>
              <Text style={{ fontSize: 8, color: '#7A7A7A' }}>🏍️ Kurye · 0771 555 0002</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export function MockOrders() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Siparişlerim" />
      <View style={{ flex: 1, padding: 10, gap: 8, backgroundColor: colors.bg }}>
        {[
          { id: '#1024', store: 'Dora Süpermarket', status: 'Teslim edildi', total: '11.250 IQD', color: colors.open },
          { id: '#1023', store: 'Dora Çarşı', status: 'Yolda', total: '8.900 IQD', color: colors.red },
          { id: '#1022', store: 'Filistin Şubesi', status: 'Hazırlanıyor', total: '15.500 IQD', color: colors.busy },
        ].map((o) => (
          <View
            key={o.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ECECEC',
              gap: 4,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 11, fontWeight: '900' }}>{o.store}</Text>
              <Text style={{ fontSize: 9, color: '#7A7A7A' }}>{o.id}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: o.color,
                }}
              />
              <Text style={{ fontSize: 9, color: '#7A7A7A' }}>{o.status}</Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: '900', color: colors.red, marginTop: 2 }}>
              {o.total}
            </Text>
          </View>
        ))}
      </View>
      <MockBottomNav active="orders" />
    </View>
  )
}

export function MockPlus() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <MockTopBar title="M10+" bg={colors.yellow} fg="#161616" />
      <View style={{ flex: 1, padding: 14, gap: 10 }}>
        <View
          style={{
            backgroundColor: colors.red,
            borderRadius: 14,
            padding: 14,
            gap: 4,
          }}
        >
          <Text style={{ color: colors.yellow, fontSize: 22, fontWeight: '900' }}>M10+</Text>
          <Text style={{ color: '#fff', fontSize: 10 }}>30 gün abonelik · ücretsiz teslimat</Text>
        </View>
        {[
          { label: 'Ücretsiz teslimat', on: true },
          { label: 'Özel kampanyalar', on: true },
          { label: 'Erken erişim', on: true },
          { label: 'Öncelikli şoför', on: true },
          { label: '%5 puan kazanım', on: true },
        ].map((f) => (
          <View
            key={f.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#fff',
              padding: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ECECEC',
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: f.on ? colors.open : '#ECECEC',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>✓</Text>
            </View>
            <Text style={{ fontSize: 10, fontWeight: '700' }}>{f.label}</Text>
          </View>
        ))}
        <View
          style={{
            backgroundColor: colors.red,
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>
            Şimdi katıl · 5.000 IQD / ay
          </Text>
        </View>
      </View>
    </View>
  )
}

export function MockButler() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Şoför Hizmeti" />
      <View style={{ flex: 1, padding: 10, gap: 8, backgroundColor: colors.bg }}>
        <View
          style={{
            backgroundColor: '#161616',
            borderRadius: 14,
            padding: 14,
            gap: 4,
          }}
        >
          <Text style={{ color: colors.yellow, fontSize: 12, fontWeight: '900' }}>
            🛵 Pazar dışı görevler
          </Text>
          <Text style={{ color: '#fff', fontSize: 9 }}>
            Marketten almak, bir yere bırakmak, evrak götürmek…
          </Text>
        </View>
        {[
          { from: 'Seyyidiye', to: 'Mansur', km: '4.2 km', price: '3.500 IQD' },
          { from: 'Dora', to: 'Karada', km: '7.8 km', price: '5.250 IQD' },
        ].map((j) => (
          <View
            key={j.from + j.to}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ECECEC',
              gap: 4,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.open,
                }}
              />
              <Text style={{ fontSize: 10, fontWeight: '800' }}>{j.from}</Text>
              <Text style={{ fontSize: 9, color: '#7A7A7A' }}>→</Text>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.red,
                }}
              />
              <Text style={{ fontSize: 10, fontWeight: '800' }}>{j.to}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 9, color: '#7A7A7A' }}>{j.km}</Text>
              <Text style={{ fontSize: 11, fontWeight: '900', color: colors.red }}>{j.price}</Text>
            </View>
          </View>
        ))}
        <View
          style={{
            backgroundColor: colors.red,
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>+ Yeni iş iste</Text>
        </View>
      </View>
      <MockBottomNav active="butler" />
    </View>
  )
}

export function MockAdmin() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Admin Panel" />
      <View style={{ flex: 1, padding: 10, gap: 8, backgroundColor: colors.bg }}>
        {/* Metrics */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[
            { v: '142', l: 'Sipariş' },
            { v: '1.530', l: 'Ürün' },
            { v: '12', l: 'Kampanya' },
          ].map((m) => (
            <View
              key={m.l}
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ECECEC',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '900', color: colors.red }}>{m.v}</Text>
              <Text style={{ fontSize: 9, color: '#7A7A7A' }}>{m.l}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 11, fontWeight: '900' }}>Modüller</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {[
            { i: '📊', l: 'Overview' },
            { i: '🗂️', l: 'Kategoriler' },
            { i: '📦', l: 'Ürünler' },
            { i: '👥', l: 'Müşteriler' },
            { i: '🎯', l: 'Kampanyalar' },
            { i: '🧾', l: 'Siparişler' },
            { i: '🏬', l: 'Mağazalar' },
            { i: '🤖', l: 'AI' },
          ].map((m) => (
            <View
              key={m.l}
              style={{
                width: '23%',
                aspectRatio: 1,
                backgroundColor: '#fff',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#ECECEC',
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 18 }}>{m.i}</Text>
              <Text style={{ fontSize: 8, fontWeight: '700' }}>{m.l}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export function MockProfile() {
  return (
    <View style={{ flex: 1 }}>
      <MockTopBar title="Hesap" />
      <View style={{ flex: 1, padding: 10, gap: 8, backgroundColor: colors.bg }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 12,
            borderLeftWidth: 3,
            borderLeftColor: colors.red,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderWidth: 1,
            borderColor: '#ECECEC',
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.red,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '900' }}>Ferhat B.</Text>
            <Text style={{ fontSize: 9, color: '#7A7A7A' }}>+964 771 555 0001</Text>
            <Text style={{ fontSize: 9, fontWeight: '800', color: colors.red, marginTop: 2 }}>
              Gold · 1.280 puan
            </Text>
          </View>
        </View>
        {[
          { i: '🔔', l: 'Bildirimler', c: '12' },
          { i: '⭐', l: 'M10+ Üyelik' },
          { i: '💰', l: 'Cüzdan · 15.000 IQD' },
          { i: '🎁', l: 'Ödüller' },
          { i: '📍', l: 'Adreslerim' },
          { i: '📖', l: 'Sistem Dokümantasyonu' },
        ].map((r) => (
          <View
            key={r.l}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              borderWidth: 1,
              borderColor: '#ECECEC',
            }}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                backgroundColor: colors.redSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 12 }}>{r.i}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '700' }}>{r.l}</Text>
            {r.c && (
              <View
                style={{
                  backgroundColor: colors.red,
                  borderRadius: 999,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>{r.c}</Text>
              </View>
            )}
            <Text style={{ color: '#9A9A9A', fontSize: 14 }}>›</Text>
          </View>
        ))}
      </View>
      <MockBottomNav active="profile" />
    </View>
  )
}
