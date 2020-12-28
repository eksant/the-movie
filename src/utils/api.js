import config from '@/config'

const hostApi = config.api.host
const keyApi = config.api.key

const headerOptions = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
}

async function paginate(endpoint, page = 1, filtered = null, sorted = null, lang = 'en-US') {
  const options = { method: 'GET', headers: headerOptions }

  let url = `${hostApi}/${endpoint}?api_key=${keyApi}&language=${lang}&page=${page}`
  if (filtered) url = url.concat(`&${filtered}`)
  if (sorted) url = url.concat(`&sort_by=${sorted}`)

  return fetch(url, options)
    .then(response => response.json())
    .then(async data => data)
    .catch(error => error)
}

async function get(endpoint, lang = 'en-US') {
  const options = { method: 'GET', headers: headerOptions }
  let url = `${hostApi}/${endpoint}?api_key=${keyApi}&language=${lang}`

  return fetch(url, options)
    .then(response => response.json())
    .then(async data => data)
    .catch(error => error)
}

const api = { paginate, get }

export default api
