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
                v-for="(item,index) in datas.formDatas"
                :key="item.name"
                v-model="item.val"
                :name="item.name"
                :label="item.label"
                :type="item.type"
                placeholder="请输入"
                autosize
                />
            </van-cell-group>
           <van-uploader 
           :after-read="afterRead"
           v-model="fileList" 
           :before-delete="deleteImg"
         />
        
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
            datas: {
                "formDatas": [
                    {
                    "name":"input333",
                    "val":"",
                    "text": "",
                    label: "报修人",
                    type: "text"
                    },
                    {
                    "name":"store_phone",
                    "val":"",
                    "text": "",
                    label: "电话号码",
                    type: "text"
                    },
                    {
                    "name":"select_brand",
                    "val":"",
                    "text": "",
                    label: "所属品牌",
                    type: "text"
                    },
                    {
                    "name":"selectstore",
                    "val":"",
                    "text": "",
                    label: "保修店铺",
                    type: "text"
                    },
                    {
                    "name":"guzhangmiaoshu",
                    "val":"",
                    "text": "",
                    label: "故障描述",
                    type: "textarea"
                    }
                ],
                "modelKey": "PSS_DEMO_20191010",
                "flowNo": "",
                "optTag": "app_start",
                "token": "",
                fileIds: []
            },
            loading: false,
            flowNo: "",
            requestData: {
                modelKey: "PSS_DEMO_20191010",
                token: ""
            },
            fileList: []
        }
    },
    components: {
        //upLoader,
        ImageUpload,
        Uploader 
    },
    created() {
        this.getOrderNum()
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
            this.datas.token = sessionStorage.getItem('ms_username')
            for(var k in this.datas.formDatas){
                debugger
                if(!this.datas.formDatas[k].val){
                    Notify('请填写全部数据')//账号密码错误时的提示
                    return
                }
                if(!this.datas.formDatas[k].text) {
                    this.datas.formDatas[k].text = this.datas.formDatas[k].val
                }
            }

            this.loading = true
            console.log(this.datas)
            this.axios.post('api/flow/wx/saveApply',JSON.stringify(this.datas),{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				console.log(res)//用来查看接口里面的数据
				let lg = res.data //把数据赋值给变量
				if(lg.code == "0000"){
                   this.requestData = {}
                   this.loading = false
                   Notify({ type: 'success', message: '提交成功'});
                   this.$router.push('/') 
				}else if(lg.code > 1000 && lg.code < 2000) {
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
            debugger
           // this.fileList.forEach((item,index) => {
                var formdata = new FormData()
                formdata.append("token", sessionStorage.getItem('ms_username'))
                formdata.append("upfile",files.content);
                formdata.append("fileSize",files.file.size);
                formdata.append("filetype",files.file.type);
                console.log(formdata)
                this.axios({
                    url:'api/file/uploadFilesBase64',
			        method: 'post',
			        data: formdata,
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}	
                    }).then( res => {
					console.log(res)//用来查看接口里面的数据
					let lg = res.data //把数据赋值给变量
					if(lg.code == "0000"){
                       this.datas.fileIds.push(lg.data.id)
					}else if(lg.code > 1000 && lg.code <= 2000) {
                        debugger
                        this.getToken()
					} else {
                       Notify({ type: 'danger', message: '上传失败'});
                       this.loading = false
                    }
                },response =>{
                    console.log(response)
                })
           // });
        },
        deleteImg(files,detail) {
            this.datas.fileIds.splice(detail.index,1)
            return true;
        },
        getOrderNum() {
            if(!sessionStorage.getItem('ms_username')){
                Notify({ type: 'danger', message: '登陆失效'});
                this.$router.push('/login') //使用编程式导航路由进行跳转
                sessionStorage.clear()
            }
            this.requestData.token = sessionStorage.getItem('ms_username')
            this.axios.post('api/flow/obtainFlowNo',this.requestData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				console.log(res)//用来查看接口里面的数据
                let lg = res.data //把数据赋值给变量
                this.flowNo = lg.flowNo
                this.datas.flowNo = lg.flowNo
           },response =>{
               console.log(response)
           })
        },
        getToken() {
            this.loginData = sessionStorage.getItem('loginData')
            this.axios.post('api/token',this.loginData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
				let lg = res.data //把数据赋值给变量
				if(lg.code == "0000"){
                    //sessionStorage.removeItem('ms_username')//设置拦截，可以用cookie等，在控制台中的Application中查看
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
                    margin-right: 2%;
                    margin-bottom: 2%;
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