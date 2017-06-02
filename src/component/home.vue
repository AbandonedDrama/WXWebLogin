<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex" style="width: 100%;height: 100%;">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu :active-name="router_url" theme="dark" width="auto">
                    <div class="layout-logo-left">微信Demo</div>
                    <router-link to="/homeContent">
                        <Menu-item name="/homeContent">
                            <Icon type="ios-navigate" :size="iconSize"></Icon>
                            <span class="layout-text">首页</span>
                        </Menu-item>
                    </router-link>
                    <router-link to="/homeContent/login">
                        <Menu-item name="/homeContent/login">
                            <Icon type="ios-keypad" :size="iconSize"></Icon>
                            <span class="layout-text">微信登录</span>
                        </Menu-item>
                    </router-link>
                    <!-- <Menu-item name="3">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        <span class="layout-text">选项 3</span>
                    </Menu-item> -->
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-header">
                    <i-button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="#">首页</Breadcrumb-item>
                        <Breadcrumb-item href="#">微信登录</Breadcrumb-item>
                    </Breadcrumb>
                </div>
                <div 
                    class="layout-content sx_basis_scroll sx_scroll_style_lucency"
                    v-bind:style="{ height: winHeight - 170 + 'px' }">
                    <div class="layout-content-main">
                        <!-- 路由展示区 -->
                        <transition mode="out-in">
                          <router-view></router-view>
                        </transition>
                    </div>
                </div>
                <div class="layout-copy" :class="{'layout-copy-text': spanLeft < 5}">
                    Copyright©2017深圳市哎哟不错机器人科研有限公司All rights reserved 粤ICP备16038767号
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
import '../assets/style/home.css'
export default {
    name: 'home',
    data () {
        return {
            spanLeft: 5,
            spanRight: 19,
            winHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 页面可用高度
        }
    },
    computed: {
        iconSize () {
            return this.spanLeft === 5 ? 14 : 24
        },
        router_url: function () {
            return this.$route.path
        }
    },
    methods: {
        toggleClick () {
            if (this.spanLeft === 5) {
                this.spanLeft = 2
                this.spanRight = 22
            } else {
                this.spanLeft = 5
                this.spanRight = 19
            }
        }
    }
}
</script>
