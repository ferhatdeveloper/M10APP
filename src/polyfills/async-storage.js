// AsyncStorage mock using localStorage
const AsyncStorage = {
  getItem: async (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {}
  },
  removeItem: async (key) => {
    try {
      localStorage.removeItem(key)
    } catch {}
  },
  clear: async () => {
    try {
      localStorage.clear()
    } catch {}
  },
}

export default AsyncStorage
