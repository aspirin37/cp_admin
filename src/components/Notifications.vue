<template>
  <div class="Sto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Ордера'" :icon="'fa fa-fw fa-list'"></Breadcrumb>
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>
              <b-form-checkbox class="float-right" id="myWorkDaysStatus" v-if="!loader"
                v-model="isReadFilter">
                  Только непрочитанные
              </b-form-checkbox>
              <vue-good-table v-if="!loader"
                :columns="columns"
                :rows="isReadFilter ? filteredRows : rows"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                :paginate="true"
                :perPage="8"
                :rowStyleClass="rowStyles"
                :styleClass="'table custom-table'">
                <template slot="table-row" slot-scope="props">
                  <td>
                    <a href="#" class="text-primary" @click="openOrder(props.row.OrderId)" style="margin: 8px; margin-left: 0">
                    {{ props.row.OrderId }}
                    </a>
                  </td>
                  <td>{{ props.row.TimeSelectSto }}</td>
                  <td>{{ props.row.StoName }}</td>
                  <td>{{ props.row.PreviousSto }}</td>
                  <td :class="[props.row.isPending ? 'text-danger' : '']">{{ props.row.StatusOrder }}</td>
                  <td :class="[props.row.isCancelledBySto ? 'text-warning' : 'text-danger']">{{ props.row.CancelOrderStatus }}</td>
                  <td>{{ props.row.StatusPay }}</td>
                  <td>{{ props.row.WorkStartTime }}</td>
                  <td>{{ props.row.WorkEndTimeByFact }}</td>
                  <td v-if="isChief">{{ props.row.ManagerInfo }}</td>
                  <td style="padding: 0; width: 50px">
                    <label class="custom-control custom-checkbox"  style="margin: 0 8px">
                      <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="props.row.IsRead" :disabled="props.row.IsRead" @change="onCheckbox(props.row.OrderId)">
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
    <preorderloader />
    <Order v-if="orderInfo" :orderId="orderId" />
  </div>
</template>

<script>
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  import preorderloader from './modals/PreOrderLoader'
  import Order from './modals/Order'
  import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'

  export default {
    name: 'Notifications',
    components: {
      headers,
      Breadcrumb,
      preorderloader,
      Order,
      bFormCheckbox
    },
    data() {
      return {
        isChief: localStorage.getItem('IsChief') == 'true' ? true : false,
        loader: false,
        isTableCreated: false,
        orderId: 0,
        timerId: 0,
        isReadFilter: false,
        orderInfo: '',
        title: 'Ордера',
        notifications: 0,
        orders: [],
        columns: [{
          label: 'ID',
          field: 'OrderId',
          thClass: 'th-class cursor-pointer',
          sortFn: this.sortById,
        }, {
          label: 'Cоздан',
          field: 'TimeSelectSto',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'СТО',
          field: 'StoName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Пред. СТО',
          field: 'PreviousSto',
          thClass: 'th-class',
        }, {
          label: 'Статус',
          field: 'StatusOrder',
          thClass: 'th-class th-width-limit cursor-pointer',
        }, {
          label: 'Статус отказа',
          field: 'CancelOrderStatus',
          thClass: 'th-class',
        }, {
          label: 'Оплата',
          field: 'StatusPay',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Начало',
          field: 'WorkStartTime',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Выполнен',
          field: 'WorkEndTimeByFact',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Менеджер',
          field: 'ManagerInfo',
          thClass: 'th-class cursor-pointer',
        }, {
          label: '',
          field: 'isReadField',
          thClass: 'th-class cursor-pointer',
          sortable: false
        }]
      }
    },
    computed: {
      rows () {
        let self = this
        let notifications = 0

        function formatDateTime(date) {
          let formattedDate = date.slice(8,10) + '.' + date.slice(5,7) + '.' + date.slice(2,4) 
          let formattedTime = date.slice(11,13) + ':' + date.slice(14,16)
          let formattedDateTime = formattedDate + '\n в\u00A0' + formattedTime
          return formattedDateTime
        }

        return this.orders
          .map(function (it, i , arr) {
            it.WorkEndTimeByFact = formatDateTime(it.WorkEndTimeByFact)
            it.WorkStartTime = formatDateTime(it.WorkStartTime)
            it.TimeSelectSto = formatDateTime(it.TimeSelectSto)
            it.CancelOrderStatus = it.CancelOrderStatus.Item2
            it.StatusOrder = it.StatusOrder.Item2
            it.StatusPay = it.StatusPay.Item2
            it.CancelOrderStatus === 'Отменен пользователем' ? it.isCancelledBySto = true : it.isCancelledBySto = false
            it.StatusOrder === 'Ожидает первичного подтверждения СТО' ? it.isPending = true : it.isPending = false
            if (it.StoName === 'Не выбрана сто') it.StoName = ''
            if (it.TimeSelectSto === '01.01.01\n в\u00A000:00') it.TimeSelectSto = ''
            if (it.WorkStartTime === '01.01.01\n в\u00A000:00') it.WorkStartTime = ''
            if (it.WorkEndTimeByFact === '01.01.01\n в\u00A000:00') it.WorkEndTimeByFact = ''
            if (!it.IsRead) notifications++
            self.notifications = notifications
            it.isEditing = false
            return it
          })
          .sort((min, max) => max.OrderId - min.OrderId)
      },
      filteredRows () {
        return this.rows.filter((it) => !it.IsRead)
      }
    },
    watch: {
      notifications: function () {
        this.$store.commit('updateNotificationsNumber', this.notifications)
        this.notifications !== 0 ? 
        document.querySelector("link[rel='shortcut icon']").href = "/static/faviconotif.png" : 
        document.querySelector("link[rel='shortcut icon']").href = "/static/favicon.png"
      }
    },
    methods: {
      getOrders() {
        if (!this.isTableCreated) {
          this.loader = true
          this.isTableCreated = true
        }
        this.$http.get(`${host.host}/Sto/Orders`, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.loader = false
          if(response.body.error == true) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model).reverse()
          this.orders = data
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      onCheckbox (id) {
        this.$http.put(`${host.host}/Order/${id}/Read`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.updateWork = false
          let data = JSON.parse(response.data.model)
          this.orderInfo = data
          this.notifications--

          return toastr.success('Сообщение прочитано!')
        }, response => {
          this.updateWork = false
          return toastr.error('Ошибка сервера')
        })
      },
      rowStyles(row){ 
        return (!row.IsRead) ? 'bg-light' : ''
      },
      openOrder(id) {
        this.preOrderLoader = true
        this.orderInfo = ''
        this.orderId = ''
        $("#createPreOrderLoader").modal('show')
        this.$http.get(`${host.host}/Order/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.preOrderLoader = false
          if(response.body.error == true) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model)
          this.orderInfo = data
          this.orderId = id
          console.log('hello', data.UserModel.Id)

          $("#createPreOrderLoader").modal('hide')
          setTimeout(function() {
            $("#Order").modal('show')
          }, 1000)
        }, response => {
          this.preOrderLoader = false
          console.log(response)
          return toastr.error('Ошибка сервера')
        })
      },
      sortById(x, y) {
        return (x < y ? -1 : (x > y ? 1 : 0))
      },
    }, 
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      if (!this.isChief) this.columns.splice(3, 1) // убрать менеджера из таблицы
      document.title = this.title
      this.getOrders()
      setInterval(this.getOrders, 60000)
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px;
</style>
