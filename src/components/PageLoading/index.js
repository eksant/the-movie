import './index.less'
import React from 'react'
import { Spin } from 'antd'
import icon from '@/assets/loading.gif'

export default function PageLoading({ loading, children }) {
  return (
    <div className="loading">
      <Spin
        spinning={loading}
        className="loading-icon"
        indicator={<img src={icon} alt="loading" style={{ height: '100px', width: '160px' }} />}
      >
        {children}
      </Spin>
    </div>
  )
}
