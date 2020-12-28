import CryptoJS from 'crypto-js'
import config from '../config'

const keySize = 256
const iterations = 100
const secretKey = config.app.secretKey
const pageLimit = config.app.pageLimit
const formatDate = config.app.formatDate

function randomPassword(length = 8) {
  var chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  var pass = ''

  for (var x = 0; x < length; x++) {
    var i = Math.floor(Math.random() * chars.length)
    pass += chars.charAt(i)
  }

  return pass
}

function hmacEncrypt(message) {
  const encrypted = CryptoJS.HmacSHA256(message, secretKey)
  return encrypted.toString(CryptoJS.enc.Base64)
}

function encryptAes(payload) {
  if (!payload) return null
  if (isObject(payload)) payload = JSON.stringify(payload)

  const key = CryptoJS.PBKDF2(secretKey, secretKey, { keySize: keySize / 32, iterations: iterations })
  return CryptoJS.AES.encrypt(payload, key, {
    iv: CryptoJS.enc.Utf8.parse(secretKey),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString()
}

function decryptAes(payload) {
  if (!payload) return null

  const key = CryptoJS.PBKDF2(secretKey, secretKey, { keySize: keySize / 32, iterations: iterations })
  const result = CryptoJS.AES.decrypt(payload, key, {
    iv: CryptoJS.enc.Utf8.parse(secretKey),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8)

  return result ? (isObject(result) ? JSON.parse(result) : result) : null
}

function encrypt(payload) {
  if (!payload) return null
  if (isObject(payload)) payload = JSON.stringify(payload)

  let salt = CryptoJS.lib.WordArray.random(128 / 8)
  let iv = CryptoJS.lib.WordArray.random(128 / 8)
  let key = CryptoJS.PBKDF2(secretKey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  })
  let encrypted = CryptoJS.AES.encrypt(payload, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  })

  return salt.toString() + iv.toString() + encrypted.toString()
}

function decrypt(payload) {
  if (!payload) return null

  let salt = CryptoJS.enc.Hex.parse(payload.substr(0, 32))
  let iv = CryptoJS.enc.Hex.parse(payload.substr(32, 32))
  let encrypted = payload.substring(64)
  let key = CryptoJS.PBKDF2(secretKey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  })
  let result = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8)

  return result ? (isObject(result) ? JSON.parse(result) : result) : null
}

function isList(val) {
  return val != null && typeof val != 'function' && typeof val.length == 'number'
}

function isFunction(val) {
  return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
  return val && {}.toString.call(val) === '[object Object]'
}

function isArray(val) {
  return Array.isArray(val)
}

function isObjEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

function basePath(str) {
  var n = str.lastIndexOf('/')
  return str.substr(0, n)
}

function parseObject(val) {
  if (!val) return null
  return JSON.parse(val)
}

function dashSpace(str) {
  str = str.replace(/\s/g, '-')
  return uCase(str)
}

function uCase(str) {
  const text = str.replace('_', ' ')
  return text.replace(/\w\S*/g, txt => {
    const exceptTxt = txt === 'DKI' || txt === 'DI' ? txt : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    return exceptTxt
  })
}

function getBase64(img) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.readAsDataURL(img)
  })
}

function convertToRupiah(number) {
  if (!number) return null

  var rupiah = ''
  var angkarev = number.toString().split('').reverse().join('')

  for (var i = 0; i < angkarev.length; i++) if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + '.'

  return (
    'Rp. ' +
    rupiah
      .split('', rupiah.length - 1)
      .reverse()
      .join('')
  )
}

function shortLink(link) {
  const files = link.split('/').slice(-1).pop().split('_')
  const ext = files.slice(-1).pop().split('.').slice(-1).pop()
  return files.slice(1, files.length - 1).join('-') + '.' + ext
}

function shortDescription(text, length = 100) {
  if (!text) return null
  return text.substr(0, length) + '...'
}

function runtimeConvertion(mins) {
  if (!mins) return null

  let h = Math.floor(mins / 60)
  let m = mins % 60
  return `${h}:${m} minutes`
}

function convertToDollar(number) {
  if (!number) return null
  return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const util = {
  isList,
  isFunction,
  isObject,
  isArray,
  basePath,
  randomPassword,
  hmacEncrypt,
  encryptAes,
  decryptAes,
  encrypt,
  decrypt,
  parseObject,
  dashSpace,
  uCase,
  isObjEmpty,
  getBase64,
  convertToRupiah,
  shortLink,
  shortDescription,
  runtimeConvertion,
  convertToDollar,
  pageLimit,
  formatDate,
}

export default util
