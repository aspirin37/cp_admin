<!-- <template>
  <div class="Sto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Ордера'" :icon="'fa fa-fw fa-list'"></Breadcrumb>
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>
              <b-form-checkbox class="float-right" id="myWorkDaysStatus" v-if="!loader"
                v-model="isReadFilter">
                  Только непрочитанные
              </b-form-checkbox>
              <vue-good-table v-if="!loader"
                :columns="columns"
                :rows="rows"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                :paginate="true"
                :rowStyleClass="rowStyles"
                :styleClass="'table custom-table'">
                <template slot="table-row" scope="props">
                  <td>{{ props.row.user }}</td>
                  <td>{{ props.row.orderId + '' +  props.row.PreorderId}}</td>
                  <td>{{ props.row.timeStoSelected }}</td>
                  <td>{{ props.row.change }}</td>
                  <td>{{ props.row.stoName }}</td>
                  <td>{{ props.row.statusOrder }}</td>
                  <td>{{ props.row.detailStatus }}</td>
                  <td>{{ props.row.workStatus }}</td>
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
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'

  export default {
    name: 'Test',
    components: {
      headers,
      Breadcrumb,
    },
    data() {
      return {
        
      }
    }
  }
</script> -->