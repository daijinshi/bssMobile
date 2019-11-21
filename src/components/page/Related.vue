<template>
    <div class="related">
        <div class="header">
            <van-icon @click="backTo" class="back" name="arrow-left" />
            <div class="title">相关工单</div>
        </div>
        <div class="content" >
            <div v-loading="loading" v-for="(item,i) in orderDatas" :key="item.ID" class="item">
                <h4 class="item-head">
                    <span class="sequence">{{i +1}}</span>
                    <span>{{item.FLOW_NO}}</span>
                    <span @click="goDetail(item.FLOW_NO)" class="detailed">查看详细</span>
                </h4>
                <div class="item-content">
                    <div class="one">
                        <span>报修人</span>
                        <span>{{item.input333}}</span>
                    </div>
                    <div class="two">
                        <span>单位</span>
                        <span>信息部门域以俄语的回复</span>
                    </div>
                    <div class="three">
                        <span>电话</span>
                        <span>{{item.store_phone}}</span>
                    </div>
                    <div class="four">
                        <span>园区</span>
                        <span>杭州余杭区</span>
                    </div>
                </div>
                <div class="item-foot">
                    <div class="left">
                        <div class="in-left">
                            <img src="../../assets/images/11.png" alt="">
                        </div>
                        <div class="in-right">
                            <div class="top">处理状态</div>
                            <div class="up">未处理</div>
                        </div>
                    </div>
                    <div class="center">
                        <div class="in-left">
                            <img src="../../assets/images/12.png" alt="">
                        </div>
                        <div class="in-right">
                            <div class="top">提交时间</div>
                            <div class="up">{{format(item.CREATE_DATE, 'yyyy-MM-dd')}}</div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="in-left">
                            <img src="../../assets/images/13.png" alt="">
                        </div>
                        <div class="in-right">
                            <div class="top">评价状态</div>
                            <div class="up">未评价</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         
    </div>
</template>
<script>
import Notify from 'vant/lib/Notify'
export default {
    data(){
        return{
            id: 1,
            orderDatas: {},
            requestData: {
                "modelKey": "PSS_DEMO_20191010",
                token: ""
            },
            loading: true,
            loginData: {}
        }      
    },
    created() {
        this.getOrderData()
    },
    methods: {
        backTo() {
            this.$router.go(-1);
        },
        goDetail(orderNum) {
            this.$router.push({
                path: '/repairOrder',
                query: {
                    orderNum: orderNum
                }
            })
        },
        getOrderData() {
            if(!sessionStorage.getItem('ms_username')){
                Notify({ type: 'danger', message: '登陆失效'});
                this.$router.push('/login') //使用编程式导航路由进行跳转
                sessionStorage.clear()
            }
            this.requestData.token = sessionStorage.getItem('ms_username')
             this.axios.post('http://192.168.154.106:8088/api/flow/flowIndexPage',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				console.log(res)//用来查看接口里面的数据
				let lg = res.data //把数据赋值给变量
				if(lg.code && lg.code > 1000 && lg.code < 2000) {
                    this.getToken()
                    return
                } else if(lg.code && lg.code == "0000"){
                    if(lg.data.rows && lg.data.rows.length < 1){
                       Notify('暂无数据')//账号密码错误时的提示 
                    }
                    this.orderDatas = lg.data.rows
                    this.loading = false
                }else {
                    Notify('登陆异常')//账号密码错误时的提示
                    this.loading = false
                    this.$router.push('/login') //使用编程式导航路由进行跳转
                    sessionStorage.clear()
                }
           },response =>{
               console.log(response)
           })
        },
        format(time, format){
            var t = new Date(time);
            var tf = function(i){return (i < 10 ? '0' : '') + i};
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                switch(a){
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                }
            })
        },
        getToken() {
            this.loginData = JSON.parse(sessionStorage.getItem("loginData"))
            this.axios.post('http://192.168.154.106:8088/api/token',this.loginData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				let lg = res.data 
				if(lg.code == "0000"){
                    sessionStorage.removeItem('ms_username')
                    sessionStorage.setItem('ms_username',lg.data.token)
                    sessionStorage.setItem('roleId',this.roleId)
                    this.getOrderData()
				}else {
                    Notify('登陆失败')/
                    this.$router.push('/login') 
                    sessionStorage.clear()
				}
                },response =>{
                    console.log(response)
            })
        }
    },
}
</script>
<style lang="less" scoped>
    .related {
        padding-top: 7vh;
           .header {
            position: fixed;
            top: 0;
            width: 100%;
            height: 7vh;
            line-height: 7vh;
            font-size: .4rem /* 30/75 */;
            color: #fff;
            background: #33cc99;
            z-index: 999;
             .back {
                position: absolute;
                left: 2%;
                transform: translateY(-50%);
                top: 50%;
            }
            .title {
                height: 100%;
                text-align: center;
                font-size: .4rem /* 30/75 */;
                font-weight: 700;
                color: #fff;
            }
        }
        .content {
            padding: 2%;
            .item:nth-child(1){
            margin-top:0;
            }
            .item  {
                background: #fff;
                padding: 2%;
                margin-top: .266667rem /* 20/75 */;
                border-radius: .133333rem /* 10/75 */;
                .item-head {
                    height: .666667rem /* 50/75 */;
                    line-height: .666667rem /* 50/75 */;
                    border-bottom: 1px solid #ccc;
                    .sequence {
                        font-size: .373333rem /* 28/75 */;
                        padding-right: .133333rem /* 10/75 */;
                    }
                    .detailed {
                        float:right;
                    }
                }
                .item-content {
                    border-bottom: 1px solid #ccc;
                    .one span:nth-child(1),
                    .two span:nth-child(1),
                    .three span:nth-child(1),
                    .four span:nth-child(1){
                        height: .8rem /* 60/75 */;
                        line-height: .8rem /* 60/75 */;
                        display: inline-block;
                        width: 1.333333rem /* 100/75 */;
                        color: #999;
                    }
                }
                .item-foot {
                    display: flex;
                    padding: .266667rem /* 20/75 */ .8rem /* 60/75 */;
                    .left,
                    .center,
                    .right {
                         display: flex;
                         width: 33.33%;
                         padding: 0 .266667rem /* 20/75 */;
                         border-right: 1px solid #ccc;
                         box-sizing:border-box;
                         font-size: .213333rem /* 16/75 */;
                         text-align: center;
                         .in-left {
                             position: relative;
                             width: 20%;
                             margin-right: 10%;
                             img {
                                 position: absolute;
                                 top: 50%;
                                 left: 50%;
                                 transform: translate(-50%,-50%)
                             }
                         }
                    }
                    .right {
                        border-right: none;
                    }
                }
            }
        }

    }

</style>