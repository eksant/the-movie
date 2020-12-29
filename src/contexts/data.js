import React, { useState, useContext, useCallback, createContext } from 'react'
import { api, store } from '@/utils'

const DataContext = createContext({})
const useData = () => useContext(DataContext)
const storeName = 'favs'

function DataProvider(props) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    results: [],
    page: null,
    total_pages: null,
    total_results: null,
    hasMore: true,
  })

  const onSetFavs = async payload => {
    setLoading(true)
    try {
      if (payload) {
        let payloads = []
        let addFav = true
        let oldFavs = store.get(storeName)
        let parseOldFavs = oldFavs ? JSON.parse(oldFavs) : []

        if (parseOldFavs.length > 0) {
          payloads = parseOldFavs

          const favIdx = payloads.findIndex(f => f.id === parseInt(payload.id))
          if (favIdx > -1) {
            addFav = false
            // payloads = payloads.splice(favIdx, 1)
            const newPayloads = payloads.filter(f => f.id !== payloads[favIdx].id)
            payloads = newPayloads
          }
        }

        if (addFav) payloads.push(payload)
        store.set(storeName, payloads)

        const mapResults = pagination.results.map(i => {
          const favs = payloads.filter(f => f.id === i.id)
          i.my_fav = favs.length > 0
          i.my_fav_created = favs.length > 0 ? favs[0].my_fav_created : null
          return i
        })

        setPagination({ ...pagination, results: mapResults })

        if (data) {
          data.my_fav = addFav
          data.my_fav_created = addFav ? payload.my_fav_created : null

          setData(data)
        }
      }
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  const onSetPagination = async (endPoint, page = 1, filter, sorted, additional = null) => {
    setLoading(true)
    try {
      const result = await api.paginate(endPoint, page, filter, sorted)
      if (result) {
        const oldFavs = store.get(storeName)
        const parseOldFavs = oldFavs ? JSON.parse(oldFavs) : []

        const mapResults = result.results.map(i => {
          const favs = parseOldFavs.filter(f => f.id === i.id)
          i.my_fav = favs.length > 0
          i.my_fav_created = favs.length > 0 ? favs[0].my_fav_created : null
          return i
        })
        setPagination({ ...pagination, ...result, ...additional, results: mapResults })
      }
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  const onMorePagination = async (endPoint, filter, sorted) => {
    setLoading(true)
    try {
      let { page, results } = pagination
      const result = await api.paginate(endPoint, page + 1, filter, sorted)

      if (result && result.results && result.results.length < 1) {
        setLoading(false)
        setPagination({ ...pagination, hasMore: false })
        return
      }

      const oldFavs = store.get(storeName)
      const parseOldFavs = oldFavs ? JSON.parse(oldFavs) : []

      const mapResults = result.results.map(i => {
        const favs = parseOldFavs.filter(f => f.id === i.id)
        i.my_fav = favs.length > 0
        i.my_fav_created = favs.length > 0 ? favs[0].my_fav_created : null
        return i
      })

      results = results.concat(mapResults)
      result.results = results
      if (result) setPagination({ ...pagination, ...result })
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  const onSetData = async (endPoint, id) => {
    setLoading(true)
    try {
      const params = id ? `${endPoint}/${id}` : endPoint
      const result = await api.get(params)

      const oldFavs = store.get(storeName)
      const parseOldFavs = oldFavs ? JSON.parse(oldFavs) : []

      const favs = await parseOldFavs.filter(f => f.id === parseInt(id))
      result.my_fav = favs.length > 0
      result.my_fav_created = favs.length > 0 ? favs[0].my_fav_created : null

      setData(result)
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  const onGetDatas = useCallback(async endPoint => {
    try {
      return await api.get(`${endPoint}`)
    } catch (error) {
      setError(error)
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        data,
        error,
        loading,
        pagination,
        onSetData,
        onGetDatas,
        onSetFavs,
        onSetPagination,
        onMorePagination,
      }}
      {...props}
    />
  )
}

export { DataProvider, useData }
