// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import axios from 'axios'
import "lib-flexible/flexible"
import './assets/css/reset.css'


Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(Vant)
Vue.use(ElementUI);

axios.defaults.baseURL = 'http://119.3.7.52:8088/';
/* eslint-disable no-new */

// router.beforeEach((to, from, next) => {
//   document.title = `${to.meta.title} | vue-manage-system`;
//   const role = localStorage.getItem('ms_username');
//   if (!role && to.path !== '/login') {
//       next('/login');
//   } else if (to.meta.permission) {
//       // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//       //role === 'admin' ? next() : next('/403');
//   } else {
//       // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//       if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//           Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//               confirmButtonText: '确定'
//           });
//       } else {
//           next();
//       }
//   }
// });



new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})





