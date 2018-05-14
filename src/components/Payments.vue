<template>
  <div class="MutualSto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>
  
      <div class="content-wrapper py-3">
        <div class="container-fluid tittle">
          <Breadcrumb :title="'Управление / Платежи'" :icon="'fa fa-fw fa-credit-card'"></Breadcrumb>
          
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
    name: 'Payments',
    components: {
      headers,
      Breadcrumb
    },
    data() {
      return {
        title: 'Платежи',
        rows: [],
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiNzk4MTIyMjIyMjIiLCJpc3MiOiJDYXJQb3J0In0.3vk1OXjk4eNG9dTUOGmv6adwbTY3MX5xsEZ7r_ZGUmU',
        loader: false,
        paginate: ['rows']
      }
    },
    methods: {
      getBalances() {
        this.loader = true
        this.$http.get(`${host.host}/Balances`, {
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
      putBalance(userId, userType, balance) {
        console.log(this.$refs.paginator)
        this.$http.put(`${host.host}/Balances`, {userType:0,UserId:userId,valueDelta:balance}, {
          headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          
          let data = JSON.parse(response.body.model)
          this.rows = data
  
        }, response => {
  
        })
      }
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title,
        this.getBalances()
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .tittle
    margin-top: 55px
  .loader
    width: 100%
    text-align: center
  .container-fluid.dt-bootstrap4
    padding-right: 0px
    padding-left: 0px
  .table
    margin-bottom: 0
  .table td, .table th
   vertical-align: middle
   padding: .35rem
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
