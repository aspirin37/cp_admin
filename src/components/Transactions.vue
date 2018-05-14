<template>
  <div class="Transactions">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid topmargin">
          <Breadcrumb :title="'Транзакции'" :icon="'fa fa-fw fa-dashboard'" style="display:none"></Breadcrumb>
          <div class="loader">
            <img src="../assets/load.svg" alt="" width="40" v-if="loader">
          </div>
          <div class=" mb-3" v-if="!loader">
            <div class="card-header">
              <i class="fa fa-table"></i> Транзакции
            </div>
            <div class="">
              <table class="table table-bordered table-responsive table-sm" style="overflow-x:auto; display:block;">
                <thead>
                  <tr role="row">
                    <th class="text-center" style="min-width:50px">№</th>
                    <th style="min-width:140px">Дата<a href="#" class="pull-right"><i class="fa fa-sort" aria-hidden="true"></i></a></th>
                    <th style="min-width:50px">UserId</th>
                    <th style="min-width:50px">OrderId</th>
                    <th style="min-width:120px">Сумма, руб.</th>
                    <th style="min-width:600px">Статус</th>
                    <th style="min-width:370px">Id Сбербанка</th>
                    <th style="min-width:135px">MoneySto</th>
                    <th style="min-width:135px">MoneyDetail</th>
                    <th style="min-width:135px">MoneyCarPort</th>
                    <th style="min-width:350px">ReturnUrl</th>
                    <th style="min-width:135px">NameSupplier</th>
                  </tr>
                </thead>
                
                <tbody>
                  <tr role="row" class="odd">
                    <td class="text-center">1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td class="text-right">5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                  </tr>
                </tbody>
                <paginate
                  ref="paginator"
                  name="rows"
                  :list="rows"
                  :per="10"
                  tag="tbody"
                >
                  <tr role="row" class="odd" v-for="(row, indextab) in paginated('rows')" :key="indextab">
                    <td class="text-center">{{ row.Id }}</td>
                    <td>{{ row.TimeOrder | formatDate }}</td>
                    <td>{{ row.UserId }}</td>
                    <td>{{ row.OrderId }}</td>
                    <td class="text-right">{{ row.Amount }}</td>
                    <td>{{ row.Status }}</td>
                    <td>{{ row.IdOrderSberbank }}</td>
                    <td>{{ row.MoneySto }}</td>
                    <td>{{ row.MoneyDetail }}</td>
                    <td>{{ row.MoneyCarPort }}</td>
                    <td>{{ row.ReturnUrl }}</td>
                    <td>{{ row.NameSupplier }}</td>
                  </tr>
                </paginate>
                
              </table>
            </div>
          </div>
          <paginate-links for="rows" v-if="!loader"
            :classes="{
              'ul': ['pagination','justify-content-start'],
              'li': 'page-item',
              'a': 'page-link'
            }"
            :show-step-links="true"
            :hide-single-page="true"
            :step-links="{
              next: '>',
              prev: '<'
            }">
          </paginate-links>
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
  name: 'Transactions',
  components: {
    headers,
    Breadcrumb
  },
  data() {
      return {
          title: 'Транзакции',
          token: localStorage.getItem('token'),
          loader: false,
          rows: [],
          paginate: ['rows']
      }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title
      this.getTransactions()
  },
  methods: {
    getTransactions() {
      this.loader = true
      this.$http.get(`${host.host}/Transactions/All`, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        let data = JSON.parse(response.body.model)
        this.rows = data

      }, response => {

      })
    },
    sortBy(column) {
      
    }
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

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

