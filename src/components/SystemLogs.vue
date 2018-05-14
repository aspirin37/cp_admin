<template>
  <div class="Reg">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb title="Системные логи" icon="fa fa-fw fa-list"></Breadcrumb>

            <div class="container" style="margin-top: 10px">
              <form @submit.prevent="getSystemLog">
                <div class="row" style="align-items: center">
                  <b-form-group class="col-lg-3" style="margin-bottom: 0">
                    <b-form-radio-group v-model="requestType.selected" 
                      :options="requestType.options">
                    </b-form-radio-group>
                  </b-form-group>

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
                      input-class="form-control-sm cursor-pointer">
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
                      input-class="form-control-sm cursor-pointer">
                    </datepicker>
                  </div>

                  <div class="input-group col-lg-2" v-if="requestType.selected == 1">
                    <input type="text" class="form-control form-control-sm" disabled="true">
                  </div>

                  <div class="input-group col-lg-2" v-if="requestType.selected == 1">
                    <span class="input-group-addon input-group-addon-sm" id="basic-addon1">last</span>
                    <input type="text" class="form-control form-control-sm" v-model="logsNumber" aria-label="last" aria-describedby="last">
                  </div>

                  <div class="input-group col">
                    <button type="submit" class="btn btn-sm btn-primary" :disabled="requestType.selected == 2 && (!dateFrom || !dateTo)">Update</button>
                  </div>
                  <div class="input-group col">
                    <button type="button" class="btn btn-sm btn-danger ml-auto" data-toggle="modal" data-target="#clear-logs-modal">Clear</button>
                  </div>
                </div>
              </form>
            </div>

          <div class="text-center" v-if="loader">
            <img src="../assets/load.svg" alt="load gif" width="40">
          </div>

          <vue-good-table 
            v-if="!loader"
            :columns="columns"
            :rows="systemLog"
            :globalSearch="true"
            :globalSearchPlaceholder="'Поиск по ключевому слову'"
            :paginate="true"
            :styleClass="'table custom-table'">
            <template slot="table-row" slot-scope="props">
              <td style="padding: 5px !important">{{ props.row.date | formatDate }}</td>
              <td style="padding: 5px !important">{{ props.row.methodType }}</td>
              <td style="padding: 5px !important">{{ props.row.method }}</td>
              <td style="padding: 5px !important">{{ props.row.controller }}</td>
              <td 
                :class="[props.row.response.length >30 ? 'truncated' : '', 'td-small']" 
                @click="currentMessage = props.row.response">
                  {{ props.row.response | truncate(30) }}
              </td>
              <td 
                :class="[props.row.stackTrace.length > 30 ? 'truncated' : '', 'td-small']" 
                @click="showStackTrace(props.row.stackTrace)">
                <a href="#" class="text-dark" @click.prevent><span class="fa fa-fw fa-eye"></span></a>
              </td>
              <td class="td-small text-center">{{ props.row.initiatorId }}</td>
              <td style="padding: 5px !important">{{ props.row.description }}</td>
              <td style="padding: 5px !important"><a href="#" class="text-dark" data-toggle="modal" data-target="#request-logs-modal" @click.prevent="requestLogsDateTo = props.row.date; requestLogsInitiatorId = props.row.initiatorId; initiatorType = props.row.initiatorType"><span class="fa fa-fw fa-info-circle"></span></a></td>
            </template>
          </vue-good-table>

          <div class="card" v-if="!loader">
            <div class="card-body">
              <p class="card-text">{{ currentMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="clear-logs-modal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="myModalLabel">Очистить логи</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="clearSystemLog">
              <div class="d-flex align-items-center">

                <span style="margin-right: 10px">До</span>

                <div class="input-group" style="margin-right: 10px">
                  <datepicker
                  v-model="clearLogsTo"
                  language="ru"
                  placeholder="to"
                  format="dd MMMM yyyy"
                  :disabled="disabled"
                  :monday-first="true"
                  :bootstrap-styling="true"
                  wrapper-class="cursor-pointer custom-datepicker"
                  input-class="cursor-pointer custom-date-input">
                </datepicker>

                <div class="input-group d-flex align-items-center">
                  <b-form-checkbox v-model="isErrorsChecked">Логи ошибок</b-form-checkbox>
                  <b-form-checkbox v-model="isRequestsChecked">Логи запросов</b-form-checkbox>
                </div>
              </div>

            </div>
          </form>
        </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="clearSystemLog(false)" :disabled="!clearLogsTo || !isErrorsChecked && !isRequestsChecked">Clear</button>
            <button type="button" class="btn btn-secondary" @click="clearSystemLog(true)" :disabled="!clearLogsTo || !isErrorsChecked && !isRequestsChecked">Clear (not last 30)</button>
            <button type="button" class="btn btn-danger ml-auto" data-dismiss="modal">cancel</button>
          </div>
        </div>
      </div>
    </div>

    <RequestLogs :requestLogsDateTo="requestLogsDateTo" :requestLogsInitiatorId="requestLogsInitiatorId" :initiatorType="initiatorType"/>
  </div>
</template>

<script>
import host from '../data/host.js'
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import Datepicker from 'vuejs-datepicker'
import bFormRadioGroup from 'bootstrap-vue/es/components/form-radio/form-radio-group'
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
import RequestLogs from './modals/RequestLogs'

export default {
  name: 'SystemLogs',
  components: {
    headers,
    Breadcrumb,
    Datepicker,
    bFormRadioGroup,
    bFormCheckbox,
    RequestLogs
  },
  data() {
    return {
      title: 'Системные логи',
      loader: false,
      dateFrom: '',
      dateTo: '',
      logsNumber: 30,
      requestLogsDateTo: '',
      requestLogsInitiatorId: 0,
      initiatorType: 0,
      clearLogsTo: new Date (new Date - 2592000000), // текущая дата - 30 дней
      isErrorsChecked: true,
      isRequestsChecked: true,
      systemLog: [],
      currentMessage: 'Сообщение отсутствует',
      requestType: {
        selected: 1,
        options: [
          {text: 'По последним', value: 1, status: 'По последним'},
          {text: 'По дате', value: 2, status: 'По дате'},
        ]
      },
      disabled: {
        from: new Date
      },
      columns: [{
        label: 'date',
        field: 'date',
        thClass: 'th-class th-class-small cursor-pointer text-left',
        type: 'date'
      }, {
        label: 'type',
        field: 'methodType',
        thClass: 'th-class th-class-small cursor-pointer'
      }, {
        label: 'method',
        field: 'method',
        thClass: 'th-class th-class-small cursor-pointer'
      }, {
        label: 'controller',
        field: 'controller',
        thClass: 'th-class th-class-small cursor-pointer'
      }, {
        label: 'response',
        field: 'response',
        thClass: 'th-class th-class-small cursor-pointer'
      }, {
        thClass: 'th-class th-class-small',
        sortable: false
      }, {
        label: 'init.ID',
        field: 'initiatorId',
        thClass: 'th-class th-class-small cursor-pointer text-center',
        type: 'number'
      }, {
        label: 'description',
        field: 'description',
        thClass: 'th-class th-class-small cursor-pointer'
      }, {
        thClass: 'th-class th-class-small',
        sortable: false
      }]
    }
  },
  methods: {
    showStackTrace (traceText) {
      this.currentMessage = traceText
      setTimeout(() => {
        window.scrollTo(0,document.body.scrollHeight);
      }, 50)
    },
    getSystemLog () {
      this.loader = true
      let URL 
      switch (this.requestType.selected) {
        case 2:
          URL = `${host.host}/systemlog/error/period?from=${this.dateFrom.toISOString()}&to=${this.dateTo.toISOString()}`
          break
        default:
          URL = `${host.host}/systemlog/error/last?count=${this.logsNumber}`
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
        if (response.status == 200) this.systemLog = response.body
        this.currentMessage = 'Сообщение отсутствует'
      }, response => {
        this.loader = false
        toastr.error("Ошибка сервера")
      })
    },
    clearSystemLog (month) {
      this.loader = true
      let period = month ? (new Date (new Date - 2592000000)).toISOString() : this.clearLogsTo.toISOString()
      this.$http.get( `${host.host}/SystemLog/Clear?dateTo=${period}&clearActions=${this.isRequestsChecked}&clearErrors=${this.isErrorsChecked}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        $('#clear-logs-modal').modal('hide')
        toastr.success("Логи успешно очищены")
        this.getSystemLog()
        this.loader = false
      }, response => {
        this.loader = false
        toastr.error("Ошибка сервера")
      })
    }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title,
    this.getSystemLog()
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style>

<style lang="sass">
  .truncated
    cursor: pointer
    font-style: italic
    text-decoration: underline

  .cursor-pointer 
    cursor: pointer

  .custom-datepicker
    margin-right: 10px

  .custom-date-input
    width: 200px !important

  .input-group-addon-sm
    padding: .25rem .5rem
    font-size: .875rem
    line-height: 1.5
    border-radius: .2rem

  .th-class-small
    padding: 8px !important

</style>

