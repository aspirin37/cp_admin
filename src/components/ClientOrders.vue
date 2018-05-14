<template>
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
                :rows="isReadFilter ? filteredRows : rows"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                :paginate="true"
                :rowStyleClass="rowStyles"
                :styleClass="'table custom-table'">
                <template slot="table-row" slot-scope="props">
                  <td>{{ props.row.userName }}</td>
                  <td>
                    <a href="#" class="text-primary" @click="openOrder(props.row.orderId)" style="margin: 8px; margin-left: 0" v-if="props.row.orderId">
                      {{ props.row.orderId }}
                    </a>
                  </td>
                  <td>{{ props.row.orderCreationTime }}</td>
                  <td>
                    <a href="#" class="text-primary" @click="openPreOrder(props.row.preOrderId)" style="margin: 8px; margin-left: 0" v-if="props.row.preOrderId">
                      {{ props.row.preOrderId}}
                    </a>
                  </td>
                  <td>{{ props.row.preOrderCreationTime }}</td>
                  <td>{{ props.row.stationName }}</td>
                  <td>{{ props.row.statusName }}</td>
                  <td style="padding: 0; width: 50px">
                    <label class="custom-control custom-checkbox"  style="margin: 0 8px">
                      <input id="myWorkDaysStatus" type="checkbox" autocomplete="off" class="custom-control-input" v-model="props.row.isRead" :disabled="props.row.isRead" @change="onCheckbox(props.row.orderId, props.row.preOrderId)">
                      <span aria-hidden="true" class="custom-control-indicator"></span>
                    </label>
                  </td>
                </template>
              </vue-good-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <preorderloader />
    <preorder v-if="preorderInfo" :preOrderId="preorderInfo.Id" />
    <Order v-if="orderInfo" :orderId="orderId" />

    <popuppal v-if="contentInfo" 
      :userId="contentInfo.UserId || contentInfo.UserModel.Id"
      :showInModalTypical="''"
      :detailType="1"
      :data="$store.state.selorder.trees"
      :vehid="contentInfo.UserCarModel.VehicleRecordId"
      :parent="0"
      :wload="$store.state.selorder.workDetailLoader"
      :dload="$store.state.selorder.detailLoader"
      :carInfo="contentInfo.UserCarModel"
    ></popuppal>

  </div>
</template>

