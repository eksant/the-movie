import React from 'react'
import { Result, Button } from 'antd'

export default function Page404() {
  return (
    <Result
      status="404"
      title={'Sorry, the page you visited does not exist'}
      subTitle={'Please click the button to return to the dashboard'}
      extra={[
        <Button type="primary" key="home" onClick={() => (window.location.href = '/')}>
          Back To Dashboard
        </Button>,
      ]}
    />
  )
}
