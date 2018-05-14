// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import { store } from './store/index'


import vueResource from 'vue-resource'
import moment from 'moment'
import VueImg from 'v-img'
import VueMask from 'v-mask'
import * as VueGoogleMaps from 'vue2-google-maps'
import vSelect from 'vue-select'
import VeeValidate from 'vee-validate'
import VueGoodTable from 'vue-good-table'
import { FormGroup } from 'bootstrap-vue/es/components';

var VueTruncate = require('vue-truncate-filter')

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB57kHMhHFwAlWaHFzvCriirjxKhG_T8bg',
    v: '3',
    language: 'ru-RU'
  }
})

Vue.filter('formatFunds', function(value) {
  return ( value ) ? value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }).slice(0, -2) : '0'
})

Vue.filter('formatPhone', function(phone) {
  return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1($2)$3-$4-$5")
})

Vue.filter('formatUserType', function(userType) {
  switch (userType) {
    case 3: return 'Администратор'
    case 4: return 'Логист'
    case 5: return 'Экспедитор'
    case 6: return 'Бухгалтер'
    case 7: return 'Снабжение'
    case 8: return 'Менеджер'
    case 9: return 'Тех. поддержка'
    case 10: return 'Клиент. поддержка'
    case 12: return 'Разработчик'
    default: return ''
  }
})

Vue.filter('formatDate', function(value) {
  if (value) {
    if (value == '2000-01-01T00:00:00') return ''

    return moment(String(value)).calendar(null ,{
      sameDay: '[Сегодня] в H:mm',
      nextDay: '[Завтра] в H:mm',
      lastDay: '[Вчера] в H:mm',
      lastWeek : 'DD.MM.YY в H:mm',
      sameElse: 'DD.MM.YY в H:mm'
    })
  }
})

Vue.filter('onlyTime', function(value) {
  if (value) {

    return moment(String(value)).calendar(null ,{
      sameDay: 'в H:mm',
      nextDay: 'в H:mm',
      lastDay: 'в H:mm',
      lastWeek : 'в H:mm',
      sameElse: 'в H:mm'
    })
  }
})

Vue.filter('onDate', function(value) {
  if (value) {

    return moment(String(value)).calendar(null ,{
      sameDay: 'DD.MM.YY в H:mm',
      nextDay: 'DD.MM.YY в H:mm',
      lastDay: 'DD.MM.YY в H:mm',
      lastWeek : 'DD.MM.YY в H:mm',
      sameElse: 'DD.MM.YY в H:mm'
    })
  }
})
Vue.filter('friendlyOnlyDate', function (value) {
  if (value) {
    return new Date(value).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
})
Vue.filter('friendlyDate', function (value) {
  if (value) {
    return new Date(value).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }
})
Vue.filter('friendlyTime', function (value) {
  if (value) {
    return new Date(value).toLocaleString('ru', {
      hour: 'numeric',
      minute: 'numeric'
    });
  }
})


moment.updateLocale('en', {
  weekdays : [
      "Воскресенье", 
      "Понедельник", 
      "Вторник", 
      "Среда", 
      "Четверг", 
      "Пятница", 
      "Суббота"
  ]
})

const dictionary = {
  ru: {
    messages: {
      _default: () => 'Введите правильный адрес!',
      regex: () => 'Недопустимый символ!'
    }
  }
}

const config = {
  errorBagName: 'errors',
  fieldsBagName: 'fields', 
  delay: 0, 
  locale: 'ru', 
  dictionary: dictionary, 
  strict: true, 
  classes: true, 
  classNames: {
    touched: 'touched',
    untouched: 'untouched',
    valid: 'is-valid',
    invalid: 'is-invalid',
    pristine: 'pristine',
    dirty: 'dirty'
  },
  events: 'input|blur',
  inject: true,
  validity: false,
  aria: true
}

Vue.config.productionTip = false

Vue.use(vueResource)
Vue.use(Vuex)
Vue.use(VueImg)
Vue.use(VueMask)
Vue.use(VueGoogleMaps)
Vue.component('v-select', vSelect)
Vue.use(VeeValidate, config)
Vue.use(VueGoodTable)
Vue.use(FormGroup)
Vue.use(VueTruncate)


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

Vue.http.interceptors.push((request, next)  => {
  next((response) => {
    // response.status == 401 || !response.status 
    if ( response.status == 401 ) {
      if (!window.authError) {
        alert('Время сессии истекло! Вы будете перенаправлены на страницу авторизации')
        window.authError = true
        localStorage.clear()
        window.location = '/'
        window.authError = false
      }
    }
  });
});