import config from '../config'
// import util from './util'

const storeName = config.app.storeKey

function use(key, value) {
  const result = get(key)
  if (!result || result === undefined) return set(key, value)
  return result
}

function get(key) {
  const result = localStorage.getItem(`${storeName}-${key}`)
  return typeof result === 'string' ? result : JSON.parse(result)
  // return util.isObject(result) ? JSON.parse(result) : result
}

function set(key, data) {
  // data = util.isObject(data) ? JSON.stringify(data) : data
  data = typeof data === 'string' ? data : JSON.stringify(data)
  localStorage.setItem(`${storeName}-${key}`, data)
  return get(key)
}

function each(fn) {
  for (var i = localStorage.length - 1; i >= 0; i--) {
    var key = localStorage.key(i)
    fn(get(key), key)
  }
}

function remove(key) {
  return localStorage.removeItem(`${storeName}-${key}`)
}

function clear() {
  return localStorage.clear()
}

const store = { use, get, set, each, remove, clear }

export default store
