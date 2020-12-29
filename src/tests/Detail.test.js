import React from 'react'
import Detail from '@/pages/Home/detail'
import { act } from 'react-dom/test-utils'
import { render, unmountComponentAtNode } from 'react-dom'

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    }
  }

let container = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('Renders detail movie', async () => {
  const fakeData = {
    adult: false,
    backdrop_path: '/srYya1ZlI97Au4jUYAktDe3avyA.jpg',
    budget: 200000000,
    homepage: 'https://www.warnerbros.com/movies/wonder-woman-1984',
    id: 464052,
    imdb_id: 'tt7126948',
    my_fav: true,
    my_fav_created: '2020-12-29T21:42:21+07:00',
    original_language: 'en',
    original_title: 'Wonder Woman 1984',
    overview: 'Wonder Woman comes into conflict with the Soviet Union.',
    popularity: 3469.571,
    poster_path: '/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
    release_date: '2020-12-16',
    revenue: 85000000,
    runtime: 151,
    status: 'Released',
    tagline: 'A new era of wonder begins.',
    title: 'Wonder Woman 1984',
    video: false,
    vote_average: 7.5,
    vote_count: 1349,
  }

  jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeData),
    })
  )

  await act(async () => {
    render(<Detail data={fakeData} />, container)
  })

  expect(container.querySelector('h1').textContent).toBe(fakeData.original_title)
  expect(container.querySelector('img').textContent).toBe('')
  expect(container.textContent).toContain(fakeData.overview)

  global.fetch.mockRestore()
})
