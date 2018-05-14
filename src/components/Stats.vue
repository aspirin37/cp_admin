<template>
  <div class="Stats">
    <div class="fixed-nav" id="page-top">
      <headers></headers>
  
      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Статистика'" :icon="'fa fa-fw fa-bar-chart'"></Breadcrumb>

          <div v-if="!loader && userType == 8">
            <div class="table-responsive">
              <div id="dataTable_wrapper" class="dataTables_wrapper container-fluid dt-bootstrap4">

                <div class="row">
                  <div class="col-sm-12">
                    <table class="table table-bordered table-responsive-lg table-sm" id="dataTable" cellspacing="0" role="grid" aria-describedby="dataTable_info" >
                      <thead>
                        <tr role="row">
                          <th class="sorting_asc text-center" tabindex="0" rowspan="1" colspan="1">ID з/н</th>
                          <th class="sorting" tabindex="0" rowspan="1" colspan="1"  width="130">Создан</th>
                          <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="130">Дата работ</th>
                          <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="275">СТО</th>
                          <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="330">Менеджер</th>
                          <th class="sorting" tabindex="0" rowspan="1" colspan="1">Статус з/н</th>
                          <th class="sorting" tabindex="0" rowspan="1" colspan="1">Статус оплаты</th>
                          <th class="sorting" tabindex="0" rowspan="1" colspan="1">Примечание</th>
                        </tr>
                      </thead>

                        <tr role="row" class="odd" v-for="row in stoStat">
                          <td class="sorting_1 text-center">{{ row.OrderId }}</td>
                          <td>{{ row.TimeCreateOrder | onDate }}</td>
                          <td>{{ row.TimeSelectionSto | onDate }}</td>
                          <td>{{ row.StoName }}</td>
                          <td>{{ row.ManagerInfo }}</td>
                          <td>{{ row.StatusOrder }}</td>
                          <td>{{ row.StatusPay }}</td>
                          <td>{{ row.Note }}</td>
                        </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <table class="table table-bordered table-responsive-lg table-sm mt-3" id="dataTable" cellspacing="0" role="grid" aria-describedby="dataTable_info" >
              <thead>
                <tr role="row">
                  <th class="sorting_asc text-center" tabindex="0" rowspan="1" colspan="1" width="100"></th>
                  <th class="sorting" tabindex="0" rowspan="1" colspan="1"  width="130">Открыто предзаказов</th>
                  <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="130">Отправлено на СТО з/н</th>
                  <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="275">Выполнено з/н (закрыто)</th>
                </tr>
              </thead>
              <tr role="row" class="odd">
                <td class="sorting_1 text-center">Сегодня</td>
                <td>{{ stoStat2.today.open }}</td>
                <td>{{ stoStat2.today.send }}</td>
                <td>{{ stoStat2.today.close }}</td>
              </tr>
              <tr role="row" class="odd">
                <td class="sorting_1 text-center">Эта неделя</td>
                <td>{{ stoStat2.thisWeek.open }}</td>
                <td>{{ stoStat2.thisWeek.send }}</td>
                <td>{{ stoStat2.thisWeek.close }}</td>
              </tr>
              <tr role="row" class="odd">
                <td class="sorting_1 text-center">Этот месяц</td>
                <td>{{ stoStat2.thisMonth.open }}</td>
                <td>{{ stoStat2.thisMonth.send }}</td>
                <td>{{ stoStat2.thisMonth.close }}</td>
              </tr>
            </table>
          </div>
  
          <div class="card mb-3" v-if="!loader && userType == 6">
            <div class="card-header">
              <i class="fa fa-table"></i> Транзакции
            </div>
            <div class="">
              <div class="table-responsive">
                <div id="dataTable_wrapper" class="dataTables_wrapper container-fluid dt-bootstrap4">
  
                  <div class="row">
                    <div class="col-sm-12">
                      <table class="table table-bordered table-responsive-lg table-sm" id="dataTable" cellspacing="0" role="grid" aria-describedby="dataTable_info" >
                        <thead>
                          <tr role="row">
                            <th class="sorting_asc text-center" tabindex="0" rowspan="1" colspan="1">№</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1">Cумма</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="130">Дата</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="275">Статус</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1" width="330">Id операции в сбербанке</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1">OrderId</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1">Id пользователя</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1">MoneySto</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1">MoneyDetail</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1">MoneyCarPort</th>
                            <th class="sorting" tabindex="0" rowspan="1" colspan="1">Статус</th>
                          </tr>
                        </thead>
  
                          <tr role="row" class="odd" v-for="row in transactions" :key="row.Id">
                            <td class="sorting_1 text-center">{{ row.Id }}</td>
                            <td>{{ row.Amount }}</td>
                            <td>{{ row.TimeOrder | onDate }}</td>
                            <td>{{ row.Status }}</td>
                            <td>{{ row.IdOrderSberbank }}</td>
                            <td>{{ row.OrderId }}</td>
                            <td>{{ row.UserId }}</td>
                            <td>{{ row.MoneySto }}</td>
                            <td>{{ row.MoneyDetail }}</td>
                            <td>{{ row.MoneyCarPort }}</td>
                            <td><span data-toggle="tooltip" data-placement="left" :title="payStatus[row.PayStatus].desk" class="badge" :class="payStatus[row.PayStatus].badge">{{ payStatus[row.PayStatus].small }}</span></td>
                          </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div class="card mb-3 text-center" v-if="!loader && userType == 3" style="width: 16.2rem">
              <div class="card-header">
                <i class="fa fa-users"></i> Количство пользователей:
              </div>
              <div class="card-body">
                <h3>{{countUsers}}</h3>
              </div>
            </div>
          <div v-if="userType != 3&&userType != 6&&userType != 8">Статистка для аккаунта: {{ userTypes[userType] }}</div>

          <div class="loader">
            <img src="../assets/load.svg" alt="" width="40" v-if="loader || loaderSmsBalance">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  
  export default {
    name: 'Stats',
    components: {
      headers,
      Breadcrumb
    },
    data() {
      return {
        userTypes: ['', '', '', 'Администратор', 'Логист', 'Экспедитор', 'Бухгалтер', 'Снабжение', 'Менеджер', 'Тех. поддержка', 'Клиент. поддержка'],
        title: 'Статистика',
        rows: [],
        token: localStorage.getItem('token'),
        loader: false,
        loaderSmsBalance: false,
        smsBalance: 0,
        userType: localStorage.getItem('userType'),
        transactions: [],
        payStatus: [
          {badge: 'badge-danger', desk: 'Заказ зарегистрирован, но не оплачен', small: 'Не оплачен'},
          {badge: 'badge-info', desk: 'Предавторизованная сумма захолдирована', small: 'Захолдирован'},
          {badge: 'badge-success', desk: 'Заказ успешно оплачен', small: 'Оплачен'},
          {badge: 'badge-danger', desk: 'Авторизация отменена', small: 'Отменен'},
          {badge: 'badge-warning', desk: 'По транзакции была проведена операция возврата', small: 'Возврат'},
          {badge: 'badge-secondary', desk: 'Инициирована авторизация через ACS банка-эмитента', small: 'В процессе'},
          {badge: 'badge-danger', desk: 'Авторизация отклонена', small: 'Отклонен'},
        ],
        StoStat: '',
        table: [],
        countUsers: 'Ошибка получения',
        stoStat1: [],
        stoStat2: {
          today: {
            open: 0,
            send: 0,
            close: 0
          },
          thisWeek: {
            open: 0,
            send: 0,
            close: 0
          },
          thisMonth: {
            open: 0,
            send: 0,
            close: 0
          }
        }
      }
    },
    methods: {
      getCountUsers () {
        if (this.userType != 3) return false
        this.loader = true
        this.$http.get(`${host.host}/Account/CountUser`, {
          headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          if (response.body.error) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model)
          this.countUsers = data
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      formatname (name) {
        return `${name.split(' ')[1]} ${name.split(' ')[0]} ${name.split(' ')[2]}`
      },
      getTransactions () {
        if (this.userType != 6) return false
        this.loader = true
        this.$http.get(`${host.host}/Transactions/All`, {
          headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          if (response.body.error) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model)
          this.transactions = data
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      getStoStatistics () {
        if (this.userType != 8) return false
        this.loader = true
        this.$http.get(`${host.host}/Sto/Statistics`, {
          headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          if (response.body.error) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model)
          this.StoStat = data
          this.createTableData()
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      createTableData () {
        for (let i = 0; this.StoStat.length > i; i++) {
          if (this.StoStat[i].StoOrders.length != 0) {
            for (let j = 0; this.StoStat[i].StoOrders.length > j; j++) {
              this.StoStat[i].StoOrders[j].StoName = this.StoStat[i].StoName
              this.stoStat1.push(this.StoStat[i].StoOrders[j])
            }
          }
          this.stoStat2.today.open = this.StoStat[i].OpenPreOrderToday
          this.stoStat2.thisWeek.open = this.StoStat[i].OpenPreOrderWeek
          this.stoStat2.thisMonth.open = this.StoStat[i].OpenPreOrderMonth
          this.stoStat2.today.send += this.StoStat[i].SendOrderToday
          this.stoStat2.thisWeek.send += this.StoStat[i].SendOrderWeek
          this.stoStat2.thisMonth.send += this.StoStat[i].SendOrderMonth
          this.stoStat2.today.close += this.StoStat[i].CloseOrderToday
          this.stoStat2.thisWeek.close += this.StoStat[i].CloseOrderWeek
          this.stoStat2.thisMonth.close += this.StoStat[i].CloseOrderMonth
        }
        this.stoStat1 = this.stoStat1.sort(function (min, max) {
          return max.OrderId - min.OrderId
        })
      }
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title,
      this.getTransactions()
      this.getStoStatistics()
      this.getCountUsers()
     $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
  .tittle
    margin-top: 55px
  .loader
    width: 100%
    text-align: center
  .container-fluid.dt-bootstrap4
    padding-right: 0px
    padding-left: 0px
    margin-top: 0
  .table
    margin-bottom: 0
  .form-control
    padding: 0px 2px
    border: 0px
  .pagination
    margin-bottom: 0px
  
</style>

<style lang="sass">
  .page-item
    cursor: pointer
  .disabled.page-item
    cursor: auto
</style>
