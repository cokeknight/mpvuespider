export default [
  {
    path: '/ui',
    name: 'ui',
    component: () => import(/* webpackChunkName: "ui" */ `../pages/ui/index.vue`)
  },
  {
    path: '*',
    redirect: '/ui'
  }
]

