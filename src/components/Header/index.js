import './index.less'
import React from 'react'
import logo from '@/assets/tmdb.png'
import { Layout, Row, Col } from 'antd'

export default function Header() {
  return (
    <Layout.Header className="header">
      <Row justify="start" align="middle">
        <Col span={2}>
          <div className="header-logo">
            <a href="/">
              <img src={logo} alt="logo" />
            </a>
          </div>
        </Col>

        <Col span={12}></Col>

        <Col span={10}>
          <Row justify="end" align="middle">
            {/* <Input.Search placeholder="input search text" size="large" style={{ width: '100%' }}  /> */}
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  )
}
