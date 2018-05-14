<template>
  <div class="Reg">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="breadcrumbTitle" icon="fa fa-fw fa-user-plus"></Breadcrumb>
          <form class="registration-form col-lg-4 col-md-4 col-sm-6 col-xs-12" @submit.prevent="register" v-if="userType != 10 || step == 1">
            <div class="form-group" v-if="userType == 3">
              <select class="form-control" v-model="userAdminPanelType">
                <option disabled="disabled" selected value='0'>Выберите тип пользователя</option> 
                <option v-for="userType in userTypes" :value="userType.value">{{ userType.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="sr-only" for="phoneNumber">Номер телефона</label>
              <the-mask v-model="phoneNumber" v-validate="{ rules: { regex: validateNumber} }" mask="7(###)###-####" name="phone" class="form-control" id="phoneNumber" required placeholder="Номер телефона"/>
            </div>
            <div class="form-group">
              <label class="sr-only" for="password">Пароль</label>
              <input v-model="password" v-validate="" type="text" name="password" placeholder="Пароль" class="form-control" id="password" required>
            </div>
            <div class="form-group">
              <label class="sr-only" for="lastname">Фамилия</label>
              <input v-model="lastname" v-validate="{ required: true, regex: validateName }" type="text" name="lastname" placeholder="Фамилия" class="form-control" id="lastname" required>
            </div>
            <div class="form-group">
              <label class="sr-only" for="firstname">Имя</label>
              <input v-model="firstname" v-validate="{ rules: { regex: validateName} }" type="text" name="firstname" placeholder="Имя" class="form-control" id="firstname" required>
            </div>
            <div class="form-group" v-if="userType == 3">
              <b-form-checkbox v-model="isChief">
                  <span>Начальник отдела</span>
              </b-form-checkbox>
            </div>
            <button type="submit"class="btn btn-primary btn-block" :disabled="!firstname || !lastname || !userAdminPanelType || !phoneNumber || password.length > 0 && password.length < 6">{{userType == 10 ? 'Далее' : 'Зарегистрировать'}}</button>
          </form>
          <Garage v-if="userType == 10 && step == 2" :garage="garage" :garageLoader="garageLoader" :shownCarId="shownCarId" />
          <AddCar v-if="userType == 10 && step == 3" :newUserId="newUserId" />
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
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
import Garage from './Garage'
import AddCar from './AddCar'


export default {
  name: 'Reg',
  components: {
    headers,
    Breadcrumb,
    TheMask,
    bFormCheckbox,
    Garage,
    AddCar
  },
  data() {
    return {
      title: 'Регистрация',
      breadcrumbTitle: '',
      step: localStorage.getItem('step') || 1,
      userAdminPanelType: 0,
      newUserId: localStorage.getItem('newUserId') || 0,
      phoneNumber: localStorage.getItem('phoneNumber') || '',
      password: '',
      confirmPassword: '',
      lastname: '',
      firstname: localStorage.getItem('firstName') || '',
      isChief: false,
      garageLoader: false,
      garage: [],
      shownCarId: 0,
      host: host.host,
      validateName: /^[а-яА-ЯёЁa-zA-Z]+[-\s\']?[а-яА-ЯёЁa-zA-Z]+?$/,
      validateNumber: /^[0-9]+$/,
      subdivisions: [],
      userType: localStorage.getItem('userType'),
      userTypes: [{
        type: 'Логист',
        value: 4
      }, {
        type: 'Экспедитор',
        value: 5
      }, {
        type: 'Бухгалтер',
        value: 6
      }, {
        type: 'Снабжение',
        value: 7
      }, {
        type: 'Менеджер',
        value: 8
      }, {
        type: 'Тех. поддержка',
        value: 9
      }, {
        type: 'Клиент. поддержка',
        value: 10
      }, {
        type: 'Разработчик',
        value: 12
      }]
    }
  },
  watch: {
    step: function () {
      switch (this.step) {
        case 1:
        this.userType == 3 ? this.breadcrumbTitle = 'Регистрация нового сотрудника' : this.breadcrumbTitle = 'Регистрация нового пользователя'
        break
        case 2:
        localStorage.setItem('step', 2)
        localStorage.setItem('newUserId', this.newUserId)
        localStorage.setItem('firstName', this.firstname)
        localStorage.setItem('phoneNumber', this.phoneNumber)
        break
        case 3:
        this.breadcrumbTitle = 'Добавление автомобиля в гараж'
        break
      }
    }
  },
  methods: {
    setBreadcrumbTitle () {
      this.userType == 3 ? this.breadcrumbTitle = 'Регистрация нового сотрудника' : this.breadcrumbTitle = 'Регистрация нового пользователя'
      if (localStorage.getItem('step', 2)) {
        this.breadcrumbTitle = 'Гараж пользователя ' + this.firstname + ' ' + this.lastname + ' (ID: ' + this.newUserId + '),' + ' тел: +' + this.phoneNumber
      }
    },
    register () {
      let requestBody = {
        phone: '7' + this.phoneNumber,
        password: this.password,
        firstName: this.firstname,
        lastName: this.lastname
      }

      if (this.userType == 3)  {
        requestBody.isChief = this.isChief
        requestBody.subdivisionId = this.userAdminPanelType 
      }

      let URL
      this.userType == 10 ? URL = `${host.host}/Users` : URL = `${host.host}/Employee`

      if (!this.userAdminPanelType) return toastr.error("Выберите тип пользователя!")
      this.$http.post(URL, requestBody, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        toastr.success('Пользователь зрегистрирован')
        this.phoneNumber = ''
        this.password = ''
        this.confirmPassword = ''
        this.userAdminPanelType = ''
        this.firstname = ''
        this.lastname = ''
        this.secondname = ''
        this.isChief = false
        this.newUserId = response.body.userId
        if (this.userType == 10) this.step = 2
      }, response => {
        response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    getSubdivisions () {
      this.loader = true
      this.$http.get(`${host.host}/Employee/Subdivision`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        if (response.status == 200) {
          this.userTypes = response.body
        } 
        if (this.userType != 3) {
          this.userAdminPanelType = this.userType
        }
      }, response => {
        this.loader = false
        toastr.error("Ошибка сервера")
      })
    },
    getGarage () {
      this.garageLoader = true
      this.$http.get(`${host.host}/Garage/${this.newUserId}/AllCarsUser`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.garageLoader = false
        this.garage = JSON.parse(response.body.model)
        if (this.garage.length) this.shownCarId = this.garage[0].Id
      }, response => {
        this.garageLoader = false
        toastr.error('Ошибка сервера')
      })
      setTimeout(this.getLogos, 1000)
    }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title
    if (this.userType == 3) this.getSubdivisions()
    this.setBreadcrumbTitle()

    if (this.userType == 10) this.userAdminPanelType = true
    if (localStorage.getItem('newUserId')) this.getGarage()
    
    // потестить
    // this.step = 2 
    // this.newUserId = 163 
    // this.getGarage()
  },
  mounted () {
    this.$on('addToGarage', function() {
      this.step = 3
    })
    this.$on('carAdded', function() {
      this.step = 2
      this.getGarage()
    })
    this.$on('carRemoved', function() {
      this.getGarage()
    })
    this.$on('stepToGarage', function() {
      this.step = 2
    })
    this.$on('goToUserRegistration', function() {
      this.step = 1
    })
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style>
