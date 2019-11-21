<template>
    <div class="order">
        <div class="header">
             <van-icon @click="backTo" class="back" name="arrow-left" />
             工单
        </div>
        <div class="content">
            <van-tabs 
            class="details"
            @click="changeTab"
            :active="active" 
            :border="false"
            :animated="true" >
                <van-tab 
                title="详情" 
                name= "1"
                v-loading="loading">
                    <div class="stroes">
                        <h4>门店信息</h4>
                        <div>
                            <span>品牌：</span>
                            <span>{{detailsDatas.select_brand}}</span>
                        </div>
                        <div>
                            <span>门店名：</span>
                            <span>{{detailsDatas.selectstore}}</span>
                        </div>
                        <div>
                            <span>门店位置</span>
                            <span>{{detailsDatas.store_address}}</span>
                        </div>
                        <div>
                            <span>联系人：</span>
                            <span>{{detailsDatas.input333}}</span>
                        </div>
                        <div>
                            <span>联系方式：</span>
                            <span>{{detailsDatas.store_phone}}</span>
                        </div>
                    </div>
                    <h4 class="title">报修信息</h4>
                    <div class="repair-info">
                        <div class="one">
                            <span class="label">故障现象:</span>
                            <span>吧台主灯-不亮</span>
                        </div>
                        <div class="time">
                            <span class="label">应到时间</span>
                             <span class="begin"></span>
                              <div style="width: 10%; text-align: center;" class="center">─</div>
                              <span class="end"></span>
                        </div>
                        <div class="three">
                            <span class="label">计费方式:</span>
                            统一新增 看擦汗等</div>
                        <div class="four">
                            <span class="label">报修备注:</span>
                            有四个灯管坏了</div>
                    </div>
                    <!-- <div class="uploader">
                        <el-upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div> -->
                    <van-uploader v-model="fileList" multiple />
                    <div class="footer" v-if="roleId == '4'">
                        <van-button @click="arrive" type="primary">到店确认</van-button>
                        <div class="center"></div>
                        <van-button @click="leave" type="info">离店确认</van-button>
                    </div>
                    <div class="footer" v-if="roleId == '1' || roleId == '2' || roleId == '3'">
                        <van-button type="primary">确认完成</van-button>
                        <div class="center"></div>
                        <van-button type="info">退出</van-button>
                    </div>
                </van-tab>
                <van-tab 
                name="2"
                class="tracking" 
                title="跟踪">
                    <van-collapse v-model="activeName" accordion>
                        <van-collapse-item v-if="trackingDatas" :title="'单号'+trackingDatas.orderDealLogs[0].flowNo+'处理详情'" name="1">
                            <div class="head">
                                <span>报修人：</span>
                                <span>{{headDatas.input333}}</span>
                                <span>报修时间：</span>
                                <span>{{headDatas.select_brand}}</span>
                                <div>
                                    <span>故障描述：</span>
                                    <span>{{headDatas.selectstore}}</span>
                                </div>
                            </div>
                             <div class="step">
                                <van-steps  direction="vertical" :active="active">
                                  <van-step v-for="(item,i) in trackingDatas.orderDealLogs" :key="item.id">
                                      <h4>{{item.createUser}}</h4>
                                      <div>
                                        <span>记录人:</span>
                                        <span>{{item.createUser}}</span>
                                      </div>
                                      <div>
                                        <span>记录时间:</span>
                                        <span>{{new Date(item.createDate)}}</span>
                                      </div>
                                      <div>
                                          <span>详情：</span>
                                          <span>{{item.operationContent}}</span>
                                      </div>
                                  </van-step>
                                </van-steps>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                    <van-collapse v-model="activeName" accordion>
                        <van-collapse-item 
                         v-if="trackingDatas" 
                         v-for="(item,i) in trackingDatas.subApplyVos"
                         :key="item.flowNo"
                         :title="'单号'+item.flowNo+'处理详情'" 
                         :name="i + 1">
                            <div class="head">
                                <span>报修人：</span>
                                <span>{{headDatas.input333}}</span>
                                <span>报修时间：</span>
                                <span>{{headDatas.select_brand}}</span>
                                <div>
                                    <span>故障描述：</span>
                                    <span>{{headDatas.selectstore}}</span>
                                </div>
                            </div>
                             <div class="step">
                                <van-steps  direction="vertical" :active="active">
                                  <van-step v-for="(item2,i) in item.orderDealLogs" :key="item2.id">
                                      <h4>{{item.createUser}}</h4>
                                      <div>
                                        <span>记录人:</span>
                                        <span>{{item.createUser}}</span>
                                      </div>
                                      <div>
                                        <span>记录时间:</span>
                                        <span>{{new Date(item.createDate)}}</span>
                                      </div>
                                      <div>
                                          <span>详情：</span>
                                          <span>{{item.operationContent}}</span>
                                      </div>
                                  </van-step>
                                </van-steps>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </van-tab>
                <van-tab title="备注">内容 3</van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
