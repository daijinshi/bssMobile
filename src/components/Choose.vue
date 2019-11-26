<template>
    <div class="choose"  element-loading-text="拼命加载中">
        <div class="header">
            <van-icon @click="backTo" class="back" name="arrow-left" />
            <div class="title">报修筛选</div>
        </div>
        <div class="content">
            <div class="search">
                 <div class="work-number">
                    <span>报修单号</span
                    ><input v-model="repairNum" type="text" placeholder="请输入报修单号">
                </div> 
                <div class="work-time">
                    <span>报修时间</span
                    >
                    <div class="time-input">
                         <vant-field-date
                        v-model="formData.beginData"
                        :type="date"
                        />
                    <div class="center">─</div>
                        <vant-field-date
                        v-model="formData.endData"
                        :type="date"
                        />
                    </div>
                </div>
            </div>
            <van-button @click="search" class="submit" type="info">确认</van-button>
            <div class="warranty" >
                 <van-pull-refresh v-model="isLoading" @refresh="onRefresh">                
                     <van-list v-model="loading" :finished="finished" @load="onLoad">     
                        <div  
                        :key="i"
                        v-for="(item,i) in chooseDatas" 
                        class="item">
                            <h4 class="item-head">
                                <span class="sequence">{{i+1}}</span>
                                <span>{{item.FLOW_NO}}</span>
                                <span @click="goDetail(item.FLOW_NO)" class="detailed">查看详细</span>
                            </h4>
                            <div class="item-content">
                                <div class="one">
                                    <span>报修人</span>
                                    <span>{{item.input333 || "无"}}</span>
                                </div>
                                <div class="two">
                                    <span>单位</span>
                                    <span>信息部门域以俄语的回复</span>
                                </div>
                                <div class="three">
                                    <span>电话</span>
                                    <span>{{item.store_phone || "无"}}</span>
                                </div>
                                <div class="four">
                                    <span>园区</span>
                                    <span>杭州余杭区</span>
                                </div>
                            </div>
                            <div class="item-foot">
                                <div class="left">
                                    <div class="in-left">
                                        <img src="../assets/images/11.png" alt="">
                                    </div>
                                    <div class="in-right">
                                        <div class="top">处理状态</div>
                                        <div class="up">未处理</div>
                                    </div>
                                </div>
                                <div class="center">
                                    <div class="in-left">
                                        <img src="../assets/images/12.png" alt="">
                                    </div>
                                    <div class="in-right">
                                        <div class="top">提交时间</div>
                                        <div class="up">{{format(item.CREATE_DATE, 'yyyy-MM-dd')}}</div>
                                    </div>
                                </div>
                                <div class="right">
                                    <div class="in-left">
                                        <img src="../assets/images/13.png" alt="">
                                    </div>
                                    <div class="in-right">
                                        <div class="top">评价状态</div>
                                        <div class="up">未评价</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-list> 
                </van-pull-refresh>
            </div>
        </div>
    </div>
