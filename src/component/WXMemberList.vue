<template>
    <div id="WXMemberList">
        <Row type="flex" justify="center" class="code-row-bg">
            <Col span="20">
                <Card style="width:100%;">
            		<Row type="flex" justify="end" class="code-row-bg">
            			<Col>
            				<Button type="info" @click="addUserModal = true">绑定用户</Button>
            			</Col>
            		</Row>
                    <br>
                    <Table 
                        border 
                        :columns="columns" 
                        :data="memberList"
                        size="small"
                        @on-selection-change="selectChange">
                    </Table>
                    <br>
                    <Button type="success" long @click="modal = true">发送消息</Button>
                </Card>
            </Col>
        </Row>
		<br>
		<Modal v-model="addUserModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>请输入要绑定的群名称</span>
            </p>
            <div style="text-align:center">
                <Select v-model="nickname" filterable>
                    <Option v-if="nameList" v-for="name in nameList" :value="name.name" :key="name.name">{{ name.name }}</Option>
                </Select>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="addUserModal_loading" @click="addBindMember">绑定</Button>
            </div>
        </Modal>

        <Modal v-model="modal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>请输入要发送的信息</span>
            </p>
            <div style="text-align:center">
                <Input v-model="msg" placeholder="请输入..." style="width: 100%;"></Input>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="postSendMessageList">发送</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getMemberList, addBindMember, getBindMemberList, sendMessageToSpecialMember } from '../assets/axios/api.js'
export default {
    name: 'WXMemberList',
    data () {
        return {
            wxuin: null, // 登陆后唯一识别码 键
            memberList: [], // 数据列表
            nameList: [], // 好友姓名列表
            modal: false, // 发送消息对话框
            modal_loading: false, // 发送Loading
            msg: null, // 对话信息
            UserName: null, // 用户信息

            addUserModal: false, // 绑定用户对话框
            addUserModal_loading: false, // 等待Loading
            nickname: null, // 绑定用户名称
            sendMessageList: null, // 待发消息用户组
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'person'
                                }
                            }),
                            h('strong', params.row.name)
                        ])
                    }
                }
                // {
                //     title: '操作',
                //     key: 'action',
                //     width: 150,
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', [
                //             h('Button', {
                //                 props: {
                //                     type: 'primary',
                //                     size: 'small'
                //                 },
                //                 style: {
                //                     marginRight: '5px'
                //                 },
                //                 on: {
                //                     click: () => {
                //                         this.openSendMessage(params.row.name)
                //                     }
                //                 }
                //             }, '聊天')
                //         ])
                //     }
                // }
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
        this.getBindMemberList() // 获取绑定列表
    },
    methods: {
        selectChange (selection) {
            this.sendMessageList = selection
        },
        getMemberList () {
            this.$axios.post(getMemberList, {
                wxuin: this.wxuin
            })
            .then(msg => {
                if (!msg.data) {
                    return false
                }
                console.log(msg.data.member_list)
                let nameList = []
                for (let i = msg.data.member_list.length - 1; i >= 0; i--) {
                    nameList.push(msg.data.member_list[i].NickName)
                }
                let n = {}
                let r = [] // n为hash表，r为临时数组
                for (let i = 0; i < nameList.length; i++) { // 遍历当前数组
                    if (!n[nameList[i]]) { // 如果hash表中没有当前项
                        n[nameList[i]] = true // 存入hash表
                        r.push(nameList[i]) // 把当前数组的当前项push到临时数组里面
                    }
                }
                for (let i = r.length - 1; i >= 0; i--) {
                    this.nameList.push({
                        name: r[i]
                    })
                }
            })
            .catch(error => {
                this.warning(false, '好友列表获取失败!')
            })
        },
        getBindMemberList () {
            this.$axios.post(getBindMemberList, {
                wxuin: this.wxuin
            })
            .then(msg => {
                if (!msg.data) {
                    return false
                }
                this.memberList = msg.data
            })
            .catch(error => {
                this.warning(false, '绑定列表获取失败!')
            })
        },
        postSendMessageList () {
            if (!this.msg) {
                this.$Message.error('发送消息不能为空!')
                return false
            }
            if (!this.sendMessageList) {
                this.modal = false
                this.$Message.error('请至少选择一个群组发送!')
                return false
            }
            this.modal_loading = true // 开启loading
            this.$axios.post(sendMessageToSpecialMember, {
                wxuin: this.wxuin,
                username: this.sendMessageList,
                content: this.msg
            })
            .then(msg => {
                if (!msg.data) {
                    return false
                }
                this.modal_loading = false // 关闭lading
                this.modal = false // 关闭模型
                this.msg = null // 清空消息
                this.$Message.success('发送完成')
            })
            .catch(error => {
                this.warning(false, '发送失败!')
            })
        },

        // 绑定用户
        addBindMember () {
            if (!this.nickname) {
                this.$Message.error('绑定用户名不能为空!')
                return false
            }
            this.addUserModal_loading = true
            this.$axios.post(addBindMember, {
                wxuin: this.wxuin,
                nickname: this.nickname
            })
            .then(msg => {
                if (!msg.data) {
                    return false
                }
                this.addUserModal_loading = false
                this.addUserModal = false
                this.$Message.success(msg.data)
                this.getBindMemberList() // 绑定成功后重新获取绑定列表
            })
            .catch(error => {
                this.warning(false, '绑定失败!')
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
