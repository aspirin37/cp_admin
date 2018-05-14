<template>
  <div class="Sto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb title="Список пользователей" :icon="'fa fa-fw fa-users'"></Breadcrumb>

          <div class="container" style="margin: 7px 0">
            <form @submit.prevent="getAllUsers(false)">
              <div class="row" style="align-items: center">
                <b-form-group style="margin-bottom: 0">
                  <b-form-radio-group v-model="requestType.selected">
                    <b-form-radio :value="1">По последним</b-form-radio>
                    <b-form-radio :value="2">По дате</b-form-radio>
                    <b-form-radio :value="3" v-if="userType == 3">По номеру</b-form-radio>
                  </b-form-radio-group>
                </b-form-group>

                <div class="input-group col-lg-2" v-if="requestType.selected == 1">
                  <input type="text" class="form-control" disabled="true">
                </div>

                <div class="input-group col-lg-2" v-if="requestType.selected == 1">
                  <span class="input-group-addon" id="basic-addon1">last</span>
                  <input type="text" class="form-control" v-model="usersNumber" aria-label="last" aria-describedby="last">
                </div>

                <div class="input-group col-lg-2" v-if="requestType.selected == 2">
                  <datepicker
                    v-model="dateFrom"
                    language="ru"
                    placeholder="from"
                    format="dd MMMM yyyy"
                    :disabled="disabled"
                    :monday-first="true"
                    :bootstrap-styling="true"
                    wrapper-class="cursor-pointer custom-datepicker"
                    input-class="cursor-pointer">
                  </datepicker>
                </div>

                <div class="input-group col-lg-2" v-if="requestType.selected == 2">
                  <datepicker
                    v-model="dateTo"
                    language="ru"
                    placeholder="to"
                    format="dd MMMM yyyy"
                    :disabled="disabled"
                    :monday-first="true"
                    :bootstrap-styling="true"
                    wrapper-class="cursor-pointer custom-datepicker"
                    input-class="cursor-pointer">
                  </datepicker>
                </div>

                <div class="input-group col-lg-4" v-if="requestType.selected == 3">
                  <the-mask v-model="contactNumberFilter" mask="7(###)###-####" type="text" class="form-control" id="contactNumberFilter" placeholder="Введите номер" />
                </div>

                <div class="input-group col">
                  <button type="submit" class="btn btn-secondary" style="margin-right: 12px" :disabled="requestType.selected == 2 && (!dateFrom || !dateTo) || requestType.selected == 3 && contactNumberFilter.length != 10">Update</button>
                  <button type="button" class="btn btn-secondary"style="margin-right: 12px" :disabled="requestType.selected == 2 && (!dateFrom || !dateTo) || requestType.selected == 3 && contactNumberFilter.length != 10" @click="getAllUsers(true)">Download</button>

                  <json-excel
                    style   = "display: none"
                    class   = "btn btn-secondary dl-json"
                    :data   = "XLSdata"
                    :fields = "json_fields"
                    :name   = "fileName + '.xls'">
                  </json-excel>
                </div>
              </div>
            </form>
          </div>

          <div class="text-center" v-if="loader">
            <img src="../assets/load.svg" alt="load gif" width="40">
          </div>

          <vue-good-table v-if="!loader"
            :columns="columns"
            :rows="users"
            :globalSearch="true"
            :globalSearchPlaceholder="'Поиск по ключевому слову'"
            paginate="true"
            :styleClass="'table custom-table'">
            <template slot="table-row" slot-scope="props">
              <td>{{ props.row.accountId }}</td>
              <td>{{ props.row.userId }}</td>
              <td>{{ props.row.fullName }}</td>
              <td>{{ props.row.loginNumber }}</td>              
              <td>{{ props.row.registrationDate | formatDate }}</td>
              <td>{{ props.row.contactPhone | formatPhone }}</td>
              <td><span :class="[props.row.isActive ? 'fa fa-check text-success' : '']" style="margin-left: 10px"></span></td>
              <td>{{ props.row.lastLoginDate | formatDate }} <span v-if="props.row.countOfLogin">{{ '(' + props.row.countOfLogin + ')' }}</span></td>
              <td>{{ props.row.balance }}</td>
            </template>
          </vue-good-table>

        </div>
      </div>
    </div>
    <downloadXLS :tableType="1" /> 
  </div>
</template>

