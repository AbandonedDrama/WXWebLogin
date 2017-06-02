<template>
    <div id="WXMemberList">
        <Table 
            border 
            :columns="columns" 
            :data="memberList"
            size="small"></Table>
        <Modal v-model="modal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>请输入要发送的信息</span>
            </p>
            <div style="text-align:center">
                <Input v-model="msg" placeholder="请输入..." style="width: 100%;"></Input>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="postSendMessage">发送</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getMemberList, sendMessageToSpecialMember } from '../assets/axios/api.js'
export default {
    name: 'WXMemberList',
    data () {
        return {
            wxuin: null, // 登陆后唯一识别码 键
            memberList: [], // 数据列表
            modal: false, // 对话框
            modal_loading: false, // 发送Loading
            msg: null, // 对话信息
            UserName: null, // 用户信息
            columns: [
                {
                    title: '姓名',
                    key: 'NickName',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'person'
                                }
                            }),
                            h('strong', params.row.NickName)
                        ])
                    }
                },
                {
                    title: '备注',
                    key: 'RemarkName'
                },
                {
                    title: '性别',
                    key: 'Sex',
                    render: (h, params) => {
                        return h('div', [
                            h('span', params.row.Sex === 1 ? '男' : '女')
                        ])
                    }
                },
                {
                    title: '个性签名',
                    key: 'Signature'
                },
                {
                    title: '地址',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                            h('span', params.row.Province + params.row.City)
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.openSendMessage(params.row.UserName)
                                    }
                                }
                            }, '聊天')
                        ])
                    }
                }
            ]
        }
    },
    created: function () {
        if (!this.$route.query.wxuin) {
            this.warning(false, '请先登录!')
            this.$router.push('/homeContent/login')
            return false
        }
        this.wxuin = this.$route.query.wxuin
        this.getMemberList() // 获取好友列表
    },
    methods: {
        getMemberList () {
            this.$axios.post(getMemberList, {
                wxuin: this.wxuin
            })
            .then(msg => {
                if (!msg.data) {
                    return false
                }
                this.memberList = msg.data.member_list
            })
            .catch(error => {
                this.warning(false, '好友列表获取失败!')
            })
        },
        openSendMessage (UserName) {
            this.UserName = UserName
            this.modal = true
        },
        postSendMessage () {
            if (!this.msg) {
                this.$Message.error('发送消息不能为空!')
                return false
            }
            this.modal_loading = true
            this.$axios.post(sendMessageToSpecialMember, {
                wxuin: this.wxuin,
                username: this.UserName,
                content: this.msg
            })
            .then(msg => {
                if (!msg.data) {
                    return false
                }
                this.modal_loading = false
                this.modal = false
                this.msg = null
                this.$Message.success(msg.data)
            })
            .catch(error => {
                this.warning(false, '发送失败!')
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
