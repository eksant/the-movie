import 'nprogress/nprogress.css'
import './index.less'
import React, { useEffect } from 'react'
import nprogress from 'nprogress'
import { Route } from 'react-router-dom'

export default function RouteLoading(props) {
  useEffect(() => {
    nprogress.done()
    return () => nprogress.start()
  }, [])

  return <Route {...props} />
}
