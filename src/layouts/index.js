import React from 'react'
import { routes } from '@/routes'
import { Layout, BackTop } from 'antd'
import { Switch } from 'react-router-dom'
import { UpCircleOutlined } from '@ant-design/icons'
import { Header, RouteLoading, Page404 } from '@/components'

export default function PublicLayout() {
  return (
    <Layout style={{ background: '#fff' }}>
      <Header />
      <Layout.Content style={{ margin: '64px 16px 0', background: '#fff' }}>
        <div style={{ padding: 24, minHeight: '89vh' }}>
          <Switch>
            {routes &&
              routes.map(route =>
                route.component ? (
                  <RouteLoading
                    exact
                    key={route.path}
                    path={route.path}
                    render={props => <route.component {...props} {...route} />}
                  />
                ) : null
              )}

            <RouteLoading exact path="*" render={props => <Page404 {...props} />} />
          </Switch>

          <BackTop>
            <UpCircleOutlined style={{ fontSize: '46px', color: '#08c' }} />
          </BackTop>
        </div>
      </Layout.Content>
    </Layout>
  )
}