<script>
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  import preorderloader from './modals/PreOrderLoader'
  import preorder from './modals/PreOrder'
  import Order from './modals/Order'
  import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
  import popuppal from './popuppal'

  export default {
    name: 'ClientOrders',
    components: {
      headers,
      Breadcrumb,
      preorderloader,
      preorder,
      Order,
      bFormCheckbox,
      popuppal
    },
    data() {
      return {
        title: 'Ордера',
        loader: false,
        preOrderLoader: false,
        isTableCreated: false,
        isReadFilter: false,
        requestUrl: 'Order',
        isOrder: true,
        orderId: 0,
        preorderId: 0,
        notifications: 0,
        orderInfo: '',
        preorderInfo: '',
        contentInfo: '',
        clientOrders: '',
        columns: [{
          label: 'Клиент',
          field: 'userName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Ордер',
          field: 'orderId',
          thClass: 'th-class cursor-pointer',
          sortFn: this.sortById,
        }, {
          label: '',
          field: 'orderCreationTime',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Преордер',
          field: 'preOrderId',
          thClass: 'th-class cursor-pointer',
          sortFn: this.sortById,
        }, {
          label: '',
          field: 'preOrderCreationTime',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'СТО',
          field: 'stationName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Статус',
          field: 'statusName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: '',
          field: 'isReadField',
          thClass: 'th-class cursor-pointer',
          sortable: false
        }]
      }
    },
    watch: {
      notifications: function () {
        this.$store.commit('updateClientSupportNotificationsNumber', this.notifications)
        this.notifications !== 0 ? 
        document.querySelector("link[rel='shortcut icon']").href = "/static/faviconotif.png" : 
        document.querySelector("link[rel='shortcut icon']").href = "/static/favicon.png"
      }
    },
    computed: {
      rows() {
        // let self = this
        let notifications = 0

        let formatDateTime = (date) => {
          let formattedDate = date.slice(8,10) + '.' + date.slice(5,7) + '.' + date.slice(2,4)
          let formattedTime = date.slice(11,13) + ':' + date.slice(14,16)
          let formattedDateTime = formattedDate + '\n в\u00A0' + formattedTime
          return formattedDateTime
        }

       return this.clientOrders.map((it) => {
          it.orderCreationTime = formatDateTime(it.orderCreationTime)
          it.preOrderCreationTime = formatDateTime(it.preOrderCreationTime)
          if (!it.isRead) notifications++
          this.notifications = notifications
          return it
        })
      },
      filteredRows () {
        return this.rows.filter((it) => !it.isRead)
      }
    },
     watch: {
      notifications: function () {
        this.$store.commit('updateClientSupportNotificationsNumber', this.notifications)
        this.notifications !== 0 ? 
        document.querySelector("link[rel='shortcut icon']").href = "/static/faviconotif.png" : 
        document.querySelector("link[rel='shortcut icon']").href = "/static/favicon.png"
      }
    },
    methods: {
      getClientOrders() {
        if (!this.isTableCreated) {
          this.loader = true
          this.isTableCreated = true
        }
        this.$http.get(`${host.host}/Order/Support`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.loader = false
          this.clientOrders = response.body
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      onCheckbox (orderId, preOrderId) {

        let readOrderUrl = `${host.host}/Order/${orderId}/Read/`
        if (!orderId) readOrderUrl = `${host.host}/PreOrder/${preOrderId}/Read`

        this.$http.put(readOrderUrl, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.notifications--
          return toastr.success('Сообщение прочитано!')
        }, response => {
          return toastr.error('Ошибка сервера')
        })
      },
      rowStyles(row){ 
        return (!row.isRead) ? 'bg-light' : ''
      },
      openOrder(id) {
        this.preOrderLoader = true
        this.orderInfo = ''
        this.contentInfo = ''
        this.orderId = 0
        this.requestUrl = '/Order/'
        this.isOrder = true
        $("#createPreOrderLoader").modal('show')
        this.$http.get(`${host.host}/Order/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.preOrderLoader = false
          if(response.body.error == true) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model)
          this.orderInfo = data
          this.orderId = id
          this.contentInfo = data
          $("#createPreOrderLoader").modal('hide')
          setTimeout(function() {
            $("#Order").modal('show')
          }, 1000)
        }, response => {
          this.preOrderLoader = false
          return toastr.error('Ошибка сервера')
        })
      },
      openPreOrder(id) {
        this.preOrderLoader = true
        this.preorderInfo = ''
        this.orderInfo = ''
        this.contentInfo = ''
        this.orderId = 0
        this.requestUrl = '/PreOrder/'
        this.isOrder = false
        // $("#createPreOrderLoader").modal('show')
        this.$http.get(`${host.host}/PreOrder/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.preOrderLoader = false
          if(response.body.error == true) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model)
          this.preorderInfo = data
          // this.orderInfo = data
          this.contentInfo = data
          this.orderId = id
          $("#createPreOrderLoader").modal('hide')
          setTimeout(function() {
            $("#PreOrder").modal('show')
          }, 1000)
        }, response => {
          this.preOrderLoader = false
          return toastr.error('Ошибка сервера')
        })
      },
      sortById(x, y) {
        return (x < y ? -1 : (x > y ? 1 : 0))
      },
      addPatrAndLabotToPrreOrder() {
        $("#addPartOrLaborModal").modal('hide')
        setTimeout(() => {
          if (this.orderPreorder == 0){ 
            $('#Order').modal('show')
            // $('#orderRefreshLabors').click()
          }
          if (this.orderPreorder == 1){
            $('#PreOrder').modal('show')
            // $('#preorderRefreshLabors').click()
          }
        }, 500)
        if(this.$store.state.selorder.addedLabor.length != 0 || this.$store.state.selorder.addedTypical.length != 0) {
          this.$store.state.selorder.updateWork = true
        }
        if(this.$store.state.selorder.addedDetail.length != 0 || this.$store.state.selorder.addedFav.length != 0) {
          this.$store.state.selorder.updateDetail = true
        }
        this.sendNewDetail()

      },
      sendNewDetail() {
        if(this.$store.state.selorder.addedDetail.length == 0) return this.sendNewLabor()
          let addedParts = []
        if (this.isOrder) {
          for(let i=0;i<this.$store.state.selorder.addedDetail.length;i++) {
            addedParts.push({
              "pId": this.$store.state.selorder.addedDetail[i].Id,
              "newCount": this.$store.state.selorder.addedDetail[i].Amount
            })
          }
        } else {
          for(let i=0;i<this.$store.state.selorder.addedDetail.length;i++) {
            addedParts.push({"catalogPart": Object.assign({}, this.$store.state.selorder.addedDetail[i])})
            addedParts[i].amount = this.$store.state.selorder.addedDetail[i].Amount
          }
        }

        this.$http.post(`${host.host + this.requestUrl + this.orderId}/Parts?ucId=${this.contentInfo.UserCarModel.Id}`, addedParts, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if(response.data.error) {
            if(response.body.message == "Logistic part for current car not found") toastr.info('В данный момент детали нет в продаже')
              else toastr.error('Ошибка при добавлении детали')
                return this.$store.state.selorder.updateDetail = false
            }
            let data = JSON.parse(response.data.model)
            if(this.$store.state.selorder.addedFav.length == 0) this.$store.state.selorder.updateDetail = false
              this.$store.state.selorder.orders = data
            this.$store.state.selorder.addedDetail = []
            this.orderPreorder == 0 ? $('#orderRefreshDetails').click() : $('#preorderRefreshDetails').click()
            return this.sendNewLabor()
          }, response => {
            toastr.error('Ошибка при добавлении детали')
            return this.$store.state.selorder.updateDetail = false
          })
      },
      sendNewLabor() {
        if(this.$store.state.selorder.addedLabor.length == 0) return this.sendNewTypical()

          let addedLabors = []
        for(let i=0;i<this.$store.state.selorder.addedLabor.length;i++) {
          addedLabors.push({
            laborId: this.$store.state.selorder.addedLabor[i].Id,
            amount: 1,
            fromPartId: this.$store.state.selorder.addedLabor[i].FromPartId,
            fromPartCatalogType: 0
          })
        }
        this.$http.post(`${host.host + this.requestUrl + this.orderId}/Labors/${this.contentInfo.UserCarModel.Id}`, addedLabors, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if(response.data.error) {
            this.$store.state.selorder.updateWork = false
            return toastr.error('Ошибка при добавлении работы')
          }
          let data = JSON.parse(response.data.model)
          if(this.$store.state.selorder.addedTypical.length == 0) this.$store.state.selorder.updateWork = false
            this.$store.state.selorder.orders = data
          this.$store.state.selorder.addedLabor = []
            this.orderPreorder == 0 ? $('#orderRefreshLabors').click() : $('#preorderRefreshLabors').click()
          toastr.success('Выбранные работы успешно добавлены!')
          this.sendNewTypical()
        }, response => {
          this.$store.state.selorder.updateWork = false
          return toastr.error('Ошибка при добавлении работы')
        })
      },
      sendNewTypical() {
        if(this.$store.state.selorder.addedTypical.length == 0) return this.sendNewFav()
          let addedTypical = []
        this.$store.state.selorder.updateWork = true
        for(let i=0;i<this.$store.state.selorder.addedTypical.length;i++) {
          addedTypical.push({
            laborId: this.$store.state.selorder.addedTypical[i].Id,
            amount: 1,
            fromPartId: 0
          })
        }
        this.$http.post(`${host.host + this.requestUrl + this.orderId}/TypicalLabors/${this.contentInfo.UserCarModel.Id}`, addedTypical, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          let data = JSON.parse(response.data.model)
          this.$store.state.selorder.updateWork = false
          this.$store.state.selorder.orders = data
          console.log('DATA')
          console.log(data)
          this.$store.state.selorder.addedTypical = []
          this.sendNewFav()
          this.orderPreorder == 0 ? $('#orderRefreshLabors').click() : $('#preorderRefreshLabors').click()
          return toastr.success('Выбранные общие работы успешно добавлены!')
        }, response => {
          this.$store.state.selorder.updateWork = false
          return toastr.error(response.body.message)
        })
      },
      sendNewFav() {
        if(this.$store.state.selorder.addedFav.length == 0) return false
          let favArr = []
        for(let i=0;i<this.$store.state.selorder.addedFav.length;i++) {
          favArr.push({
            pId: this.$store.state.selorder.addedFav[i].Id,
            newCount: 1
          })
        }

        this.$store.state.selorder.updateDetail = true
        this.$http.post(`${host.host + this.requestUrl + this.orderId}/FavPart`, favArr, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if(response.body.error == true) {
            this.$store.state.selorder.updateDetail = false
            return toastr.error(response.body.message)
          }
          let data = JSON.parse(response.data.model)
          this.$store.state.selorder.updateDetail = false
          this.$store.state.selorder.orders = data
          this.addedFav = []
          this.orderPreorder == 0 ? $('#orderRefreshDetails').click() : $('#preorderRefreshDetails').click()
          return toastr.success('Выбранные избранные детали успешно добавлены!')
        }, response => {
          this.$store.state.selorder.updateDetail = false
          return toastr.error(response.body.message)
        })
      },

