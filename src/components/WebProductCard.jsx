import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Minus, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext.web.jsx'
import { formatIQD, productName, stores, ui } from '../data/mock.web.js'
import { useI18n } from '../context/I18nContext.web.jsx'

function flyToCart(fromEl) {
  const cart = document.querySelector('.mgrs-cart, .metro-float-cart, .store-cart-bar')
  if (!fromEl || !cart) return
  const from = fromEl.getBoundingClientRect()
  const to = cart.getBoundingClientRect()
  const ghost = document.createElement('div')
  ghost.className = 'cart-fly-ghost'
  ghost.style.left = `${from.left + from.width / 2 - 14}px`
  ghost.style.top = `${from.top + from.height / 2 - 14}px`
  document.body.appendChild(ghost)
  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top + to.height / 2 - (from.top + from.height / 2)}px) scale(0.35)`
    ghost.style.opacity = '0'
  })
  setTimeout(() => ghost.remove(), 650)
}

export default function WebProductCard({ product, storeId: storeIdProp }) {
  const { cart, addToCart, setQty } = useApp()
  const { lang } = useI18n()
  const t = ui[lang] || ui.ar
  const storeId = storeIdProp || stores[0]?.id
  const btnRef = useRef(null)
  const [pulse, setPulse] = useState(false)

  const qty = cart.find((i) => i.productId === product.id)?.qty || 0
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const handleAdd = () => {
    if (!storeId) return
    addToCart(storeId, product.id, 1)
    flyToCart(btnRef.current)
    setPulse(true)
    setTimeout(() => setPulse(false), 450)
  }

  return (
    <div className={`cat-product${pulse ? ' is-added' : ''}`}>
      {discount > 0 && <span className="cat-product-sale">{t.sale}</span>}
      <Link to={`/store/${storeId}`} className="cat-product-img">
        <img src={product.image} alt={productName(product, lang)} />
      </Link>
      <div className="cat-product-info">
        <h3>{productName(product, lang)}</h3>
        <div className="cat-product-price">
          <strong>{formatIQD(product.price, lang)}</strong>
          {product.oldPrice && <span className="cat-product-from">{t.from}</span>}
          {product.oldPrice && <del>{formatIQD(product.oldPrice, lang)}</del>}
        </div>
        {qty > 0 ? (
          <div className="cat-product-qty" role="group" aria-label="quantity">
            <button type="button" onClick={() => setQty(product.id, qty - 1)} aria-label="decrease">
              <Minus size={14} />
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={(e) => {
                setQty(product.id, qty + 1)
                flyToCart(e.currentTarget)
              }}
              aria-label="increase"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button ref={btnRef} type="button" className="cat-product-btn" onClick={handleAdd}>
            {t.addToCart}
          </button>
        )}
      </div>
    </div>
  )
}
