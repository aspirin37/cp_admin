<template>
  <div class="Purchase">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Закупка'" :icon="'fa fa-fw fa-money'"></Breadcrumb>
          
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>

              <datepicker
                v-model="date"
                v-on:input="getSupplyData(date)"
                language="ru"
                placeholder="Выберите дату"
                format="dd MMMM yyyy"
                :disabled="disabled"
                :monday-first="true"
                :bootstrap-styling="true"
                wrapper-class="cursor-pointer custom-datepicker"
                input-class="cursor-pointer">
              </datepicker>

              <vue-good-table v-if="!loader"
                :columns="columns"
                :rows="rows"
                :paginate="true"
                :styleClass="'table custom-table'">
                <template slot="table-row" slot-scope="props">
                  <td>{{ props.row.providerId }}</td>
                  <td>{{ props.row.providerName }}</td>
                  <td class="text-center">
                    <a 
                      :class="[props.row.positionsOnStock ? 'custom-link' : '']"
                      title="Подробнее о деталях..."
                      data-toggle="modal"
                      @click="openModal(props.row.providerId, 1)">
                        {{ props.row.positionsOnStock }}
                    </a>
                  </td>
                  <td class="text-center">
                    <a 
                      :class="[props.row.positionsOrdered ? 'custom-link' : '']"
                      title="Подробнее о деталях..."
                      data-toggle="modal"
                      @click="openModal(props.row.providerId, 2)">
                        {{ props.row.positionsOrdered }}
                    </a>
                  </td>
                  <td class="text-center">
                    <a 
                      :class="[props.row.positionsDelivered ? 'custom-link' : '']"
                      title="Подробнее о деталях..."
                      data-toggle="modal"
                      @click="openModal(props.row.providerId, 3)">
                        {{ props.row.positionsDelivered }}
                    </a>
                  </td>
                </template>
              </vue-good-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SupplyDetails 
      :providerId="selectedProviderId"
      :requestType="selectedRequestType"
      :date="date"
    />
  </div>
</div>
</template>

<script>
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import host from '../data/host.js'
import Datepicker from 'vuejs-datepicker';
import SupplyDetails from './modals/SupplyDetails';

export default {
  name: 'Purchase',
  components: {
    headers,
    Breadcrumb,
    Datepicker,
    SupplyDetails
  },
  data() {
    return {
      title: 'Закупка',
      token: localStorage.getItem('token'),
      loader: false,
      selectedProviderId: 0,
      selectedRequestType: 0,
      rows: [],
      date: new Date,
      disabled: {
        from: new Date
      },
      columns: [{
        label: 'ID',
        field: 'providerId',
        thClass: 'th-class th-class--not-bordered cursor-pointer',
        sortFn: this.sortById,
      }, {
        label: 'Поставщик',
        field: 'providerName',
        thClass: 'th-class th-class--not-bordered cursor-pointer',
      }, {
        label: 'На складе',
        field: 'positionsOnStock',
        thClass: 'th-class th-class--not-bordered cursor-pointer text-center',
        sortFn: this.sortById,
      }, {
        label: 'В заказе',
        field: 'positionsOrdered',
        thClass: 'th-class th-class--not-bordered cursor-pointer text-center',
        sortFn: this.sortById,
      }, {
        label: 'Готово к отгрузке',
        field: 'positionsDelivered',
        thClass: 'th-class th-class--not-bordered cursor-pointer text-center',
        sortFn: this.sortById,
      }]
    }
  },
  methods: {
    getSupplyData(date) {
      let myDate = date.toISOString()
      this.$http.get(`${host.host}/Supply/DeliveryParts/ForDay?DateFor=${myDate}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        this.rows = response.body
      }, response => {
        this.loader = false
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    sortById(x, y) {
      return (x < y ? -1 : (x > y ? 1 : 0))
    },
    openModal(id, type) {
      this.selectedProviderId = id
      this.selectedRequestType = type
      $('#supply-details-modal').modal('show')
    }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    this.getSupplyData(this.date)
  },
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