//       addPatrAndLabotToPrreOrder() {

//         // $("#createPreOrderLoader").modal('show')
        
//         setTimeout(() => {
//           if (this.orderPreorder == 0){ 
//             $('#Order').modal('show')
//             $('#orderRefreshLabors').click()
//           }
//           if (this.orderPreorder == 1){
//             $('#PreOrder').modal('show')
//             $('#preorderRefreshLabors').click()
//           }
//         }, 500)

//         if(this.$store.state.selorder.addedLabor.length != 0 || this.$store.state.selorder.addedTypical.length != 0) {
//           this.$store.state.selorder.updateWork = true
//         }
//         if(this.$store.state.selorder.addedDetail.length != 0 || this.$store.state.selorder.addedFav.length != 0) {
//           this.$store.state.selorder.updateDetail = true
//         }

//         this.sendNewDetail()
        
//       },

//       sendNewDetail() {
//         if(this.$store.state.selorder.addedDetail.length == 0) return this.sendNewLabor()

//           let addedParts = []

//         if (this.isOrder) {
//           for(let i=0;i<this.$store.state.selorder.addedDetail.length;i++) {
//             addedParts.push({
//               "pId": this.$store.state.selorder.addedDetail[i].Id,
//               "newCount": this.$store.state.selorder.addedDetail[i].Amount
//             })
//           }
//         } else {
//           for(let i=0;i<this.$store.state.selorder.addedDetail.length;i++) {
//             addedParts.push({"catalogPart": Object.assign({}, this.$store.state.selorder.addedDetail[i])})
//             addedParts[i].amount = this.$store.state.selorder.addedDetail[i].Amount
//           }
//         }

