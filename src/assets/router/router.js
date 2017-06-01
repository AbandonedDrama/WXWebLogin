// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login', // 登录
    component: resolve => require(['../../component/login.vue'],
      resolve),
    meta: { auth: false }
  },
  // {
  //   path: '/official_website', // 官网后台
  //   component: resolve => require(['../../component/official_website.vue'],
  //         resolve),
  //   children: [
  //     {
  //       path: '/addNews', // 添加新闻
  //       component: resolve => require(['../../component/addNews.vue'],
  //         resolve)
  //     },
  //     {
  //       path: '/newsList', // 新闻列表
  //       component: resolve => require(['../../component/newsList.vue'],
  //         resolve)
  //     },
  //     {
  //       path: '/addEmploy', // 添加招聘
  //       component: resolve => require(['../../component/addEmploy.vue'],
  //         resolve)
  //     },
  //     {
  //       path: '/employList', // 招聘列表
  //       component: resolve => require(['../../component/employList.vue'],
  //         resolve)
  //     },
  //     {
  //       path: '/addQrcode', // 添加App二维码
  //       component: resolve => require(['../../component/addQrcode.vue'],
  //         resolve)
  //     },
  //     {
  //       path: '/qrcodeList', // App二维码列表
  //       component: resolve => require(['../../component/qrcodeList.vue'],
  //         resolve)
  //     }
  //   ]
  // },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 输出router
export default router
