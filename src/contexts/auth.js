import React, { useState, useEffect, useContext, useCallback, createContext } from 'react'
import { api, store, util } from '@/utils'

const AuthContext = createContext({})
const useAuth = () => useContext(AuthContext)

function AuthProvider(props) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)

  const onLogin = useCallback(async (email, password, remember) => {
    try {
      setFetching(true)
      store.remove('usrmail')
      store.remove('usrpswd')
      if (remember) {
        store.set('usrmail', util.encryptAes(email))
        store.set('usrpswd', util.encryptAes(password))
      }

      let val = { email, password }
      if (!util.validateEmail(val.email)) {
        val.username = val.email
        delete val.email
      }

      const result = await api.post('auth/login', val, false)
      if (result && result.meta.success) {
        store.set('usrtoken', result.data.token_access)
        store.set('usraccess', util.encryptAes(result.data.user))

        setTimeout(async () => {
          window.location.href = '/'
        }, 200)
      }
      setFetching(false)
      return result
    } catch (error) {
      // return { meta: { success: false, message: error.message } }
      throw new Error(error.message)
    }
  }, [])

  const onLogout = () => {
    store.remove('usrtoken')
    store.remove('usraccess')
    setProfile(null)
    setUser(null)

    setTimeout(async () => {
      window.location.href = '/'
    }, 200)
  }

  useEffect(() => {
    async function getProfile() {
      const token = store.get('usrtoken')
      if (token) {
        const result = await api.get('profile')
        if (result && result.meta && result.meta.success) {
          const user = store.get('usraccess')
          if (user) setUser(JSON.parse(util.decryptAes(user)))
          setProfile(result.data)
        }
      }
      setLoading(false)
    }

    getProfile()
  }, [])

  return <AuthContext.Provider value={{ loading, fetching, user, profile, onLogin, onLogout }} {...props} />
}

export { AuthProvider, useAuth }
