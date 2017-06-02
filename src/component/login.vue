<template>
    <div id="login">
        <h1>登录页</h1>
        <br>
        <!-- <Row type="flex" justify="center">
            <Col :span="18" offset="4">
                <Steps :current="current">
                    <Step title="扫码登录" icon="qr-scanner"></Step>
                    <Step title="点击确认" icon="ios-paperplane"></Step>
                    <Step title="登陆成功" icon="android-done"></Step>
                </Steps>
            </Col>
        </Row> -->
        <br>
        <Row type="flex" justify="center">
            <Col :span="10">
                <Card>
                    <Row type="flex" justify="center" class="first">
                        <img :src="QrcodeURL">
                    </Row>
                    <br>
                    <Button type="success" @click="getQrcodeURL" long>重新获取</Button>
                </Card>
            </Col>
        </Row>
        <br>
    </div>
</template>

<style lang="less">
    .first{
        img{
            width: 100%;
            height: 100%;
        }
    }
</style>
<script>
import { getQrcode, loginWebWechat } from '../assets/axios/api.js'
export default {
    name: 'login',
    data () {
        return {
            current: 0, // 步骤
            QrcodeURL: null, // 二维码地址
            uuid: null, // 登录标识
            wxuin: null // 登陆后唯一识别码 键
        }
    },
    created: function () {
        this.getQrcodeURL() // 初始化
    },
    methods: {
        // 获取二维码
        getQrcodeURL () {
            const loading = this.$Message.loading({
                content: '正在加载中...',
                duration: 0
            })
            this.$axios.post(getQrcode)
            .then(msg => {
                setTimeout(loading, 1000)
                if (!msg.data) {
                    this.$Message.warning('获取二维码失败!请点击图片刷新!')
                    return false
                }
                this.QrcodeURL = msg.data.qrcode
                this.uuid = msg.data.uuid
                this.loginWebWechat()
            })
            .catch(error => {
                this.warning(false, '服务器Error')
            })
        },

        // 获取登录状态
        loginWebWechat () {
            this.$axios.post(loginWebWechat, {
                uuid: this.uuid
            })
            .then(msg => {
                if (!msg.data) {
                    return false
                }
                this.wxuin = msg.data
                this.success(false, '登录成功!2S后跳转好友列表!')
                setTimeout(() => {
                    this.$router.push({ path: '/homeContent/WXMemberList', query: this.wxuin })
                }, 2000)
            })
            .catch(error => {
                this.warning(false, '二维码失效!请刷新后重试!')
            })
        },

        info (title, nodesc) {
            this.$Notice.info({
                title: title ? '' : '消息',
                desc: nodesc
            })
        },
        success (title, nodesc) {
            this.$Notice.success({
                title: title ? '' : '成功',
                desc: nodesc
            })
        },
        warning (title, nodesc) {
            this.$Notice.warning({
                title: title ? '' : '警告',
                desc: nodesc
            })
        },
        error (title, nodesc) {
            this.$Notice.error({
                title: title ? '' : '错误',
                desc: nodesc
            })
        }
    }
}
</script>
