import React, { useState, useEffect } from 'react'
import moment from 'moment'
import config from '@/config'
import { Form } from 'antd'
import { store } from '@/utils'
import { useData } from '@/contexts'

import ListPage from './list'
import DetailPage from './detail'

export default function Index(props) {
  const storeName = 'filter'
  const defFilter = { sorted: 'popularity.desc', filtered: null, startDate: null, endDate: null }
  const filter = store.use(storeName, defFilter)
  const parseFilter = JSON.parse(filter)

  const [form] = Form.useForm()
  const { view, path, match, history } = props
  const [periodDate, setPeriodDate] = useState([])
  const [sorted, setSorted] = useState(parseFilter.sorted)
  const [filtered, setFiltered] = useState(parseFilter.filtered)
  const { loading, data, pagination, onSetPagination, onMorePagination, onGetDatas, onSetData, onSetFavs } = useData()

  const onBack = () => {
    history.push('/')
  }

  const onPageDetail = () => {
    onSetData('movie', match.params.id)
  }

  const onLoadPage = async (page = 1, filter = filtered, sort = sorted) => {
    const result = await onGetDatas('genre/movie/list')
    if (parseFilter && parseFilter.startDate && parseFilter.endDate) {
      const parseStartDate = moment(parseFilter.startDate, config.app.formatDate)
      const parseEndDate = moment(parseFilter.endDate, config.app.formatDate)
      form.setFieldsValue({ release_dates: [parseStartDate, parseEndDate] })
    }
    onSetPagination('discover/movie', page, filter, sort, result ? { genres: result.genres } : null)
  }

  const onLoadMore = () => {
    onMorePagination('discover/movie', filtered, sorted)
  }

  const onFilter = val => {
    let parseFiltered = null
    let startDate = null
    let endDate = null
    const { sorted, release_dates } = val

    if (sorted) setSorted(sorted)
    if (release_dates) {
      startDate = moment(release_dates[0]).format('YYYY-MM-DD')
      endDate = moment(release_dates[1]).format('YYYY-MM-DD')
      parseFiltered = `&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}`
      setFiltered(parseFiltered)
    }

    store.set(storeName, {
      sorted,
      filtered: parseFiltered,
      startDate: release_dates ? moment(release_dates[0]).format(config.app.formatDate) : null,
      endDate: release_dates ? moment(release_dates[1]).format(config.app.formatDate) : null,
    })

    onLoadPage(1, parseFiltered, sorted)
  }

  const onReset = () => {
    store.set(storeName, defFilter)
    onLoadPage(1, defFilter.filtered, defFilter.sorted)
    setPeriodDate([])
    setSorted(defFilter.sorted)
    setFiltered(defFilter.filtered)
    form.setFieldsValue({ sorted: defFilter.sorted, release_dates: null })
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
      form={form}
      path={path}
      sorted={sorted}
      loading={loading}
      periodDate={periodDate}
      pagination={pagination}
      onReset={onReset}
      onFilter={onFilter}
      onLoadMore={onLoadMore}
      onSetFavorite={onSetFavorite}
    />
  ) : (
    <DetailPage loading={loading} data={data} onBack={onBack} onSetFavorite={onSetFavorite} />
  )
}
