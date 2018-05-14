<template>
  <div class="login" style="background-color:#ccc;min-height:100vh;">
    <div class="container">
      <div class="row" style="display: flex;justify-content: center;">
        <div class="col-sm-5 text">
          <div class="form-box">
            <div class="form-top">
              <div class="text-center">
                <h2 class="header">Вход</h2>
              </div>
            </div>
            <div class="form-bottom">
              <form class="registration-form" @submit.prevent="login" v-if="!needConfirm">
                <div class="form-group">
                  <label class="sr-only" for="phoneNumber">Номер телефона</label>
                  <the-mask v-model="phoneNumber" mask="7(###)###-####" type="text" class="form-control form-control-lg" id="phoneNumber" autofocus required placeholder="Номер телефона" />
                </div>
                <div class="form-group">
                  <label class="sr-only" for="password">Пароль</label>
                  <input v-model="password" type="password" name="password" placeholder="Пароль" class="form-control form-control-lg" id="password" required>
                  <!-- <span v-show="errors.has('password')">{{ errors.first('password') }}</span>  -->
                </div>
                <router-link class="pull-right" :to="{ path: '/' }">Восстановление</router-link>
                <button type="submit" class="btn btn-lg btn-primary btn-block" :disabled="phoneNumber == '' || password == '' || password.length < 6">Войти</button>
              </form>

              <form class="registration-form" @submit.prevent="sendSms" v-if="needConfirm">
                <p class="text-center">На Ваш номер телефона был отправлен код подтверждения, введите его в поле ниже</p>
                <div class="form-group">
                  <input type="text" class="form-control" name="username" v-mask="'XXXXXX'" v-model="smsCode" placeholder="Код из СМС" autofocus/>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit" :disabled="smsLoader">Отправить</button>

                <div class="text-center" v-if="smsLoader" style="margin-bottom: -20px;">
                  <br>
                  <img src="../assets/load.svg" alt="load gif" width="40">
                </div>

<!--                 <span class="timerDown" v-if="$store.state.login.isTimer && !$store.state.login.loader">Запросить код повторно через <b>&nbsp;{{ $store.state.login.downTimes }}&nbsp;</b> минут</span> -->

<!--                 <div class="form-group newSmsbtn" v-if="$store.state.login.isNewCode">
                  <button class="btn btn-success btn-block btn-lg" @click="sendNewSms" :disabled="$store.state.login.loader">Отправить СМС повторно</button>
                </div> -->
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Redirect />
  </div>
</template>

<script>
  import {
    TheMask
  } from 'vue-the-mask'
  import host from '../data/host.js'
  import Redirect from './modals/Redirect'  
  export default {
    name: 'login',
    components: {
      TheMask,
      Redirect
    },
    data() {
      return {
        phoneNumber: '',
        password: '',
        needConfirm: false,
        expirationTimeCheckId: 0,
        smsCode: '',
        smsLoader: false,
        userInfo: []
      }
    },
    methods: {
      refreshToken () {
        this.$http.post(`${host.host}/Account/Token/Refresh`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          localStorage.setItem('token', response.body.accessToken)
          localStorage.setItem('expires', response.body.expires)

          this.checkExpirationTime()

        }, response => {
          toastr.error("Ошибка сервера")
        })
      },
      checkExpirationTime () {
        let self = this
        clearTimeout(self.expirationTimeCheckId)

        self.expirationTimeCheckId = setInterval(() => {
          if ( Date.parse(localStorage.getItem('expires')) - Date.now() <= 1000 * 60 * 15 ) { //1000 * 60 * 15 106718200
            self.refreshToken()
          }
        }, 1000 * 60 * 10)
      },
      getProfileInfo () {
        this.loader = true
        this.$http.get(`${host.host}/Employee/0`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          if (response.status == 200) {
            this.userInfo = response.body
            localStorage.setItem('userType', this.userInfo.subdivisionId)
            localStorage.setItem('userId', this.userInfo.userId)
            if (this.userInfo.isChief) localStorage.setItem('IsChief', this.userInfo.isChief)
            if (localStorage.getItem('userType') == 3) return this.$router.push('/system-logs')
            if (localStorage.getItem('userType') == 5) return this.$router.push('/user-profile')
            if (localStorage.getItem('userType') == 6) return this.$router.push('/balances')
            if (localStorage.getItem('userType') == 7) return this.$router.push('/purchase')
            if (localStorage.getItem('userType') == 8) return this.$router.push('/notifications')
            if (localStorage.getItem('userType') == 9) return this.$router.push('/user-profile')
            if (localStorage.getItem('userType') == 10) return this.$router.push('/client-orders')
            if (localStorage.getItem('userType') == 12) return this.$router.push('/system-logs')
            this.$router.push('/sto')
          }
        }, response => {
          this.loader = false
          toastr.error("Ошибка сервера")
        })
      },
      sendSms () {
        this.smsLoader = true
        this.$http.post(`${host.host}/Employee/LoginConfirm`, {
          login: '7'+this.phoneNumber,
          password: this.password,
          code: this.smsCode
        }, {
          headers: {
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if(response.message == 'Wrong code!') {
            this.smsLoader = false
            return toastr.error('Неверный код!')
          }
          if(response.message == 'Code out of date!') {
            this.smsLoader = false
            return toastr.error('Срок действия кода истек!')
          }

          let data = response.body

          localStorage.setItem('token', data.token.accessToken)
          localStorage.setItem('expires', data.token.expires)

          this.checkExpirationTime()
          this.getProfileInfo()
          // this.$router.push('/system-logs')

        }, response => {
          this.smsLoader = false
          return toastr.error('Ошибка сервера')
        })
      },
      login() {
        this.$http.post(`${host.host}/Employee/Login`, {
          login: '7' + this.phoneNumber,
          password: this.password
        }, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          let data = []
          if (response.status == 200) data = response.body

          if (!this.needConfirm && data.needConfirm) {
            this.needConfirm = true
            return
          } 
          
          this.needConfirm = false

          localStorage.setItem('token', data.token.accessToken)
          localStorage.setItem('expires', data.token.expires)

          this.checkExpirationTime()
          this.getProfileInfo()

          this.setFastOrdersSocketConnection()
        }, response => {
          toastr.error(response.body.message)
        })
      },
      setFastOrdersSocketConnection() {
        const url = `wss://socket.datcar.ru/socket/clientsupp?bearer_token=${localStorage.getItem('token')}`
        const ws = new WebSocket(url)

        ws.onclose = () => {
          this.setFastOrdersSocketConnection()
        }

        ws.onmessage = (evt) => {
          console.log(JSON.parse(evt.data).data)
        }
      },
      checkToken() {
        if (localStorage.getItem('token')) {
          if (this.userInfo.isChief) localStorage.setItem('IsChief', this.userInfo.isChief)
          if (localStorage.getItem('userType') == 3) return this.$router.push('/system-logs')
          if (localStorage.getItem('userType') == 5) return this.$router.push('/user-profile')
          if (localStorage.getItem('userType') == 6) return this.$router.push('/balances')
          if (localStorage.getItem('userType') == 7) return this.$router.push('/purchase')
          if (localStorage.getItem('userType') == 8) return this.$router.push('/notifications')
          if (localStorage.getItem('userType') == 9) return this.$router.push('/user-profile')
          if (localStorage.getItem('userType') == 10) return this.$router.push('/client-orders')
          if (localStorage.getItem('userType') == 12) return this.$router.push('/system-logs')
          this.$router.push('/sto')
        }
      },
    },
    created() {
      this.checkToken()
    }
  }
</script>

<style scoped src="../assets/login.css">
  
</style>

