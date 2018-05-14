<template>
  <div class="modal fade bd-example-modal-lg" id="request-logs-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg" style="max-width: 80%">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Логи запросов</h5>
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

              <vue-good-table 
                v-if="!loader"
                style="margin-bottom: 30px"
                :columns="columns"
                :rows="requestLogs"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                :paginate="true"
                :styleClass="'table custom-table'">
                <template slot="table-row" slot-scope="props">
                  <td>{{ props.row.date | formatDate }}</td>
                  <td>{{ props.row.methodType }}</td>
                  <td>{{ props.row.method }}</td>
                  <td>{{ props.row.controller }}</td>
                  <td>{{ props.row.initiator }}</td>
                  <td>{{ props.row.inputData }}</td>
                </template>
              </vue-good-table>

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
    name: 'RequestLogs',
    props: ['requestLogsDateTo', 'requestLogsInitiatorId', 'initiatorType'],
    components: {
      TheMask,
      bFormCheckbox
    },
    data() {
      return {
        loader: false,
        requestLogs: [],
        columns: [{
          label: 'date',
          field: 'date',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date'
        }, {
          label: 'type',
          field: 'methodType',
          thClass: 'th-class cursor-pointer'
        }, {
          label: 'method',
          field: 'method',
          thClass: 'th-class cursor-pointer'
        }, {
          label: 'controller',
          field: 'controller',
          thClass: 'th-class cursor-pointer'
        }, {
          label: 'initiator',
          field: 'initiator',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'inputData',
          field: 'inputData',
          thClass: 'th-class cursor-pointer',
        }]
      }
    },
    methods: {
      getRequestLogs () {
        this.loader = true
        console.log(this.requestLogsDateTo, this.requestLogsInitiatorId)
        let requestLogsDateTo = new Date(this.requestLogsDateTo)
        let requestLogsDateFrom = (new Date (requestLogsDateTo - 120000)).toISOString()
        this.$http.get(`${host.host}/systemlog/action/search?uId=${this.requestLogsInitiatorId}&uType=${this.initiatorType}&from=${requestLogsDateFrom}&to=${this.requestLogsDateTo}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.status == 200) this.requestLogs = response.body
          console.log(this.requestLogs)
          this.loader = false
        }, response => {
          toastr.error("Ошибка сервера")
          this.loader = false
        })
      },
    },
    created() {
      let self = this
      $(document).on('show.bs.modal', '#request-logs-modal', function () {
        self.loader = true
      });
      $(document).on('shown.bs.modal', '#request-logs-modal', function () {
        self.getRequestLogs()
      });
    }
  }
</script>

<style scoped src="../../assets/admin.css">
  
</style>


