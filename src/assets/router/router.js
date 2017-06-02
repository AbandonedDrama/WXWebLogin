// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import iView from 'iview'
Vue.use(iView)

const routes = [
    {
        path: '/home', // 基础布局
        component: resolve => require(['../../component/home.vue'], resolve),
        children: [
            {
                path: '/homeContent', // 首页
                component: resolve => require(['../../component/home_content.vue'], resolve)
            }, {
                path: '/homeContent/login', // 登录页
                component: resolve => require(['../../component/login.vue'], resolve)
            }, {
                path: '/homeContent/WXMemberList', // 好友列表
                component: resolve => require(['../../component/WXMemberList.vue'], resolve)
            }
        ]
    }, {
        path: '*',
        redirect: '/homeContent'
    }
]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    next()
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
})

// 输出router
export default router
