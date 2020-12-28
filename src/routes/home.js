import { Home } from '@/pages'

const routes = [
  {
    view: 'list',
    path: '/',
    component: Home,
  },
  {
    view: 'detail',
    path: '/:id',
    component: Home,
  },
]

export default routes
