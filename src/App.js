import '@/styles/global.less'
import React from 'react'
import Layout from '@/layouts'
import { DataProvider } from '@/contexts'
import { BrowserRouter as Router } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <DataProvider>
        <Layout />
      </DataProvider>
    </Router>
  )
}