import VantFieldDate from './common/VantFieldDate.vue'
import Notify from 'vant/lib/Notify'
export default {
    data(){
        return{
            active: 0,
            activeName: "1",
            requestData: {
                "flowNo": "",
                "modelKey": "PSS_DEMO_20191010", 
                token: ""
            },
            detailsDatas: {},
            fileList: [],
            loading: true,
            trackingDatas:{},
            headDatas: {},
            roleId: ''
        }
    },
     components:{
        VantFieldDate
    },
    created() {
        this.getDetailsDatas()
        this.getTrackingDatas()
    },
    methods: {
        backTo() {
            this.$router.go(-1);
        },
         changeTab(name){
            if(name == 2) {
            }
        },
        getDetailsDatas() {
            if(!sessionStorage.getItem('ms_username')){
                Notify({ type: 'danger', message: '登陆失效'});
                this.$router.push('/login') //使用编程式导航路由进行跳转
                sessionStorage.clear()
            }
            //判断角色id
            this.roleId = sessionStorage.getItem('roleId')
            this.requestData.flowNo = this.$route.query.orderNum
            this.requestData.token = sessionStorage.getItem('ms_username')
            this.axios.post('http://192.168.154.106:8088/api/flow/echoData',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				console.log(res)//用来查看接口里面的数据
				let lg = res.data //把数据赋值给变量
				if(lg.code && lg.code > 1000 && lg.code < 2000){
                    Notify({ type: 'danger', message: '登陆信息失效'});
                    this.$router.push('/login') //使用编程式导航路由进行跳转
                    sessionStorage.clear()
				}else if(lg.code && lg.code == "0000") {
                    if(lg.data.data && lg.data.data.length < 1){
                       Notify({ type: 'primary', message: '暂无数据'})
                    }
                    this.dealDetailsDatas(lg.data.data,this.detailsDatas)
                    //this.detailsDatas = lg.rows[0]
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
        dealDetailsDatas(rs,data) {
            rs.forEach((item,index) => {
                switch(item.dataKey){
                    case 'select_brand':
                        data.select_brand = item.dataName
                        break
                    case 'selectstore':
                        data.selectstore = item.dataName
                        break
                    case 'store_address':
                        data.store_address = item.dataName
                        break
                    case 'input333':
                        data.input333 = item.dataName
                        break
                    case 'store_phone':
                        data.store_phone = item.dataName
                        break
                    default:
                }
            });
        },
        getTrackingDatas() {
            if(!sessionStorage.getItem('ms_username')){
                Notify({ type: 'danger', message: '登陆失效'});
                this.$router.push('/login') //使用编程式导航路由进行跳转
                sessionStorage.clear()
            }
            this.requestData.flowNo = this.$route.query.orderNum
            this.requestData.token = sessionStorage.getItem('ms_username')
            this.axios.post('http://192.168.154.106:8088/api/flow/flowLog',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				console.log(res)//用来查看接口里面的数据
				let lg = res.data //把数据赋值给变量
				if(lg.code && lg.code > 1000 && lg.code < 2000){
                    //this.getToken()
                   Notify({ type: 'danger', message: '登陆信息失效'});
                   this.$router.push('/login') //使用编程式导航路由进行跳转
                   sessionStorage.clear()
				}else if(lg.code && lg.code == "0000") {
                    if(lg.data.data && lg.data.data.length < 1){
                       Notify({ type: 'primary', message: '暂无数据'})
                    }
                    this.trackingDatas = lg.data
                    this.headTrackingDatas(lg.data.data,this.headDatas)
                    console.log(this.trackingDatas)
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
        headTrackingDatas(rs,data) {
              rs.forEach((item,index) => {
                switch(item.dataKey){
                    case 'baoxiushijian':
                        data.select_brand = item.dataName
                        break
                    case 'guzhangmiaoshu':
                        data.selectstore = item.dataName
                        break
                    case 'input333':
                        data.input333 = item.dataName
                        break
                    default:
                }
            });
        },
        arrive() {
            this.axios.post('http://192.168.154.106:8088/api/flow/arriveTime',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
						console.log(res)//用来查看接口里面的数据
						let lg = res.data //把数据赋值给变量
						if(lg.data && lg.data.length != 0){
                            this.loading = false
						}else if(lg.code >= 1000 && lg.code < 2000) {
                           sessionStorage.removeItem("ms_username")
						}else {
                           this.$router.push("/login")
                           sessionStorage.removeItem("ms_username")
                           Notify('登陆异常')
                        }
           },response =>{
               console.log(response)
           })
        },
        getToken() {
            this.axios.post('http://192.168.154.106:8088/api/token',this.loginData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				let lg = res.data //把数据赋值给变量
				if(lg.code == "0000"){
                    sessionStorage.removeItem('ms_username')//设置拦截，可以用cookie等，在控制台中的Application中查看
                    sessionStorage.setItem('ms_username',lg.data.token)//设置拦截，可以用cookie等，在控制台中的Application中查看
                    sessionStorage.setItem('roleId',this.roleId)
                    this.getChooseData()
				}else {
				    Notify('暂无数据')//账号密码错误时的提示
				}
                },response =>{
                    console.log(response)
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .order {
        padding-top: 7vh;
        .header{
            position: fixed;
            top: 0;
            width: 100%;
            height: 7vh;
            line-height: 7vh;
            font-size: .4rem /* 30/75 */;
            text-align: center;
            color: #fff;
            background: #f99;
            z-index: 999;
            .back {
                position: absolute;
                left: 2%;
                line-height: 7vh;
            }
        }
        .content {
            min-height: 93vh;
            background: #fff;
            .van-tabs /deep/ .van-tabs__wrap,
            .van-tabs /deep/ .van-tabs__wrap .van-tab .van-ellipsis {
                height: 5vh;
                line-height: 5vh;
            }
            .van-tabs /deep/ .van-tabs__content,
            .van-tabs /deep/ .van-tabs__track {
                min-height: 88vh;
            }
            .van-tabs /deep/ .van-tabs__wrap .van-tab{
                font-size: .32rem /* 24/75 */ !important;
            }
            .van-tabs /deep/ .van-tabs__line {
                width: 0px;
                height: 0px;
            }
            .van-tabs /deep/  .van-tab__pane  .van-collapse-item .van-cell{
                    font-size: .32rem /* 24/75 */ !important;
                    padding: .266667rem /* 20/75 */ .4rem /* 30/75 */;
                    line-height: .64rem /* 48/75 */;
            }
            .van-tabs /deep/  .van-tab__pane  .van-collapse-item .van-cell .van-icon {
                font-size: .48rem /* 36/75 */;
                line-height: .64rem /* 48/75 */;
            }
            .van-tabs /deep/  .van-tab__pane  .van-collapse-item .van-collapse-item__content {
                 font-size: .266667rem /* 20/75 */ !important;
                 padding: 0;
            }
            .details {
                .stroes {
                    height: 5.333333rem /* 400/75 */;
                    background: skyblue;
                    color: #fff;
                    h4 {
                        border-bottom: 1PX solid #eee;
                        padding: 5px 20px;
                        font-size: 14px;
                    }
                    &>div {
                        padding: 5px 20px;
                        span:nth-child(1) {
                            min-width: 20%;
                            display: inline-block;
                        }
                    }
                }
                .title {
                    height: .8rem /* 60/75 */;
                    line-height: .8rem /* 60/75 */;
                    padding-left: .533333rem /* 40/75 */;
                    border-bottom: 1px solid #ccc;
                }
                .repair-info {
                    padding: .266667rem /* 20/75 */ .533333rem /* 40/75 */;
                    // .time {
                    //     display: flex;
                    //     .in-time {
                    //         width: 80%;
                    //         display: flex;
                    //         .vant-field-date {
                    //             width: 45%;
                    //         }
                    //     }

                    // }
                    .one,.time,.three,.four{
                        .label {
                            display: inline-block;
                            color: #999;
                            width: 20%;
                        }
                    }
                   .time {
                       display: flex;
                        .begin,.end {
                        width: 35%;
                        border: 1px solid #ccc;
                        border-radius: .666667rem /* 50/75 */;
                        background: #ccc;
                    }
                   }
                }
                .repair-info > div {
                    padding: .133333rem /* 10/75 */ 0;
                }
                .footer {
                    position: absolute;
                    display: flex;
                    bottom: .266667rem /* 20/75 */;
                    left: 0;
                    width: 100%;
                    height: .933333rem /* 70/75 */;
                    padding: 0 2%;
                    .van-button {
                        width: 47%;
                        height: 100%;
                        line-height: .56rem /* 42/75 */;
                        border-radius: .133333rem /* 10/75 */;
                        font-size: .32rem /* 24/75 */;
                    }
                    .center {
                        width: 2%;
                    }
                }
            }
            .tracking {
                .head {
                    padding: .266667rem /* 20/75 */ .4rem /* 30/75 */;
                }
                // .step .van-steps {
                //     padding: 0 .666667rem /* 50/75 */;
                //     //background: #eee;
                // }
                // .van-collapse .step .van-step {
                //     font-size: .266667rem /* 20/75 */;
                //     padding: .266667rem ;
                //     line-height: .4rem /* 30/75 */;
                // }
                // .step .van-step /deep/ .van-step__circle-container {
                //     top: .453333rem /* 34/75 */;
                //     left: -.186667rem /* 14/75 */;
                //     font-size: .373333rem /* 28/75 */;
                // }
                // .step .van-step /deep/ .van-step__circle-container .van-step__circle {
                //     width: .133333rem /* 10/75 */;
                //     height: .133333rem /* 10/75 */;
                // }
                // .step .van-step /deep/  .van-step__line {
                //     left: -.2rem /* 15/75 */;
                // }
            }
        }
    }
</style>