//         this.$http.post(`${host.host + this.requestUrl + this.orderId}/Parts?ucId=${this.contentInfo.UserCarModel.Id}`, addedParts, {
//           headers: {
//             'Authorization': 'Bearer ' + localStorage.getItem('token'),
//             'Content-Type' : 'application/json; charset=UTF-8',
//             'Accept' : 'application/json'
//           }
//         }).then(response => {
//           if(response.data.error) {
//             if(response.body.message == "Logistic part for current car not found") toastr.info('В данный момент детали нет в продаже')
//               else toastr.error('Ошибка при добавлении детали')
//                 $("#preOrderLoader").modal('hide')
//                 return this.$store.state.selorder.updateDetail = false
//             }
//             let data = JSON.parse(response.data.model)

// //------------------------------

//             $("#createPreOrderLoader").modal('hide')
//           // если был открыт заказ или предзаказ // сия дичь потому что я не знаю как обновить эти долбаные детальки при добавлении
//           if (this.orderPreorder == 0){ 
//             $('#Order').modal('show')
//             $('#orderRefreshDetails').click() 
//           }
//           if (this.orderPreorder == 1){ 
//             $('#PreOrder').modal('show')
//             $('#preorderRefreshDetails').click() 
//           }

//           if(this.$store.state.selorder.addedFav.length == 0) this.$store.state.selorder.updateDetail = false
//             this.$store.state.selorder.orders = data
//           this.$store.state.selorder.addedDetail = []
//           return this.sendNewLabor()
//         }, response => {
//           $("#createPreOrderLoader").modal('hide')
//           toastr.error('Ошибка при добавлении детали')
//           return this.$store.state.selorder.updateDetail = false
//         })
//       },

//       sendNewLabor() {
//         if(this.$store.state.selorder.addedLabor.length == 0) return this.sendNewTypical()

//           let addedLabors = []
//         for(let i=0;i<this.$store.state.selorder.addedLabor.length;i++) {
//           addedLabors.push({
//             laborId: this.$store.state.selorder.addedLabor[i].Id,
//             amount: 1,
//             fromPartId: this.$store.state.selorder.addedLabor[i].FromPartId,
//             fromPartCatalogType: 0//this.$store.state.selorder.addedLabor[i].fromPartCatalogType
//           })
//         }
//         this.$http.post(`${host.host + this.requestUrl + this.orderId}/Labors/${this.contentInfo.UserCarModel.Id}`, addedLabors, {
//           headers: {
//             'Authorization': 'Bearer ' + localStorage.getItem('token'),
//             'Content-Type' : 'application/json; charset=UTF-8',
//             'Accept' : 'application/json'
//           }
//         }).then(response => {
//           if(response.data.error) {
//             this.$store.state.selorder.updateWork = false
//             return toastr.error('Ошибка при добавлении работы')
//           }
//           let data = JSON.parse(response.data.model)

//           $("#createPreOrderLoader").modal('hide')
//           if (this.orderPreorder == 0){ 
//             $('#Order').modal('show')
//             $('#orderRefreshLabors').click()
//           }
//           if (this.orderPreorder == 1){
//             $('#PreOrder').modal('show')
//             $('#preorderRefreshLabors').click()
//           }

