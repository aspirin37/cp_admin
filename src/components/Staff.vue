<template>
  <div class="Staff">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb title="Список сотрудников" :icon="'fa fa-fw fa-users'"></Breadcrumb>
          <div class="row">
            <div class="col-lg-12">

              <div class="container" style="margin: 5px 0">
                <form @submit.prevent="getAllTeam('byNumber', false)">
                  <div class="row" style="align-items: center">

                    <div class="input-group col-lg-4">
                      <the-mask v-model="contactNumberFilter" mask="7(###)###-####" type="text" class="form-control form-control-sm" id="contactNumberFilter" placeholder="Поиск по номеру" />
                    </div>

                    <div class="input-group col-1">
                      <button type="submit" class="btn btn-sm btn-secondary" style="margin-right: 12px" :disabled="contactNumberFilter.length != 10">Update</button>
                      <button type="button" class="btn btn-sm btn-secondary" style="margin-right: 12px" @click="getAllTeam('', true)">Download</button>
                    </div>

                    <json-excel
                      style   = "display: none"
                      class   = "btn btn-secondary dl-json"
                      :data   = "XLSdata"
                      :fields = "json_fields"
                      :name   = "fileName + '.xls'">
                    </json-excel>

                    <div class="input-group col-1">
                      <button type="button" class="btn btn-success" v-if="isActiveBackButton" @click="getAllTeam">Назад</button>
                    </div>

                  </div>
                </form>
              </div>

              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>

              <vue-good-table v-if="!loader"
                :columns="columns"
                :rows="teamList"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                :rowStyleClass="rowStyles"
                :defaultSortBy ="{ field: 'registrationDate', type: 'desc' }"
                paginate="true"
                :styleClass="'table custom-table'">
                <template slot="table-row" slot-scope="props">
                  <td>{{ props.row.accountId }}</td>
                  <td>{{ props.row.userId }}</td>
                  <td>{{ props.row.fullName }}</td>
                  <td>{{ props.row.loginNumber }}</td>
                  <td>{{ props.row.subdivisionDescription }}</td>
                  <td><span :class="[props.row.isChief ? 'fa fa-check text-success' : '']" style="margin-left: 10px"></span></td>
                  <td>{{ props.row.registrationDate | formatDate }}</td>
                  <td>{{ props.row.contactPhone | formatPhone }}</td>
                  <td>{{ props.row.lastLoginDate | formatDate }} <span v-if="props.row.countOfLogin">{{ '(' + props.row.countOfLogin + ')' }}</span></td>
                  <td>{{ props.row.balance }}</td>
                  <td v-if="userType == 3"><a href="#" class="text-primary" data-toggle="modal" data-target="#edit-admin-user-modal" @click="editedUser = props.row.accountId"><span class="fa fa-lg fa-pencil-square-o"></span></a></td>
                  <td style="padding: 0; width: 50px">
                    <label class="custom-control custom-checkbox cursor-pointer" style="margin: 0 8px">
                      <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="props.row.isActive" @change="activateEmployee(props.row.isActive, props.row.accountId)" :disabled="props.row.subdivisionId == 3">
                      <span aria-hidden="true" class="custom-control-indicator"></span>
                    </label>
                  </td>
                </template>
              </vue-good-table>

            </div>
          </div>
        </div>
      </div>
    </div>
    <EditStaff :userId="editedUser" />
    <downloadXLS :tableType="2" />
  </div>
</template>

<script>
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  import EditStaff from './modals/EditStaff'
  import {TheMask} from 'vue-the-mask'
  import JsonExcel from 'vue-json-excel'
  import moment from 'moment'
  import downloadXLS from './modals/downloadXLS'

  export default {
    name: 'Staff',
    components: {
      headers,
      Breadcrumb,
      TheMask,
      EditStaff,
      JsonExcel,
      moment,
      downloadXLS
    },
    data() {
      return {
        loader: false,
        title: 'Сотрудники',
        userType: localStorage.getItem('userType'),
        editedUser: 0,
        contactNumberFilter: '',
        isActiveBackButton: false,
        teamList: [],
        XLSdata: [],
        json_fields: {},
        fileName: '',
        columns: [{
          label: 'aID',
          field: 'userId',
          thClass: 'th-class cursor-pointer',
          type: 'number',
        }, {
          label: 'uID',
          field: 'userId',
          thClass: 'th-class cursor-pointer',
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
          label: 'Отдел',
          field: 'subdivisionDescription',
          thClass: 'th-class cursor-pointer'
        }, {
          label: 'Шеф',
          field: 'isChief',
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
          label: 'Посл. вход / Всего',
          field: 'lastLoginDate',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date'
        }, {
          label: 'Баланс',
          field: 'balance',
          thClass: 'th-class',
          sortable: false
        }, {
          label: '',
          field: '',
          thClass: 'th-class',
          sortable: false,
          hidden: localStorage.getItem('userType') != 3
        }, {
          label: '',
          field: 'isActive',
          thClass: 'th-class',
          sortable: false
        }]
      }
    },
    methods: {
      formatPhone(phone) {
        return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1($2)$3-$4-$5")
      },
      formatDate(value) {
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
      getAllTeam (requestType, downloadXLS) {

        downloadXLS ? this.loader = false : this.loader = true

        let URL
        switch (requestType) {
          case 'byNumber':
            URL = `${host.host}/Employee/Search?phoneNum=7${this.contactNumberFilter}`
            this.isActiveBackButton = true
            break
          default:
            URL = `${host.host}/Employee`
            this.isActiveBackButton = false
        }
        this.$http.get( URL, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.loader = false
          let data = response.body.reverse()
          data.forEach((it) => {
            it.fullName = it.lastName + ' ' + it.firstName
             // для корректного отображения в excel-файле
            it.formattedRegistrationDate = this.formatDate(it.registrationDate)
            it.formattedLastLoginDate = this.formatDate(it.lastLoginDate)
            it.formattedContactPhone = this.formatPhone(it.contactPhone)
            it.isActive ? it.formattedIsActive = 'Да' : it.formattedIsActive = 'Нет'
            it.isChief ? it.formattedIsChief = 'Да' : it.formattedIsChief = 'Нет'
          })

          if (downloadXLS) {
            this.XLSdata = data
            $('#downloadXLS').modal()
          } else {
            this.teamList = data
          }
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      activateEmployee (isActiveEmployee, accountId) {
        let activationFlag = 'Activate'
        let message = 'Activate'

        isActiveEmployee ? activationFlag = 'Activate' : activationFlag = 'Deactivate'
        isActiveEmployee ? message = 'Сотрудник успешно активирован!' : message = 'Сотрудник успешно деактивирован!'

        this.$http.put(`${host.host}/Account/${activationFlag}?accId=${accountId}`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          toastr.success(message)
        }, response => {
          toastr.error("Ошибка сервера")
        })
      },
      rowStyles (row){ 
        return (!row.isActive) ? 'bg-light' : ''
      },
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title
      this.getAllTeam()
    },
    mounted() {
      this.$on('updateAdminUsers', function(stoModel) {
        $('#edit-admin-user-modal').modal('hide')
        let self = this
        setTimeout(self.getAllTeam, 500)
      })

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