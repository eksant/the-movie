import React from 'react'
import { Result, Button, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

export default function Page500({ message }) {
  return (
    <Result
      status="500"
      title={'Sorry, there was an error in the application'}
      subTitle={'Please click the Home button to return to the dashboard'}
      extra={[
        <Button type="primary" key="home" onClick={() => (window.location.href = '/')}>
          Home
        </Button>,
      ]}
    >
      {message ? (
        <div className="desc">
          <Typography.Paragraph>
            <Typography.Text strong style={{ fontSize: 16 }}>
              {'The following error content'}:
            </Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <CloseCircleOutlined style={{ color: 'red' }} /> {message}
          </Typography.Paragraph>
        </div>
      ) : null}
    </Result>
  )
}
