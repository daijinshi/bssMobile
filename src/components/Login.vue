<template>
    <div class="login">
        <van-cell-group>
            <van-field
              v-model="loginData.username"
              clearable
              label="用户名:"
              placeholder="请输入用户名"
              @click-right-icon="$toast('question')"
            />

            <van-field
              v-model="loginData.password"
              type="password"
              label="密码:"
              placeholder="请输入密码"
            />
        </van-cell-group>
        <van-button  @click="landing" type="info">登陆</van-button>
    </div>
</template>
<script>
import Notify from 'vant/lib/Notify'
export default {
  data(){
    return {
        loginData: {
          caller:"itsm",
          username: "",
          password: "",
        },
        roleId: ''
    }
  },
  methods: {
    landing() {
      if(!this.loginData.username) {
        Notify({ type: 'danger', message: '请输入用户名'});
        return
      }else if(!this.loginData.password){
        Notify('请输入密码');
        return
      }
        this.axios.post('api/token',this.loginData,{headers:{"Content-Type": 'application/json;charset=UTF-8'}}).then( res => {
						console.log(res)//用来查看接口里面的数据
						let lg = res.data //把数据赋值给变量
						if(lg.code == "0000"){
              sessionStorage.setItem('ms_username',lg.data.token)//设置拦截，可以用cookie等，在控制台中的Application中查看
              sessionStorage.setItem('roleId',lg.data.roleId)
              sessionStorage.setItem('loginData', JSON.stringify(this.loginData))
              this.$router.push('/') //使用编程式导航路由进行跳转
							Notify({ type: 'success', message: '登陆成功'});//登录成功的提示
						}else {
               Notify('登陆失败')//账号密码错误时的提示
               sessionStorage.clear()
						}
            },response =>{
               console.log(response)
           })
           
          //   this.axios('https://www.fastmock.site/mock/25d21377dad4a7548ddf89b84d5f2165/cloud/login').then( res => {
					// 	 console.log(res.data)//用来查看接口里面的数据
					// 	 let lg = res.data //把数据赋值给变量
					// 	 console.log(lg.username,lg.password)//主要用来查看数据
					// 	 if(lg.username === this.loginData.username && lg.password==this.loginData.password){
					// 		 localStorage.setItem('ms_username',lg.username)//设置拦截，可以用cookie等，在控制台中的Application中查看
					// 		 Notify({ type: 'success', message: '登陆成功'});//登录成功的提示
					// 		 this.$router.push('/') //使用编程式导航路由进行跳转
					// 	 }else {
					// 		 this.$message.error('账号或者密码错误')//账号密码错误时的提示

					// 	 }
					//  })
    }

  }
}
</script>>
<style lang="less" scoped>
 html {
   background: skyblue;
  
 }
  .tip.van-popup {
      padding: .133333rem /* 10/75 */;
      font-size: .453333rem /* 34/75 */ !important;
    }
  .login{
    padding-top: 50%;
    .van-button {
      text-align: center;
      width: 100%;
      font-size: .533333rem /* 40/75 */;
      margin-top: .4rem /* 30/75 */;
    }
    .van-cell-group /deep/ .van-cell {
      font-size: .32rem !important /* 24/75 */;
      line-height: .586667rem /* 44/75 */;
      padding: .266667rem /* 20/75 */ .426667rem /* 32/75 */;
    }
    .van-cell-group /deep/ .van-field__label {
      width: 15%;
    }
    .van-button {
      height: .8rem /* 60/75 */;
      line-height: .8rem /* 60/75 */;
      background: #33cc99;
      border: none;
    }
    
            
  }
</style>