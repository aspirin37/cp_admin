<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="text-center" v-if="loader">
          <img src="../assets/load.svg" alt="load gif" width="40">
        </div>
        <vue-good-table v-if="!loader"
          :globalSearch="true"
          :globalSearchPlaceholder="'Поиск по ключевому слову'"
          :columns="columns"
          :rows="stoList"
          :paginate="true"
          :defaultSortBy="{field: 'StoId', type: 'asc'}"
          :styleClass="'table custom-table'">
          <template slot="table-row" slot-scope="props">
            <td>
              <a href="#" @click="openStoBalanceModal(props.row.StoId)">
                {{ props.row.StoId }}
              </a>
            </td>
            <td>{{ props.row.Name }}</td>
            <td>{{ props.row.Balance | formatFunds }}</td>
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
    name: 'StoBalances',
    components: {
      StoBalanceModal
    },
    data() {
      return {
        loader: false,
        stoId: 0,
        stoList: [],
        rows: [],
        columns: [{
          label: 'ID',
          field: 'StoId',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number',
        }, {
          label: 'СТО',
          field: 'Name',
          thClass: 'th-class cursor-pointer',
          type: 'text'
        }, {
          label: 'Баланс',
          field: 'Balance',
          thClass: 'th-class cursor-pointer text-left',
          type: 'decimal'
        }],
      }
    },
    methods: {
      getStoList () {
        this.loader = true
        this.$http.get(`${host.host}/Admin/StoBalance`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          if (response.body.error) return toastr.error('Не удалось получить список СТО')
          let data = JSON.parse(response.body.model)
          this.stoList = data
        }, response => {
          this.loader = false
          toastr.error('Не удалось получить список СТО')
        })
      },
      getStoBalances () {
        this.$http.get(`${host.host}/Sto/GetAllStoForLanding`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          if (response.body.error) return toastr.error('Не удалось получить балансы СТО')
          let data = JSON.parse(response.body.model)
          this.rows = data
        }, response => {
          this.loader = false
          toastr.error('Не удалось получить балансы СТО')
        })
      },
      openStoBalanceModal (id) {
        this.stoId = id
        $('#sto-balance-modal').modal('show')
      }
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      this.getStoList()
    }
  }
</script>

<style scoped src="../assets/admin.css"></style>

<style lang="sass">
  .custom-link
    color: #007bff !important
    cursor: pointer !important

  .custom-link:hover
    text-decoration: underline !important

  .custom-datepicker
    margin-bottom: 0.25rem
    width: 210px

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