</template>
<script>
import VantFieldDate from './common/VantFieldDate.vue'
import Notify from 'vant/lib/Notify'
export default {
    data(){
        return {
            formData: {
                beginData: '',
                endData: ''
            },
            date: "date",
            id: 1,
            chooseDatas: [],
            newChooseDatas: [],
            requestData: {
                "modelKey": "PSS_DEMO_20191010",
                token:'' ,
                size: 10,
                page: 0,
                callTag: 1,
                columns: "input333,store_phone,select_brand,selectstore"
            },
            repairNum: '',
            loading: false,
            upLoading: false,
            isLoading: false,
            loginData: {},
            totalPage: 0,
            finished: false,
        }
    },
    components:{
        VantFieldDate
    },
    created() {
        //this.getChooseData()
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
        onLoad() {            
             setTimeout(() => {                
                if(!sessionStorage.getItem('ms_username')){
                    Notify({ type: 'danger', message: '登陆失效'});
                    this.$router.push('/login') //使用编程式导航路由进行跳转
                    sessionStorage.clear()
                }
                this.requestData.page = this.requestData.page + 1
                this.requestData.token = sessionStorage.getItem('ms_username')
                this.axios.post('api/flow/flowIndexPage',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
			        console.log(res)//用来查看接口里面的数据
                    let lg = res.data //把数据赋值给变量
			        if(lg.code && lg.code > 1000 && lg.code < 2000) {
                        this.getToken()
                        return
                    } else if(lg.code && lg.code == "0000"){
                        this.chooseDatas = this.chooseDatas.concat(lg.data.rows);
                        this.upLoading = false;//关闭上拉刷新效果
                        this.totalPage = Math.round(lg.data.total / this.requestData.size)
                        this.isLoading = false; //关闭下拉刷新效果
                        this.loading = false
                        this.requestData.page++;
                        //判断当前page是否大于总page
                        if (this.requestData.page >= this.totalPage) {
                            this.finished = true;
                            Notify('暂无数据')//账号密码错误时的提示 
                        }
                    }else {
                        Notify('登陆异常')//账号密码错误时的提示
                        this.loading = false
                        this.$router.push('/login') //使用编程式导航路由进行跳转
                        sessionStorage.clear()
                    }
                },response =>{
                   console.log(response)
                   this.loading = false
                })            
            }, 500);       
        },
        onRefresh() {           
            let self = this;            
            setTimeout(() => {                
                self.totalPage = 0;                
                self.pageNumber = 0;                
                self.getChooseData(); //加载数据           
            }, 500);        
        },
        getChooseData() {
            if(!sessionStorage.getItem('ms_username')){
                Notify({ type: 'danger', message: '登陆失效'});
                this.$router.push('/login') //使用编程式导航路由进行跳转
                sessionStorage.clear()
            }
            this.requestData.token = sessionStorage.getItem('ms_username')
            this.axios.post('api/flow/flowIndexPage',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				console.log(res)//用来查看接口里面的数据
                let lg = res.data //把数据赋值给变量
                if(lg.code && lg.code > 1000 && lg.code < 2000) {
                    this.getToken()
                    return
                } else if(lg.code && lg.code == "0000"){
                    if(lg.data.rows && lg.data.rows.length < 1){
                       Notify({ type: 'danger', message: '暂无数据'})
                    }
                    this.chooseDatas = lg.data.rows
                    this.totalPage = Math.round(lg.data.total / this.chooseDatas.size)
                    this.isLoading = false; //关闭下拉刷新效果
                    this.loading = false
                }else {
                    Notify({ type: 'danger', message: '登陆异常'});
                    this.$router.push('/login') //使用编程式导航路由进行跳转
                    sessionStorage.clear()
                }
            },response =>{
               console.log(response)
            })
        },
        search() {
            // if(!sessionStorage.getItem('ms_username')){
            //     Notify({ type: 'danger', message: '登陆失效'});
            //     this.$router.push('/login') //使用编程式导航路由进行跳转
            //     sessionStorage.clear()
            // }
            // this.requestData.token = sessionStorage.getItem('ms_username')
            // this.axios.post('api/flow/flowIndexPage',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
			// 	console.log(res)//用来查看接口里面的数据
            //     let lg = res.data //把数据赋值给变量
            //     if(lg.code && lg.code > 1000 && lg.code < 2000) {
            //         this.getToken()
            //         return
            //     } else if(lg.code && lg.code == "0000"){
            //         if(lg.data.rows && lg.data.rows.length < 1){
            //            Notify({ type: 'danger', message: '暂无数据'})
            //         }
            //         this.chooseDatas = lg.data.rows
            //         this.totalPage = Math.round(lg.data.total / this.chooseDatas.size)
            //         this.isLoading = false; //关闭下拉刷新效果
            //         this.loading = false
            //     }else {
            //         Notify({ type: 'danger', message: '登陆异常'});
            //         this.$router.push('/login') //使用编程式导航路由进行跳转
            //         sessionStorage.clear()
            //     }
            // },response =>{
            //    console.log(response)
            // })

            this.uploading = true
            this.newChooseDatas= []
            console.log(this.formData,this.repairNum)
            this.chooseDatas.forEach((item,index) => {
                if(this.formData.beginData && this.formData.endData && this.repairNum) {
                    if(item.CREATE_DATE >= this.formData.beginData &&  item.CREATE_DATE <= this.formData.endData) {
                         if(item.FLOW_NO == this.repairNum) {
                            this.chooseDatas = []
                            this.chooseDatas.push(item)
                            return
                        }
                    }
                }else if(this.formData.beginData && this.formData.endData && !this.repairNum){
                    if(item.CREATE_DATE >= this.formData.beginData &&  item.CREATE_DATE <= this.formData.endData){
                        this.chooseDatas = []
                        this.newChooseDatas.push(item)
                    }
                }else if(!this.formData.beginData && !this.formData.endData && this.repairNum){
                    if(item.FLOW_NO == this.repairNum) {
                        this.chooseDatas = []
                        this.chooseDatas.push(item)
                        return
                    }
                }else {
                    Notify('未找到匹配的工单')
                }
            });
            if(this.newChooseDatas.length > 0){
                this.chooseDatas =  this.newChooseDatas
            }
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
            this.axios.post('api/token',this.loginData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				let lg = res.data 
				if(lg.code == "0000"){
                    sessionStorage.removeItem('ms_username')
                    sessionStorage.setItem('ms_username',lg.data.token)
                    sessionStorage.setItem('roleId',this.roleId)
                    this.getChooseData()
				}else {
                    Notify({ type: 'danger', message: '登陆失败'});
                    this.$router.push('/login') 
                    sessionStorage.clear()
				}
                },response =>{
                    console.log(response)
            })
        }
    },
    //  endTimeChange(e) {
    //     let endTimeArr = e.getValues();//["2019", "03", "22", "17", "28"]
    //     this.userListForm.end_time = `${endTimeArr[0]}-${endTimeArr[1]}-${endTimeArr[2]}  ${endTimeArr[3]}:${endTimeArr[4]}:00`
    //   }
}
</script>>
<style lang="less" scoped>
    .choose {
        padding-top: 7vh;
        background: #eee;
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
            .search {
                .work-number {
                    margin-bottom: .266667rem /* 20/75 */;
                    span {
                        display: inline-block;
                        width: 18%;
                    }
                    input{
                        width: 79%;
                        padding-left: 3%;
                        height: .666667rem /* 50/75 */;
                        border: none;
                        border-radius: .4rem /* 30/75 */;
                        background: #ddd;
                    }
                }
                .work-time {
                    line-height: .666667rem /* 50/75 */;
                    display: flex;
                      span {
                        display: inline-block;
                        width: 18%;
                    }
                    .time-input {
                        display: flex;
                        width: 82%;
                        
                       .vant-field-date {
                           width: 45%;
                       }
                        .center {
                            width: 10%;
                            text-align: center;
                        }
                    }
                  
                }
            }
            .submit {
                margin-top: .333333rem /* 25/75 */;
                margin-bottom: .333333rem /* 25/75 */;
                width: 100%;
                height: .8rem /* 60/75 */;
                line-height: .8rem /* 60/75 */;
                font-size: .32rem /* 24/75 */;
                border-radius: .066667rem /* 5/75 */;
            }
        }
        .warranty {
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
                    border-bottom: 1PX solid #ccc;
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
                         border-right: 1PX solid #ccc;
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
            .van-pull-refresh /deep/ .van-pull-refresh__head {
                top: -40px;
            }
        }
    }
</style>