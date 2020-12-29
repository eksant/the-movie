import React from 'react'
import moment from 'moment'
import config from '@/config'
import { util } from '@/utils'
import { Link } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller'
import { StarOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import {
  Row,
  Col,
  Tag,
  List,
  Card,
  Form,
  Space,
  Image,
  Button,
  Select,
  Tooltip,
  Statistic,
  DatePicker,
  Typography,
} from 'antd'

export default function ListPage({ path, loading, pagination, sorted, onLoadMore, onFilter, onSetFavorite }) {
  const loadMore =
    !loading && pagination && pagination.hasMore ? (
      <div
        style={{
          height: 32,
          marginTop: 12,
          lineHeight: '32px',
          textAlign: 'center',
        }}
      >
        <Button type="primary" onClick={onLoadMore}>
          Load More
        </Button>
      </div>
    ) : null

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Typography.Title>Popular Movies</Typography.Title>
      </Col>

      <Col xl={6} style={{ marginBottom: 16 }}>
        <Form layout="inline" initialValues={{ sorted }} onFinish={onFilter}>
          <Card size="small" title="Sort Results By" style={{ width: '100%' }}>
            <Form.Item name="sorted">
              <Select
                showSearch
                style={{ width: '100%' }}
                optionFilterProp="children"
                placeholder="Search to Select"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optA, optB) => optA.children.toLowerCase().localeCompare(optB.children.toLowerCase())}
              >
                <Select.Option value="popularity.desc">Popularity Descending</Select.Option>
                <Select.Option value="popularity.asc">Popularity Ascending</Select.Option>
                <Select.Option value="release_date.desc">Release Date Descending</Select.Option>
                <Select.Option value="release_date.asc">Release Date Ascending</Select.Option>
                <Select.Option value="vote_count.desc">Vote Count Descending</Select.Option>
                <Select.Option value="vote_count.asc">Vote Count Ascending</Select.Option>
              </Select>
            </Form.Item>
          </Card>

          <Card size="small" title="Primary Release Dates" style={{ margin: '12px 0', width: '100%' }}>
            <Form.Item name="release_dates">
              <DatePicker.RangePicker format={config.app.formatDate} />
            </Form.Item>
          </Card>

          <Button type="primary" htmlType="submit" disabled={loading} style={{ margin: '24px 0', width: '100%' }}>
            Search
          </Button>
        </Form>
      </Col>

      <Col xl={18}>
        <InfiniteScroll
          pageStart={0}
          useWindow={true}
          initialLoad={false}
          loadMore={onLoadMore}
          hasMore={!loading && pagination && pagination.hasMore}
        >
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            loading={loading}
            loadMore={loadMore}
            dataSource={pagination && pagination.results}
            renderItem={item => {
              const title = `${item.title} (${moment(item.release_date).format(config.app.formatYear)})`
              const labelGenres = item.genre_ids.map(id => {
                const genre = pagination && pagination.genres && pagination.genres.filter(item => item.id === id)
                return <Tag key={id}>{genre && genre[0].name}</Tag>
              })
              const description = (
                <>
                  <Space size="small">
                    <Statistic value={item.popularity} prefix={<StarOutlined />} valueStyle={{ fontSize: '14px' }} />

                    <Tooltip title="Click for loving this movie">
                      <Button
                        danger
                        type="text"
                        size="small"
                        shape="circle"
                        onClick={() => onSetFavorite(item)}
                        icon={item.my_fav ? <HeartFilled /> : <HeartOutlined />}
                      />
                    </Tooltip>
                  </Space>

                  <br />
                  {util.shortDescription(item.overview, 70)}
                  <br />
                  {labelGenres}
                </>
              )

              return (
                <List.Item>
                  <Card
                    // hoverable
                    size="small"
                    cover={
                      <Link to={`${path}${item.id}`}>
                        <Image
                          height={300}
                          src={`${config.api.image}/w440_and_h660_face${item.poster_path}`}
                          fallback="data:image/png;base64,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"
                        />
                      </Link>
                    }
                  >
                    <Card.Meta title={title} description={description} />
                  </Card>
                </List.Item>
              )
            }}
          />
        </InfiniteScroll>
      </Col>
    </Row>
  )
}
