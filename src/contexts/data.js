import React, { useState, useContext, useCallback, createContext } from 'react'
import { api } from '@/utils'

const DataContext = createContext({})
const useData = () => useContext(DataContext)

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

  const onSetPagination = async (endPoint, page = 1, filter, sorted, additional = null) => {
    setLoading(true)
    try {
      const result = await api.paginate(endPoint, page, filter, sorted)
      if (result) setPagination({ ...pagination, ...result, ...additional })
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

      results = results.concat(result.results)
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
        onSetPagination,
        onMorePagination,
      }}
      {...props}
    />
  )
}

export { DataProvider, useData }
