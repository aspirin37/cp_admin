<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="text-center" v-if="loader">
          <img src="../assets/load.svg" alt="load gif" width="40" style="margin-top: 20px">
        </div>
        <vue-good-table v-if="!loader"
          :globalSearch="true"
          :globalSearchPlaceholder="'Поиск по ключевому слову'"
          :columns="columns"
          :rows="providersList"
          :paginate="true"
          :defaultSortBy="{field: 'StoId', type: 'asc'}"
          :styleClass="'table custom-table'">
          <template slot="table-row" slot-scope="props">
            <td>{{ props.row.supplierId }}</td>
            <td>{{ props.row.supplierName }}</td>
            <td>{{ props.row.lastTime | formatDate }}</td>
            <td :class="[props.row.error ? 'text-danger' : '']">{{ props.row.formattedError }}</td>
            <td>{{ props.row.balance | formatFunds }}</td>
            <td style="padding: 0; width: 50px">
              <label class="custom-control custom-checkbox"  style="margin: 0 8px">
                <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="props.row.enabled" @change="enableProvider(props.row.supplierId, props.row.enabled)">
                <span aria-hidden="true" class="custom-control-indicator"></span>
              </label>
            </td>
          </template>
        </vue-good-table>
      </div>
    </div>
    <StoBalanceModal :stoId="stoId" />
  </div>
</template>

<script>
  import host from '../data/host.js'
  import StoBalanceModal from './modals/StoBalanceModal'

  export default {
    name: 'ProvidersBalances',
    components: {
      StoBalanceModal
    },
    data() {
      return {
        loader: false,
        stoId: 0,
        providersList: [],
        rows: [],
        columns: [{
          label: 'ID',
          field: 'supplierId',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number'
        }, {
          label: 'Поставщик',
          field: 'supplierName',
          thClass: 'th-class cursor-pointer'
        }, {
          label: 'Дата обновления',
          field: 'lastTime',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date'
        }, {
          label: 'Ошибка',
          field: 'formattedError',
          thClass: 'th-class cursor-pointer'
        }, {
          label: 'Баланс',
          field: 'balance',
          thClass: 'th-class cursor-pointer text-left',
          type: 'decimal'
        }, {
          label: '',
          field: 'enabled',
          thClass: 'th-class cursor-pointer',
        }],
      }
    },
    methods: {
      getProvidersList () {
        this.loader = true
        this.$http.get(`${host.host}/TraderProvider/GetBalancesOnProviders`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          this.providersList = response.body
          this.providersList.forEach((it) => {
            it.error ? it.formattedError = 'Да' : it.formattedError = 'Нет'
          })
        }, response => {
          this.loader = false
          toastr.error('Не удалось получить список СТО')
        })
      },
      enableProvider (id, enabled) {
        this.$http.put(`${host.host}/Supply/ProviderState?supplierId=${id}&enabled=${enabled}`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          return response.body ? toastr.success('enabled!') : toastr.success('disabled!')
        }, response => {
          return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
        })
      },
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      this.getProvidersList()
    }
  }
</script>

<style scoped src="../assets/admin.css"></style>

<style lang="sass">
  .cursor-pointer 
    cursor: pointer

  .th-class
    padding: 8px !important
    font-size: 14px !important
    line-height: 1.42857143 !important
    background-color: white !important
    border-bottom: 1px solid #ddd !important
    padding-top: 18px !important
    padding-bottom: 20px !important

  .th-class--not-bordered
    border-top: 0 !important

  .th-width-limit
    width: 150px !important

  td
    border-top: 0 !important
    border-bottom: 1px solid #ddd !important

  .table-footer
    background-color: white !important
    border: 0 !important

</style>