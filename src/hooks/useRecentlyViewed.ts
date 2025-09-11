import { useState, useEffect } from 'react'

export function useRecentlyViewed(key: string, maxSize: number = 5) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : []
    } catch (error) {
      console.error(error)
      return []
    }
  })

  const addItem = (id: string) => {
    const newItems = [id, ...items.filter(i => i !== id)].slice(0, maxSize)
    setItems(newItems)
    try {
      window.localStorage.setItem(key, JSON.stringify(newItems))
    } catch (error) {
      console.error(error)
    }
  }

  return [items, addItem] as const
}
