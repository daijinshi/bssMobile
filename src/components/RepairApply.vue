<template>
    <div class="apply">
        <div class="header">
            <van-toast id="van-toast" />
              <van-icon @click="backTo" class="back" name="arrow-left" />
            <div class="title">报修申请</div>
        </div>
        <div class="content"  v-loading="loading">
           <van-cell-group>
                <van-field
                v-model="requestData.input333"
                label="报修人:"
                type="text"
                placeholder="请输入"
                autosize
                />
                <van-field
                v-model="requestData.store_phone"
                label="电话号码:"
                type="text"
                placeholder="请输入"
                autosize
                />
                <van-field
                v-model="requestData.select_brand"
                label="所属品牌"
                type="text"
                placeholder="请输入"
                autosize
                />
                <van-field
                v-model="requestData.selectstore"
                label="保修店铺"
                type="text"
                placeholder="请输入"
                autosize
                />
            </van-cell-group>
            <div class="fault">
                <van-cell-group>
                    <van-field
                      v-model="requestData.guzhangmiaoshu"
                      rows="1"
                      autosize
                      label="故障描述"
                      type="textarea"
                      placeholder="请输入"
                    />
                </van-cell-group>
            </div>
           <!-- <div class="upload">
                <image-upload 
                ref="upload"
                :isUpload="isUpload"
                :value.sync="pics"/>
           </div> -->
           <van-uploader 
           :after-read="afterRead"
           :before-delete="beforeDel"
           v-model="requestData.fileList" 
           multiple />
        </div>
         <van-button @click="submitApply"  class="submit" type="button">提交</van-button>
    </div>
</template>
<script>
//import upLoader from "./common/upLoader";
import ImageUpload from './common/ImageUpload';
import Uploader  from 'vant/lib/uploader';
import Notify from 'vant/lib/Notify'
export default {
    data(){
        return {
            requestData: {
                input333: '',
                store_phone: '',
                select_brand: '',
                selectstore: '',
                guzhangmiaoshu: '',
                fileList: [],
                token: "",
                "modelId": "PSS_DEMO_20191010",
                "formId": "130",
                "nodeId": "node2",
                "iden": "0",
                "nowNodeId": "node1",
                "operationType": "MOVE"
            },
            loading: false
        }
    },
    components: {
        //upLoader,
        ImageUpload,
        Uploader 
    },
    methods: {
        backTo() {
            this.$router.go(-1);
        },
        submitApply() {
            //if(this.requestData)
            if(!sessionStorage.getItem('ms_username')){
                Notify({ type: 'danger', message: '登陆失效'});
                this.$router.push('/login') //使用编程式导航路由进行跳转
                sessionStorage.clear()
            }
            this.requestData.token = sessionStorage.getItem('ms_username')
            for(var k in this.requestData){
                if(!this.requestData[k] && k !== "fileList"){
                    debugger
                    Notify('请填写数据')//账号密码错误时的提示
                        return
                }
            }
            this.loading = true
            console.log(this.requestData)
            this.axios.post('http://192.168.154.106:8088/api/flow/showLayout',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
						 console.log(res)//用来查看接口里面的数据
						 let lg = res.data //把数据赋值给变量
						 if(lg.code == "0000"){
                            this.requestData = {}
                            this.loading = false
                            Notify({ type: 'success', message: '提交成功'});
                            this.$router.push('/') 
						 }else if(lg.code > 1000 && lg.code <= 2000) {
                             this.getToken()
						 } else {
                            Notify({ type: 'danger', message: '提交失败'});
                            this.loading = false
                         }
           },response =>{
               console.log(response)
           })
        },
        afterRead(files,detail){
            console.log(this.requestData.fileList)
        },
        beforeDel(files,detail) {
            this.requestData.fileList.splice(detail.index,1)
            console.log(this.requestData.fileList)
        },
        getToken() {
            this.loginData = sessionStorage.getItem('loginData')
            this.axios.post('http://192.168.154.106:8088/api/token',this.loginData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				let lg = res.data //把数据赋值给变量
				if(lg.code == "0000"){
                    sessionStorage.removeItem('ms_username')//设置拦截，可以用cookie等，在控制台中的Application中查看
                    sessionStorage.setItem('ms_username',lg.data.token)//设置拦截，可以用cookie等，在控制台中的Application中查看
                    sessionStorage.setItem('roleId',this.roleId)
                    this.submitApply()
				}else {
				    Notify({ type: 'danger', message: '登陆失败'});
                    this.$router.push('/login') 
                    sessionStorage.clear()
				}
                },response =>{
                    console.log(response)
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .apply {
        padding-top: 7vh;
        display: flex;
        flex-direction:column;
        .header {
            position: fixed;
            top: 0;
            width: 100%;
            height: 7vh;
            line-height: 7vh;
            font-size: .4rem /* 30/75 */;
            text-align: center;
            color: #fff;
            background: #33cc99;
            z-index: 999;
            .back {
                position: absolute;
                left: 2%;
                line-height: 7vh;
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
            width: 100%;
            .van-cell-group {
                margin: .333333rem /* 25/75 */ 0;
            }
            // .van-field {
            //     display: flex;
            //     height:1.333333rem /* 100/75 */;
            //     padding-left: .266667rem /* 20/75 */;
            //     box-sizing:border-box;
            //     font-size: .373333rem /* 28/75 */;
            //     border-bottom: 1px solid #ccc;
            // }
            // .van-field /deep/ .van-cell__title.van-field__label,
            //  .van-field /deep/  .van-cell__value {
            //         align-self:center;
            // }
            // .van-field /deep/ .van-cell__title.van-field__label  {
            //     min-width: 20%;
            //     color: #999;
            // }
            .fault {
               .van-cell-group {
                   margin-bottom: 0;
                   & /deep/ .van-cell {
                       min-height: 100px;
                   }
               }
            }
            .upload {
                background: #fff;
                padding: 0 0 .266667rem /* 20/75 */ .266667rem /* 20/75 */;
            }
            .van-uploader {
                width:100%;
                padding: .266667rem /* 20/75 */ 0;
                padding-left: 2%;
                box-sizing: border-box;
                background: #fff;
                & /deep/ .van-uploader__preview {
                    margin-right: 2%;
                    margin-bottom: 2%;
                    width: 18%;
                    .van-icon {
                        font-size: .4rem /* 30/75 */;
                        top: -.133333rem /* 10/75 */;
                        right: -.133333rem /* 10/75 */;
                    }
                }
                & /deep/ .van-uploader__preview-image {
                    width: 100%/* 120/75 */;
                    height: 1.6rem /* 120/75 */;
                    overflow: hidden;
                }
                 & /deep/ .van-uploader__upload {
                    width: 18% /* 120/75 */;
                    height: 1.6rem /* 120/75 */;
                    background: #eee;
                    .van-icon {
                        font-size: .666667rem /* 50/75 */;
                        
                    }
                 }
            }
        }
        .submit {
             justify-content:end;
            width: 96% !important;
            margin-left: 2%;
            background: #33cc99;
            color: #fff;
            box-sizing: border-box;
            margin-top: .333333rem /* 25/75 */;
            width: 100%;
            height: .8rem /* 60/75 */;
            line-height: .8rem /* 60/75 */;
            font-size: .32rem /* 24/75 */;
            border-radius: .066667rem /* 5/75 */;
            border: none;
        }
    }
</style>