//           if(this.$store.state.selorder.addedTypical.length == 0) this.$store.state.selorder.updateWork = false
//             this.$store.state.selorder.orders = data
//           this.$store.state.selorder.addedLabor = []
//           toastr.success('Выбранные работы успешно добавлены!')
//           this.sendNewTypical()
//         }, response => {
//           this.$store.state.selorder.updateWork = false
//           return toastr.error('Ошибка при добавлении детали')
//         })
//       },

//       sendNewTypical() {
//         if(this.$store.state.selorder.addedTypical.length == 0) return this.sendNewFav()
//           let addedTypical = []
//         this.$store.state.selorder.updateWork = true
//         for(let i=0;i<this.$store.state.selorder.addedTypical.length;i++) {
//           addedTypical.push({
//             laborId: this.$store.state.selorder.addedTypical[i].Id,
//             amount: 1,
//             fromPartId: 0
//           })
//         }
//         this.$http.post(`${host.host + this.requestUrl + this.orderId}/TypicalLabors/${this.contentInfo.UserCarModel.Id}`, addedTypical, {
//           headers: {
//             'Authorization': 'Bearer '  + localStorage.getItem('token'),
//             'Content-Type' : 'application/json; charset=UTF-8',
//             'Accept' : 'application/json'
//           }
//         }).then(response => {
//           let data = JSON.parse(response.data.model)

//           $("#createPreOrderLoader").modal('hide')
//           if (this.orderPreorder == 0){ 
//             $('#Order').modal('show')
//             $('#orderRefreshLabors').click()
//           }
//           if (this.orderPreorder == 1){
//             $('#PreOrder').modal('show')
//             $('#preorderRefreshLabors').click()
//           }

//           this.$store.state.selorder.updateWork = false
//           this.$store.state.selorder.orders = data
//           this.$store.state.selorder.addedTypical = []
//           this.sendNewFav()
//           return toastr.success('Выбранные общие работы успешно добавлены!')
//         }, response => {
//            $("#createPreOrderLoader").modal('hide')
//           this.$store.state.selorder.updateWork = false
//           return toastr.error('Ошибка сервера')
//         })
//       },

//       sendNewFav() {
//         // $('#createPreOrderLoader').modal('show')
//         if(this.$store.state.selorder.addedFav.length == 0) return false
//           let favArr = []
//         for(let i=0;i<this.$store.state.selorder.addedFav.length;i++) {
//           favArr.push({
//             pId: this.$store.state.selorder.addedFav[i].Id,
//             newCount: 1
//           })
//         }

//         this.$store.state.selorder.updateDetail = true
//         this.$http.post(`${host.host + this.requestUrl + this.orderId}/FavPart`, favArr, {
//           headers: {
//             'Authorization': 'Bearer '  + localStorage.getItem('token'),
//             'Content-Type' : 'application/json; charset=UTF-8',
//             'Accept' : 'application/json'
//           }
//         }).then(response => {
//           if(response.body.error == true) {
//             this.$store.state.selorder.updateDetail = false
//             return toastr.error('Ошибка сервера')
//           }
//           let data = JSON.parse(response.data.model)

//           if (this.orderPreorder == 0){ 
//             $('#Order').modal('show')
//             $('#orderRefreshDetails').click() 
//           }
//           if (this.orderPreorder == 1){ 
//             $('#PreOrder').modal('show')
//             $('#preorderRefreshDetails').click() 
//           }


//           $("#createPreOrderLoader").modal('hide')
//           this.$store.state.selorder.updateDetail = false
//           this.$store.state.selorder.orders = data
//           this.addedFav = []
//           return toastr.success('Выбранные избранные детали успешно добавлены!')
//         }, response => {
//           this.$store.state.selorder.updateDetail = false
//           $('#createPreOrderLoader').modal('hide')
//           return toastr.error('Ошибка сервера')
//         })
//       },
    
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      this.getClientOrders()
      setInterval(this.getClientOrders, 60000)
    },
    mounted() {
      this.$on('addDeAndLa', function(data) {
        this.$store.state.selorder.addedTypical = data.typical
        this.$store.state.selorder.addedDetail = data.detail
        this.$store.state.selorder.addedLabor = data.labor
        this.$store.state.selorder.addedFav = data.fav

        this.addPatrAndLabotToPrreOrder()
      })
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style lang="sass">

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

  .th-width-limit
    width: 150px !important

  td
    border-top: 0 !important
    border-bottom: 1px solid #ddd !important

  .table-footer
    background-color: white !important
    border: 0 !important

</style>

