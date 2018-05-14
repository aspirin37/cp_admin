 <template>
  <div class="modal fade bd-example-modal-lg" id="supply-details-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Детальная информация</h5>
          <button type="button" class="close cursor-pointer" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-12">
              <div class="loader-block text-center" v-if="loader">
                <img src="../../assets/load.svg" alt="load gif" width="40">
              </div>
              <vue-good-table v-if="!loader"
                :columns="columns"
                :rows="rows"
                :paginate="true"
                :styleClass="'table custom-table custom-table--modal'">
                <template slot="table-row" slot-scope="props">
                  <td>{{ props.row.orderId }}</td>
                  <td>{{ props.row.partNumber }}</td>
                  <td>{{ props.row.partName }}</td>
                  <td>{{ props.row.stationName }}</td>
                  <td v-if="requestType != 1">{{ props.row.creationTime }}</td>
                  <td v-if="requestType == 3">{{ props.row.supplyTime }}</td>
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
  import host from '../../data/host.js'

  export default {
    name: 'SupplyDetails',
    props: ['providerId', 'requestType', 'date'],
    data() {
      return {
        loader: false,
        rows: [],
        columns: [{
          label: 'Ордер',
          field: 'orderId',
          thClass: 'th-class cursor-pointer text-center',
          type: 'number'
        }, {
          label: '№ детали',
          field: 'partNumber',
          thClass: 'th-class cursor-pointer text-center',
          type: 'number'
        }, {
          label: 'Наименование',
          field: 'partName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'СТО',
          field: 'stationName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Дата создания заказа',
          field: 'deliveryTime',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date',
          hidden: this.requestType == 1
        }, {
          label: 'Дата доставки',
          field: 'supplyTime',
          thClass: 'th-class cursor-pointer text-left',
          type: 'date',
          hidden: this.requestType != 3
        }]
      }
    },
    methods: {
      getSupplyDetails() {
        function formatDate(date) {
          return date.slice(8,10) + '.' + date.slice(5,7) + '.' + date.slice(2,4)
        }
        let myDate = this.date.toISOString()
        this.$http.get(`${host.host}/Supply/DeliveryParts/${this.providerId}?dateFor=${myDate}&dType=${this.requestType}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.rows = response.body
          this.rows.map( function (it) {
            it.creationTime = formatDate(it.creationTime)
          })
          this.loader = false
        }, response => {
          this.loader = false
          return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
        })
      },
    },
    created() {
      let self = this
      $(document).on('show.bs.modal', '#supply-details-modal', function () {
        self.loader = true
      });
      $(document).on('shown.bs.modal', '#supply-details-modal', function () {
        self.getSupplyDetails()
      });
    }
  }
</script>

<style lang="sass">

  .custom-table--modal
    margin-top: -15px !important

  .loader-block
    padding: 25px 0

</style>