import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cart-context'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = useCallback((product) => {
    setItems((prev) => [...prev, { ...product, id: `${product.sku}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }])
  }, [])

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const count = items.length

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.price ?? 0), 0),
    [items],
  )

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearCart, count, subtotal }),
    [items, addItem, removeItem, clearCart, count, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