<script>
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  import Datepicker from 'vuejs-datepicker'
  import bFormRadioGroup from 'bootstrap-vue/es/components/form-radio/form-radio-group'
  import bFormRadio from 'bootstrap-vue/es/components/form-radio/form-radio'
  import {TheMask} from 'vue-the-mask'
  import JsonExcel from 'vue-json-excel'
  import moment from 'moment'
  import downloadXLS from './modals/downloadXLS'

  export default {
    name: 'Users',
    components: {
      headers,
      Breadcrumb,
      Datepicker,
      bFormRadioGroup,
      bFormRadio,
      TheMask,
      JsonExcel,
      moment,
      downloadXLS
    },
    data() {
      return {
        loader: false,
        title: 'Пользователи',
        userType: localStorage.getItem('userType'),
        users: [],
        dateFrom: '',
        dateTo: '',
        usersNumber: 30,
        contactNumberFilter: '',
        XLSdata: [],
        json_fields: {},
        fileName: '',
        requestType: {
          selected: 1,
          options: [
            {text: 'По последним', value: 1, status: 'По последним'},
            {text: 'По дате', value: 2, status: 'По дате'},
            {text: 'По номеру', value: 3, status: 'По номеру'},
          ]
        },
        disabled: {
          from: new Date
        },
        columns: [{
          label: 'aID',
          field: 'accountId',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number',
        }, {
          label: 'uID',
          field: 'userId',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number',
        }, {
          label: 'Имя',
          field: 'fullName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Логин',
          field: 'loginNumber',
          thClass: 'th-class',
          sortable: false
        }, {
          label: 'Дата рег.',
          field: 'registrationDate',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date'
        }, {
          label: 'Телефон',
          field: 'contactPhone',
          thClass: 'th-class',
          sortable: false
        }, {
          label: 'Активен',
          field: 'isActive',
          thClass: 'th-class',
          sortable: false
        }, {
          label: 'Посл. вход / Всего',
          field: 'lastLoginDate',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date'
        }, {
          label: 'Баланс',
          field: 'balance',
          thClass: 'th-class',
          sortable: false
        }]
      }
    },
    methods: {
      formatPhone (phone) {
        return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1($2)$3-$4-$5")
      },
      formatDate (value) {
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
      },
      getAllUsers(downloadXLS) {

        downloadXLS ? this.loader = false : this.loader = true

        let URL
        let isNumber = false

        switch (this.requestType.selected) {
          case 2:
            URL = `${host.host}/Statistic/User/Registered?from=${this.dateFrom.toISOString()}&to=${this.dateTo.toISOString()}`
            break
          case 3:
            URL = `${host.host}/Statistic/User/search?phoneNum=7${this.contactNumberFilter}`
            isNumber = true
            break
          default:
            URL = `${host.host}/Statistic/User/LastRegistered?count=${this.usersNumber}`
            break
        }
        this.$http.get( URL, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false

          let data 
          isNumber ? data = [response.body] : data = response.body

          data.forEach((it) => {
            it.fullName = it.lastName + ' ' + it.firstName
            if (downloadXLS) {
              // для корректного отображения в excel-файле
              it.formattedRegistrationDate = this.formatDate(it.registrationDate)
              it.formattedLastLoginDate = this.formatDate(it.lastLoginDate)
              it.formattedContactPhone = this.formatPhone(it.contactPhone)
              it.isActive ? it.formattedIsActive = 'Да' : it.formattedIsActive = 'Нет'
              it.isChief ? it.formattedIsChief = 'Да' : it.formattedIsChief = 'Нет'
            }
          })

          if (downloadXLS) {
            this.XLSdata = data
            $('#downloadXLS').modal()
          } else {
            this.users = data
          }
        }, response => {
          this.loader = false
          toastr.error("Ошибка сервера")
        })
      }
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title
      this.getAllUsers()
    },
    mounted() {
      this.$on('downloadXLS', function(fields, name) {
        this.json_fields = fields
        this.fileName = name
        setTimeout(() => {
          $('.dl-json').click()
        }, 500)
      })
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>



<style lang="sass">

  .cursor-pointer 
    cursor: pointer

  .notification
    background-color: rgba(119,136,153, 0.1)

  .th-class
    padding: 8px !important
    font-size: 14px !important
    line-height: 1.42857143 !important
    background-color: white !important
    border-bottom: 1px solid #ddd !important
    padding-top: 18px !important
    padding-bottom: 20px !important

  .th-width-limit
    width: 150px !important

  td
    border-top: 0 !important
    border-bottom: 1px solid #ddd !important

  .table-footer
    background-color: white !important
    border: 0 !important

</style>

<style scoped lang="sass">

  .container-fluid
    margin-top: 55px

</style>