<template>
  <div class="modal fade bd-example-modal-lg" id="edit-admin-user-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>{{ isEditingDisabled ? 'Информация о пользователе - ID ' + userInfo.accountId : 'Редактирование профиля пользователя - ID ' + userInfo.accountId }}</h5>
          <button type="button" class="close cursor-pointer" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-12">
              <div class="loader-block text-center" v-if="loader">
                <img src="../../assets/load.svg" alt="load gif" width="40">
              </div>

              <form class="registration-form col-lg-6" v-if="!loader" @submit.prevent="editAdminUser">
                <select class="form-control" style="margin-bottom: 8px" v-model="userInfo.subdivisionId" v-if="userInfo.subdivisionId != 3 && !isEditingDisabled" :disabled="isEditingDisabled">
                  <option v-for="userType in userTypes" :value="userType.value">{{ userType.name }}</option>
                </select>
                <div class="input-group" style="margin-bottom: 8px">
                  <div class="input-group-addon" style="width: 150px">Фамилия</div>
                  <input v-model="userInfo.lastName" v-validate="{ required: true, regex: validateName }" type="text" name="lastname" placeholder="Фамилия" class="form-control" id="lastname" :disabled="isEditingDisabled">
                </div>
                <div class="input-group" style="margin-bottom: 8px">
                  <div class="input-group-addon" style="width: 150px">Имя</div>
                  <input v-model="userInfo.firstName" v-validate="{ required: true, regex: validateName }" type="text" name="firstname" placeholder="Имя" class="form-control" id="firstname" :disabled="isEditingDisabled">
                </div>
                <div class="input-group" style="margin-bottom: 8px" v-if="isEditingDisabled">
                  <div class="input-group-addon" style="width: 150px">Логин</div>
                  <the-mask v-model="userInfo.loginNumber" mask="7(###)###-####" type="text" class="form-control" id="loginNumber" placeholder="Логин" :disabled="isEditingDisabled"/>
                </div>
                <div class="input-group" style="margin-bottom: 8px">
                  <div class="input-group-addon" style="width: 150px">Телефон</div>
                  <the-mask v-model="userInfo.contactPhone" mask="7(###)###-####" type="text" class="form-control" id="phoneNumber" placeholder="Номер телефона" :disabled="isEditingDisabled"/>
                </div>
                <div class="input-group" style="margin-bottom: 8px" v-if="!isEditingDisabled">
                  <div class="input-group-addon" style="width: 150px">Новый пароль</div>
                  <input v-model="newPassword" type="text" name="lastname" placeholder="Введите пароль" class="form-control" id="newPassword" :disabled="isEditingDisabled">
                </div>
                <div class="input-group" style="margin-bottom: 8px" v-if="userType == 3" :disabled="isEditingDisabled">
                  <b-form-checkbox v-model="userInfo.isChief" :disabled="isEditingDisabled">
                    <span>Начальник отдела</span>
                  </b-form-checkbox>
                </div>
                <button type="submit" class="btn btn-success" :disabled="!userInfo.contactPhone || !userInfo.firstName || !userInfo.lastName || newPassword.length > 0 && newPassword.length < 6" v-if="!isEditingDisabled">Сохранить</button>
<!--                 <button type="button" class="btn btn-primary" style="margin:" data-dismiss="modal" v-else>Закрыть</button> -->
              </form> 

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import host from '../../data/host.js'
  import {TheMask} from 'vue-the-mask'
  import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'

  export default {
    name: 'EditStaff',
    props: ['userId', 'isEditingDisabled'],
    components: {
      TheMask,
      bFormCheckbox
    },
    data() {
      return {
        loader: false,
        validateName: /^[а-яА-ЯёЁa-zA-Z]+[-\s\']?[а-яА-ЯёЁa-zA-Z]+?$/,
        userType: localStorage.getItem('userType'),
        userInfo: [],
        userTypes: [],
        newPassword: ''
      }
    },
    methods: {
      getSubdivisions () {
        this.loader = true
        this.$http.get(`${host.host}/Employee/Subdivision`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.status == 200) this.userTypes = response.body
        }, response => {
          toastr.error("Ошибка сервера")
        })
      },
      getProfileInfo () {
        this.loader = true
        this.$http.get(`${host.host}/Employee/${this.userId}`, {
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
      },
      editAdminUser () {
        this.$http.put(`${host.host}/Employee`, {
            "accountId": this.userInfo.accountId,
            "contactPhone": '7' + this.userInfo.contactPhone,
            "subdivisionId": this.userInfo.subdivisionId,
            "firstName": this.userInfo.firstName,
            "lastName": this.userInfo.lastName,
            "isChief": this.userInfo.isChief
          }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) return toastr.error("Ошибка сервера")
          toastr.success('Информация о пользователе изменена')
          this.$parent.$emit('updateAdminUsers')
        }, response => {
          toastr.error("Ошибка сервера")
        })

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
            return toastr.success('Пароль успешно обновлен!')
          }, response => {
            toastr.error('Не удалось поменять пароль')
          })
        }
      },
    },
    created() {
      let self = this
      $(document).on('show.bs.modal', '#edit-admin-user-modal', function () {
        self.loader = true
      });
      $(document).on('shown.bs.modal', '#edit-admin-user-modal', function () {
        self.getSubdivisions()
        self.getProfileInfo()
        console.log(self.$router)
      });
    }
  }
</script>

<style scoped lang="sass">

  .custom-table--modal
    margin-top: -15px !important

  .loader-block
    padding: 25px 0

  .form-control:disabled 
    background-color: transparent

  .custom-control-input:disabled ~ .custom-control-indicator
    background-color: #ddd;

  .custom-control-input:checked:disabled ~ .custom-control-indicator
    background-color: rgb(0, 123, 255);

  .custom-control-input:disabled ~ .custom-control-description
    color: rgb(33, 37, 41);

</style>