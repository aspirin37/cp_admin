<!-- <template>
  <div class="Sto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>
  
      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Управление / Сотрудники'" :icon="'fa fa-fw fa-users'"></Breadcrumb>
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>
              
              <table v-if="!loader" class="table table-bordered dataTable table-sm" width="100%" id="dataTable" cellspacing="0" role="grid" style="width: 100%;margin-top: 15px">
                <thead>
                  <tr role="row">
                    <th class="sorting_asc text-center" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">ID</th>
                    <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Фамилия</th>
                    <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Имя</th>
                    <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Отчество</th>
                    <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Телефон</th>
                  </tr>
                </thead>

                <paginate ref="paginator" name="teamList" :list="teamList" :per="20" tag="tbody">
                  <tr role="row" class="odd" v-for="row in paginated('teamList')">
                    <td class="sorting_1 text-center">{{ row.Id?row.Id:' - ' }}</td>
                    <td>{{ formatName(row.LastName, 'name') }}</td>
                    <td>{{ row.FirstName?row.FirstName:' - ' }}</td>
                    <td>{{ formatName(row.LastName, 'fathername') }}</td>
                    <td>{{ parsePhone(row.PhoneNumber) }}</td>
                  </tr>
                </paginate>
              </table>
              <paginate-links for="teamList" v-if="!loader" :classes="{
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
  </div>
</template>

<script>
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  export default {
    name: 'Team',
    components: {
      headers,
      Breadcrumb
    },
    data() {
      return {
        loader: false,
        title: 'Сотрудники',
        teamList: [],
        paginate: ['teamList']
      }
    },
    methods: {
      parsePhone(phone) {
        return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1($2)$3-$4-$5")
      },
      getAllTeam() {
        this.loader = true
        this.$http.get(`${host.host}/Employee`, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if (response.status == 200) {
            this.loader = false
            if (response.body.error == true) return toastr.error('Ошибка сервера')
            let data = response.body.reverse()
            this.teamList = data
          }
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      formatName (fullName,key) {
        let n = fullName.split(' ')
        switch (key) {
          case 'name':
            if (n.length < 2) return fullName
            return fullName.split(' ')[0]
            break;
          case 'fathername':
            if (n.length < 2) return '-'
            return fullName.split(' ')[1]
            break;
        }
      }
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title
      this.getAllTeam()
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style> -->