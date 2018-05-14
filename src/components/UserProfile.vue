<template>
  <div class="Reg">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="`Редактирование профиля - ID ${ userInfo.userId ? userInfo.userId : ''}`" icon="fa fa-fw fa-user"></Breadcrumb>

          <div class="text-center" v-if="loader">
            <img src="../assets/load.svg" alt="load gif" width="40">
          </div>

          <form class="registration-form col-lg-6" @submit.prevent="editUserInfo" v-if="!loader">
            <div class="input-group" style="margin-bottom: 8px">
              <div class="input-group-addon" style="width: 150px">Имя</div>
              <input v-model="userInfo.firstName" v-validate="{ required: true, regex: validateName }" type="text" name="firstname" placeholder="Имя" class="form-control" id="firstname">
            </div>
            <div class="input-group" style="margin-bottom: 8px">
              <div class="input-group-addon" style="width: 150px">Фамилия</div>
              <input v-model="userInfo.lastName" v-validate="{ required: true, regex: validateName }" type="text" name="lastname" placeholder="Фамилия" class="form-control" id="lastname">
            </div>
            <div class="input-group" style="margin-bottom: 8px">
              <div class="input-group-addon" style="width: 150px">Телефон</div>
              <the-mask v-model="userInfo.contactPhone" mask="7(###)###-####" type="text" class="form-control" id="phoneNumber" placeholder="Номер телефона" />
            </div>
            <div class="input-group" style="margin-bottom: 8px">
              <div class="input-group-addon" style="width: 150px">Новый пароль</div>
              <input v-model="newPassword" type="text" name="lastname" placeholder="Введите пароль" class="form-control" id="newPassword">
            </div>
            <label class="input-group custom-control custom-checkbox" style="margin-bottom: 8px">
              <span><b>Двухфакторная аутентификация </b>(Подтверждение входа в систему с помощью СМС)</span>
              <input type="checkbox" class="custom-control-input" v-model="userInfo.twoFactAuth">
              <span class="custom-control-indicator"></span>
            </label>
            <button type="submit" class="btn btn-success" :disabled="!userInfo.contactPhone || !userInfo.firstName || !userInfo.lastName || newPassword.length > 0 && newPassword.length < 6">Сохранить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../data/host.js'
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import {TheMask} from 'vue-the-mask'
export default {
  name: 'UserProfile',
  components: {
    headers,
    Breadcrumb,
    TheMask
  },
  data() {
    return {
      title: 'Редактирование профиля',
      loader: false,
      validateName: /^[а-яА-ЯёЁa-zA-Z]+[-\s\']?[а-яА-ЯёЁa-zA-Z]+?$/,
      userInfo: [],
      newPassword: '',
    }
  },
  methods: {
    checkExpirationTime () {
      let self = this
      clearTimeout(self.expirationTimeCheckId)
      self.expirationTimeCheckId = setInterval(() => {
        if ( Date.parse(localStorage.getItem('expires')) - Date.now() <= 1000 * 60 * 15 ) self.refreshToken
        console.log(Date.parse(localStorage.getItem('expires')) - Date.now())
      }, 1000 * 60 * 10)
    },
    changePassword () {
      console.log('1')
      if (this.newPassword) {
        this.$http.put(`${host.host}/Employee/Password`, {
          'accountId': this.userInfo.accountId,
          'password': this.newPassword
        }, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => { 

          localStorage.setItem('token', response.body.accessToken)
          localStorage.setItem('expires', response.body.expires)

          this.checkExpirationTime()

          this.newPassword = ''
          return toastr.success('Пароль успешно обновлен!')
        }, response => {
          toastr.error('Не удалось поменять пароль')
        })
      }
    },
    editUserInfo () {
      this.$http.put(`${host.host}/Employee`, {
        'accountId': this.userInfo.accountId,
        'subdivisionId': this.userInfo.subdivisionId,
        'contactPhone': '7' + this.userInfo.contactPhone,
        'firstName': this.userInfo.firstName,
        'lastName': this.userInfo.lastName,
        'isChief': this.userInfo.isChief,
        'twoFactAuth': this.userInfo.twoFactAuth
      }, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => { 

        this.profileLoader = false
        this.changePassword()
        toastr.success('Информация успешно обновлена!')
        
      }, response => {
        this.profileLoader = false
        toastr.error('Не удалось обновить информацию')
      })
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
        if (response.status == 200) this.userInfo = response.body
      }, response => {
        this.loader = false
        toastr.error("Ошибка сервера")
      })
    }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title,
    this.getProfileInfo()
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style>