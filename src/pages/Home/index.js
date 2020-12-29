import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useData } from '@/contexts'

import ListPage from './list'
import DetailPage from './detail'

export default function Index(props) {
  const { view, path, match, history } = props
  const [filtered, setFiltered] = useState(null)
  const [sorted, setSorted] = useState('popularity.desc')
  const { loading, data, pagination, onSetPagination, onMorePagination, onGetDatas, onSetData, onSetFavs } = useData()

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

  const onSetFavorite = val => {
    const payload = {
      id: val.id,
      original_title: val.original_title,
      overview: val.overview,
      genre_ids: val.genre_ids,
      popularity: val.popularity,
      release_date: val.release_date,
      poster_path: val.poster_path,
      my_fav: true,
      my_fav_created: moment().format(),
    }
    onSetFavs(payload)
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
      onSetFavorite={onSetFavorite}
    />
  ) : (
    <DetailPage loading={loading} data={data} onBack={onBack} onSetFavorite={onSetFavorite} />
  )
}
