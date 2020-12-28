import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useData } from '@/contexts'

import ListPage from './list'
import DetailPage from './detail'

export default function Index(props) {
  const { view, path, match, history } = props
  const [filtered, setFiltered] = useState(null)
  const [sorted, setSorted] = useState('popularity.desc')
  const { loading, data, pagination, onSetPagination, onMorePagination, onGetDatas, onSetData } = useData()

  const onBack = () => {
    history.push('/')
  }

  const onPageDetail = () => {
    onSetData('movie', match.params.id)
  }

  const onLoadPage = async (page = 1, filter, sort = sorted) => {
    const result = await onGetDatas('genre/movie/list')
    onSetPagination('discover/movie', page, filter, sort, result ? { genres: result.genres } : null)
  }

  const onLoadMore = () => {
    onMorePagination('discover/movie', filtered, sorted)
  }

  const onFilter = val => {
    let parseFiltered = null
    const { sorted, release_dates } = val

    if (sorted) setSorted(sorted)
    if (release_dates) {
      const startDate = moment(release_dates[0]).format('YYYY-MM-DD')
      const endDate = moment(release_dates[1]).format('YYYY-MM-DD')
      parseFiltered = `&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}`
      setFiltered(parseFiltered)
    }

    onLoadPage(1, parseFiltered, sorted)
  }

  useEffect(() => {
    function init() {
      switch (view) {
        case 'detail':
          onPageDetail()
          break
        default:
          onLoadPage()
          break
      }
    }
    init()
  }, []) // eslint-disable-line

  return view === 'list' ? (
    <ListPage
      path={path}
      sorted={sorted}
      loading={loading}
      pagination={pagination}
      onFilter={onFilter}
      onLoadMore={onLoadMore}
    />
  ) : (
    <DetailPage loading={loading} data={data} onBack={onBack} />
  )
}
