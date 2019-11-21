<template>
    <div class="wrapper">
        <div class="header">
            <div class="logo">
                <img src="../../assets/images/1.png" alt="">
            </div>
            <div class="title">Service System</div>
        </div>
        <div class="content">
            <div class="banner"></div>
            <div class="gongge">
                <div class="left repair-apply" @click="repairApply"><img src="../../assets/images/2.png" alt=""></div>
                <div class="right">
                    <div @click="related" class="one"><img src="../../assets/images/3.png" alt=""></div>
                    <div class="br"></div>
                    <div @click="jumpChoose" class="two"><img src="../../assets/images/4.png" alt=""></div>
                    <div class="br"></div>
                    <div class="three"><img src="../../assets/images/5.png" alt=""></div>
                </div>
            </div>
        </div>
        <div class="footer">
            <van-tabbar
                v-model="active"
                active-color="#07c160"
                inactive-color="#000"
                >
                <van-tabbar-item icon="wap-home-o">
                       <router-link :to="{name: 'home'}"> 首页 </router-link>
                </van-tabbar-item>
               
                <van-tabbar-item icon="setting-o">
                    <router-link :to="{name: 'repairApply'}"> 报修 </router-link>
                    </van-tabbar-item>
                <van-tabbar-item icon="passed">确认</van-tabbar-item>
                <van-tabbar-item icon="user-o">我的</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>
<script>
export default {
     data() {
        return {
            active: 0,
            params: {
            "modelKey": "PSS_DEMO_20191010",
            "token": "1"
        }
    }
  },
    methods: {
      jumpChoose() {
          this.$router.push({path:'/choose'})
      },
      repairApply() {
           this.$router.push({path:'/repairApply'})
      },
      related(){
        // this.axios.post("http://192.168.100.108:8088/api/flow/flowIndexPage",params).then(res => {

        // })
        this.$router.push({path:'/related'})
      } 
    }
}
</script>>
<style lang="less" scoped>
    .wrapper {
        background: #eee;
        padding-top: 7vh;
    }
    .header {
        position: fixed;
        width: 100%;
        top: 0;
        height: 7vh;
        background: #33cc99;
        z-index: 999;
        .logo {
            position: absolute;
            width: 1.333333rem /* 100/75 */;
            left: 2%;
            transform: translateY(-50%);
            top: 50%;
        }
        .title {
            position: absolute;
            transform: translate(-50%,-50%);
            left: 50%;
            top: 50%;
            text-align: center;
            font-size: .4rem /* 30/75 */ /* 30/75 */;
            font-weight: 700;
            color: #fff;
        }
    }
    .content {
        padding: 0 2%;
        height: 90%;
        .banner {
            width: 100%;
            margin-top: .266667rem /* 20/75 */;
            height: 4rem /* 300/75 */;
            border-radius: .133333rem /* 10/75 */;
            background: #dffdff;
        }
        .gongge {
            height: 8rem /* 600/75 */;
            display: flex;
            padding-top: 4%;
            .left {
                height: 100%;
                width: 48%;
                margin-right: 2%;
                border-radius: .133333rem /* 10/75 */;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .right {
                height: 100%;
                width: 48%;
                margin-left: 2%;
                .one,.two,.three {
                    height: 31%;
                    border-radius: .133333rem /* 10/75 */;
                    img {
                        height: 100%;
                    }
                }
                .one {
                    background: red;
                }
                .two {
                    background: blue;
                }
                .three {
                    background: green;
                }
                .br {
                    height: 3.5%;
                }
            }
        }
    }
    .footer .van-tabbar{
        height: 7vh;
        border: none;
        background: #eee;
        .van-tabbar-item {
            font-size:  .266667rem /* 20/75 */;
        }
        .van-tabbar-item /deep/ .van-tabbar-item__icon {
            font-size: .426667rem /* 32/75 */;
        }
    }
     
</style>