const config = {
  app: {
    pageLimit: 10,
    version: '0.1.0',
    storeKey: 'the-movie',
    formatYear: 'YYYY',
    formatDate: 'DD/MM/YYYY',
    formatDateTime: 'DD MMM YYYY hh:mm:ss',
  },
  api: {
    host: 'https://api.themoviedb.org/3',
    key: process.env.REACT_APP_API_KEY,
    image: 'http://image.tmdb.org/t/p',
  },
}

export default config
