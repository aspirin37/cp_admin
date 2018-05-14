<template>
  <div class="Cars">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Бренды запчастей'" :icon="'fa fa-cog'"></Breadcrumb>
          
          <div class="row">
            <div class="col-md-12">
              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>
              
							<table v-if="!loader" class="table table-bordered dataTable table-sm" width="100%" id="dataTable" cellspacing="0" role="grid" style="width: 100%;margin-top: 15px">
                <thead>
                  <tr role="row">
                    <th class="sorting_asc text-center" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">ID</th>
                    <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Название</th>
                    <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Адрес</th>
                    <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Телефон</th>
                  </tr>
                </thead>

                <paginate ref="paginator" name="tradersList" :list="tradersList" :per="20" tag="tbody">
                  <tr role="row" class="odd" v-for="row in paginated('tradersList')">
                    <td class="sorting_1 text-center">{{ row.Id?row.Id:' - ' }}</td>
                    <td>{{ row.Name?row.Name:' - ' }}</td>
                    <td>{{ row.Address?row.Address:' - ' }}</td>
                    <td>{{ row.Phone?row.Phone:' - ' }}</td>
                  </tr>
                </paginate>
              </table>
              <paginate-links for="tradersList" v-if="!loader" :classes="{
                    'ul': ['pagination','justify-content-start'],
                    'li': 'page-item',
                    'a': 'page-link'
                  }" :show-step-links="true" :hide-single-page="true" :step-links="{
                    next: '>',
                    prev: '<'
                  }">
              </paginate-links>
            </div>            
          </div>
        </div>
      </div>
    </div>
    <editModal :carModel='carModel'></editModal>
  </div>
</template>

<script>
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import host from '../data/host.js'
export default {
  name: 'Cars',
  components: {
    headers,
    Breadcrumb
  },
  data() {
    return {
      title: 'Бренды запчастей',
      token: localStorage.getItem('token'),
      loader: false,
      tradersList: [],
      paginate: ['tradersList']
    }
  },
  methods: {
    getAllTraders() {
      this.loader = true
      this.$http.get(`${host.host}/Trader/PartProviders`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.loader = false
        if(response.body.error == true) return toastr.error('Ошибка сервера')
        let data = JSON.parse(response.body.model).reverse()
        this.tradersList = data.sort(function (min, max) {
					return min.Id - max.Id
				})
      }, response => {
        this.loader = false
        toastr.error('Ошибка сервера')
      })
    },
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title
    this.getAllTraders()
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
  .block
    display: block
</style>
