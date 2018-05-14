<template>
  <div class="Reg">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb title="Статистика" icon="fa fa-fw fa-bar-chart"></Breadcrumb>

          <div class="text-center" v-if="loader">
            <img src="../assets/load.svg" alt="load gif" width="40">
          </div>

          <div class="card" v-for="(stat, i) in statistics" v-if="!loader">
            <div class="card-header" style="padding: 0">
              <h5 class="mb-0">
                <button class="btn btn-link" data-toggle="collapse" :data-target="'#card_' + i">
                  {{ stat.sectionName }}
                </button>
              </h5>
            </div>

            <div :id="'card_' + i" class="collapse show">
              <ul class="list-group">
                <li v-for="row in stat.sectionItems" class="list-group-item d-flex">
                  <span class="col-lg-8">{{ row.fieldName }}</span>
                  <div>
                    <span class="badge badge-pill badge-primary">{{ row.fieldValue }}</span>
                  </div>
                </li>
              </ul>
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

export default {
  name: 'Statistics',
  components: {
    headers,
    Breadcrumb
  },
  data() {
    return {
      title: 'Статистика',
      loader: false,
      statistics: []
    }
  },
  methods: {
    getSystemLog () {
      this.loader = true
      this.$http.get( `${host.host}/Statistic/Account`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        this.statistics = response.body
      }, response => {
        this.loader = false
        toastr.error("Ошибка сервера")
      })
    }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title,
    this.getSystemLog()
  }
}
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px

  .list-group-item
    border-left: none
    border-right: none

  .list-group-item:first-child 
    border-top-left-radius: 0
    border-top-right-radius: 0 

</style>