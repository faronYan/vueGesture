// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store/'


/*引入移动端手势库*/
import directives from './directives/touch'
directives(Vue);
import VueTouch from 'vue-touch'

Vue.use(VueTouch, {name: 'v-touch'})

VueTouch.config.swipe = {
  threshold: 100 //手指左右滑动距离
}

Vue.config.productionTip = false;
// simple history management
const history = window.sessionStorage;
let historyCount = history.getItem('count') * 1;
console.log("外面历史",history);
router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path);
  const fromIndex = history.getItem(from.path);
  console.log(parseInt(toIndex, 10));
  console.log(parseInt(fromIndex, 10));
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('UPDATE_DIRECTION', {direction: 'forward'})
    } else {
      store.commit('UPDATE_DIRECTION', {direction: 'reverse'})
    }
  } else {
    ++historyCount;
    history.setItem('count', historyCount);
    to.path !== '/' && history.setItem(to.path, historyCount);
    store.commit('UPDATE_DIRECTION', {direction: 'forward'});
  }
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1];
    window.location.href = `http${url}`;
  } else {
    next()
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
