<template>
  <div class="modal fade bd-example-modal-lg" id="sto-balance-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Баланс СТО</h5>
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
              <vue-good-table v-if="!loader"
                :columns="columns"
                :rows="rows"
                :paginate="true"
                :defaultSortBy="{field: 'PaymentTime', type: 'desc'}"
                :styleClass="'table custom-table custom-table--modal'">
                <template slot="table-row" slot-scope="props">
                  <td>{{ props.row.PaymentTypeAndId }}</td>
                  <td>{{ props.row.PaymentAmount | formatFunds }}</td>
                  <td>{{ props.row.PartsProfit | formatFunds }}</td>
                  <td>{{ props.row.LaborsProfit | formatFunds }}</td>
                  <td>{{ props.row.CurrentBalance | formatFunds }}</td>
                  <td>{{ props.row.PaymentTime | formatDate}}</td>
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

  export default {
    name: 'StoBalanceModal',
    props: ['stoId'],
    data() {
      return {
        loader: false,
        rows: [],
        columns: [{
          label: 'Операция',
          field: 'OrderId',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number'
        }, {
          label: 'Получено',
          field: 'PaymentAmount',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number',
        }, {
          label: 'C деталей',
          field: 'PartsProfit',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number'
        }, {
          label: 'C работ',
          field: 'LaborsProfit',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number'
        }, {
          label: 'Итоговый баланс',
          field: 'CurrentBalance',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number',
        }, {
          label: 'Дата оплаты',
          field: 'PaymentTime',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date',
        }]
      }
    },

    methods: {
      getStoBalance() {
        this.$http.get(`${host.host}/Sto/${this.stoId}/BalanceHistory`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) return toastr.error('Не удалось получить данные')
          let data = JSON.parse(response.body.model)
          this.rows = data

          this.rows
            .forEach( function (it) {
              switch (it.PaymentType) {
                case 1: 
                  it.PaymentTypeAndId = 'Заказ №' + it.OrderId 
                  break
                case 2: 
                  it.PaymentTypeAndId = 'Пл. поручение №' + it.OrderId 
                  break
                case 0:
                  it.PaymentTypeAndId = 'Кэш'
                  break
              }
            })
          console.log(data)

          this.loader = false
        }, response => {
          this.loader = false
          toastr.error('Не удалось получить данные')
        })
      },
    },
    created() {
      let self = this
      $(document).on('show.bs.modal', '#sto-balance-modal', function () {
        self.loader = true
      });
      $(document).on('shown.bs.modal', '#sto-balance-modal', function () {
        self.getStoBalance()
      });
    }
  }
</script>

<style lang="sass">

  .custom-table--modal
    margin-top: -15px !important

  .loader-block
    padding: 25px 0

  .modal-lg
    max-width: 85%

</style>

