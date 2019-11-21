<template>
    <div class="details">
        <div class="header">
            <van-icon @click="backTo" class="back" name="arrow-left" />
            报修详情
            <van-icon class="more" name="ellipsis" />
        </div>
        <div class="content">
            <div class="title">
                <div class="order-num">单号为32432423423423处理详情</div>
                <div>报修人： t5544 &nbsp&nbsp  报修时间：2019-3-4</div>
                <div>98998839849389493 </div>
            </div>
            <van-steps
            direction="vertical"
            :steps="steps"
            :active="active"
            active-icon="success"
            />
        </div>
    </div>
</template>
<script>
//import vanSteps from 'vant/lib/steps'
export default {
    data(){
        return{
            active: 1,
             steps: [
            {
                text: '步骤一',
                desc: '描述信息'
            },
            {
                text: '步骤二',
                desc: '描述信息'
            },
            {
                text: '步骤三',
                desc: '描述信息'
            },
            {
                text: '步骤四',
                desc: '描述信息'
            }
            ],
        }
    },
    components: {
      // vanSteps 
    },
    methods: {
        backTo() {
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="less" scoped>
    .details {
        padding-top: .933333rem /* 70/75 */;
        .header{
            position: fixed;
            top: 0;
            width: 100%;
            height: .933333rem /* 70/75 */;
            line-height: .933333rem /* 70/75 */;
            text-align: center;
            font-size: .4rem /* 30/75 */;
            background: #f99;
            z-index: 999;
            .back {
                position: absolute;
                left: 2%;
                line-height: .933333rem /* 70/75 */;
            }
            .more {
                position: absolute;
                line-height: .933333rem /* 70/75 */;
                right: 2%;
                transform: rotate(90deg)
            }
        }
        .content {
            margin-top: .333333rem /* 25/75 */; 
            .title {
                background: #fff;
                padding: .266667rem /* 20/75 */;
                color: #999;
                .order-num {
                    font-size: .346667rem /* 26/75 */;
                    color: #000 !important;
                }
            }
        }
    }
</style>