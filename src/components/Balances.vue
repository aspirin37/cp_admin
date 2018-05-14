<template>
  <div class="Balances">
    <div class="fixed-nav" id="page-top">
      <headers></headers>
  
      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Балансы'" :icon="'fa fa-fw fa-table'"></Breadcrumb>

          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" id="providers-tab" data-toggle="tab" href="#providers">Поставщики</a>
            </li>
            <li class="nav-item" v-if="userType == 6">
              <a class="nav-link" id="sto-tab" data-toggle="tab" href="#sto">СТО</a>
            </li>
            <li class="nav-item" v-if="userType == 6 || userType == 3">
              <a class="nav-link" id="sms-tab" data-toggle="tab" href="#sms">СМС</a>
            </li>
          </ul>

          <div class="tab-content">

            <div class="show active tab-pane fade" id="providers">
              <ProvidersBalances />
            </div>

            <div class="tab-pane fade" id="sto" v-if="userType == 6">
              <StoBalances />
            </div>

            <div class="tab-pane fade" id="sms">
              <div class="text-center" v-if="loaderSmsBalance">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>
              <div style="padding: 0.75rem 1.25rem" v-if="!loaderSmsBalance">
                Баланс СМС: <span class="text-primary">{{ this.smsBalance }}</span>
              </div>
            </div>

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
  import StoBalances from './StoBalances'
  import ProvidersBalances from './ProvidersBalances'
  export default {
    name: 'Balances',
    components: {
      headers,
      Breadcrumb,
      StoBalances,
      ProvidersBalances
    },
    data() {
      return {
        title: 'Балансы',
        token: localStorage.getItem('token'),
        loader: false,
        loaderSmsBalance: false,
        smsBalance: 0,
        userType: localStorage.getItem('userType'),
        stoList: []
      }
    },
    methods: {
      getSmsBalances() {
        this.loaderSmsBalance = true
        this.$http.get(`${host.host}/Balance/sms`, {
          headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loaderSmsBalance = false
          let data = response.body
          this.smsBalance = data
        }, response => {
          this.loaderSmsBalance = false
          toastr.error('Ошибка сервера')
        })
      },
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      if (this.userType != 7) this.getSmsBalances()
      document.title = this.title
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
  
</style>
