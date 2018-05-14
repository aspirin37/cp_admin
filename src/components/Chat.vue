<template>
  <div class="Chat">
    <div class="fixed-nav" id="page-top">
      <headers></headers>
  
      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Диалоги'" :icon="'fa fa-fw fa-comments'"></Breadcrumb>
          <div class="row">
            <div class="loader">
              <img src="../assets/load.svg" alt="" width="40" v-if="loader">
            </div>
            <div class="col-lg-4" v-if="!loader">
              <div class="card mb-3">
                <div class="card-header">Диалоги</div>
                <div class="list-group list-group-flush small" style="max-height: 485px;overflow-y: auto;">
                  <a href="#" class="list-group-item list-group-item-action" :data-user="`user`+dialog.userId" v-for="(dialog, index) in filterDialogs" :key="index" @click="openDialog(dialog.userId, dialog.nameUser)" v-if="dialog != undefined">
                    <div class="media">
                      <img class="d-flex mr-3 rounded-circle" src="https://placehold.it/45x45" alt="">
                      <div class="media-body">
                        
                        <strong>{{ dialog.nameUser==' '?'Ринат':dialog.nameUser }}</strong><br>
                        <span v-if="dialog.unread" class="pull-right">•</span>
                        <i v-if="dialog.nameUser==' '" class="fa fa-paw pull-right" aria-hidden="true"></i>
                        <span v-if="dialog.message != ''">{{ dialog.message.length > 70?dialog.message.slice(0,70)+'...':dialog.message }}</span>
                        <span v-if="dialog.message == '' && dialog.image">[Прикрепление]</span>
                        <div class="text-muted smaller">{{ dialog.timeMessage | formatDate }}</div>
                      </div>
                    </div>
                  </a>
                </div>

                <button @click="deleteChat">Очистить чат (тест)</button>
              </div>
            </div>
            <div class="openDialogLoader">
              <img src="../assets/load.svg" alt="" width="40" v-if="openDialogLoader">
            </div>
            <div class="col-lg-8" v-if="!loader && !openDialogLoader">
              <div class="card mb-3" v-if="activeDialogs.length !=0">
                <div class="card-header">Текущий чат c <b>{{activeDialogs[0].nameUser}}</b></div>
                <!--<div class="card-body text-center" style="max-height: 50vh;overflow-y: auto;">
                    <span>Выберите час слева</span>
                </div>-->

                <div class="card-body" style="padding-top:10px;">
                  <div class="card-body small bg-faded" style="padding: 0;">
                    <div class="chat">
  
                      
                      <div class="media mb-2" v-for="(message, indexMessage) in activeDialogs" :key="indexMessage">
                        <img v-if="message.nameUser == 'Вы'" class="d-flex mr-3" src="../../static/favicon.png" alt="">
                        <img v-else class="d-flex mr-3" src="https://placehold.it/45x45" alt="">
                        <div class="media-body">
                          <span class="pull-right text-muted">{{message.timeMessage | formatDate}}</span>
                          <h6 class="mt-0 mb-1">
                            <a>{{ message.nameUser==' '?'Ринат':message.nameUser }}</a>
                          </h6>
  
                          <img v-if="message.image != '' && message.image != null && message.image != undefined && message.image != 'undefined'"  :src="host.host +'/image/'+message.image" />
                          <p class="mb-0">{{message.message}}</p>
                          <a href="#" @click="getOrder(message.OrderId)" v-if="message.OrderId" data-toggle="modal" data-target="#openOrder">Заказ №{{ message.OrderId }}</a>
                          <img v-if="message.image != '' && message.image != null && message.image != undefined && message.image != 'undefined'" v-img="{group:'my-group'}" :src="'data:image/jpeg;base64,'+message.image" />
                        </div>
                      </div>
                    </div>
                    <hr style="margin-top:1px;">
                    <div class="form-group">
                      <textarea v-model.trim="messageText" @keydown="inputHandler" class="form-control" rows="4" style="resize: none;" placeholder="Написать сообщение"></textarea>
                    </div>
                    <button class="btn btn-success pull-right" :disabled="sendMessLoader || messageText == ''" @click="sendMessage(userId, messageText)"><i class="fa fa-send"></i> Отправить</button>
                    
                    <button class="btn btn-primary" @click="getUserCars(userId)" data-toggle="modal" data-target="#selectCarForPreOrder"><i class="fa fa-plus-circle"></i> Создать предзаказ</button>
                    <span v-if="prpreOrderId"><i>Заказ наряд №{{prpreOrderId}}</i></span>
                    <img class="pull-right" src="../assets/load.svg" alt="" width="40" v-if="sendMessLoader">
                  </div>
                </div>





                <div class="card-footer" style="padding-top:10px;">

                  <h6 v-if="allUserOrders">Активные заказы пользователя:</h6>
                  <div class="loader" v-if="allOrdersLoader">
                    <img src="../assets/load.svg" alt="" width="40">
                  </div>
                  <div v-for="order in allUserOrders" v-if="allUserOrders && !allOrdersLoader">
                    <div v-if="order.State != 'Archive'">
                      <!-- <a href="#" @click="openOrder(order.Id);selorderGetOrderById(order.UserCarModel.UserCarImage.UserCarId);">Заказ №{{ order.Id }}</a> -->
                      <a href="#" @click="getOrder(order.Id);" data-toggle="modal" data-target="#openOrder">Заказ №{{ order.Id }}</a>
                    </div>
                  </div>

                  <h6 v-if="allUserPreorders" style="margin-top: 20px">Предзаказы пользователя:</h6>
                  <div class="loader" v-if="allPreordersLoader">
                    <img src="../assets/load.svg" alt="" width="40">
                  </div>
                  <div v-for="order in allUserPreorders.preOrders" v-if="allUserPreorders && !allPreordersLoader">
                    <div v-if="order.State != 'Archive'">
                      <a href="#" @click="getOrder(order.OrderId);" data-toggle="modal" data-target="#openOrder">Предзаказ №{{ order.Id }}</a>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="card mb-3" v-else>
                <div class="card-header">Диалог не выбран</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="openOrder">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Заказ-наряд №{{ orderId }} <span v-if="orderContent.PreOrderId">(Предзаказ №{{ orderContent.PreOrderId }})</span></h5>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="loader" v-if="loaderOrder">
              <img src="../assets/load.svg" alt="" width="40">
            </div>
            <div v-if="getOrderError">
              <p>{{ getOrderError }}</p>
            </div>
            <div v-if="!loaderOrder && orderContent && !getOrderError">
              <div class="row">
                <div class="col-sm-12 ml-2">
                  <!-- <h4 v-if="orderContent.StatesModel.State && orderContent.StatesModel.State == 'Archive'" style="color: red;"><b>Заказ в архиве</b></h4> -->
                  <h4>Автомобиль</h4>
                  <dl class="row">
                    <span class="col-sm-12">Марка: <strong>{{ orderContent.UserCarModel.Make }} {{ orderContent.UserCarModel.Model }}</strong></span>
                    <span class="col-sm-12">Год: <strong>{{ orderContent.UserCarModel.Year }}</strong></span>
                    <span class="col-sm-12">Цвет: <strong>{{ orderContent.UserCarModel.CarColor }}</strong></span>
                    <span class="col-sm-12">Пробег: <strong>{{ orderContent.UserCarModel.Mileage }}</strong></span>
                    <span class="col-sm-12">Гос. номер: <strong>{{ orderContent.UserCarModel.GosNum }}</strong></span>
                    <span class="col-sm-12">Двигатель: <strong>{{ orderContent.UserCarModel.Engine }}</strong></span>
                    <span class="col-sm-12">Коробка передач: <strong>{{ orderContent.UserCarModel.GearBox }}</strong></span>
                  </dl>
                </div>
                <hr class="h-divider">
                <div class="col-sm-12 ml-2" v-if="orderContent.StoModel">
                  <h4>СТО</h4>
                  <dl class="row">
                    <span class="col-sm-12">Имя: <strong>{{ orderContent.StoModel.Name }}</strong></span>
                    <span class="col-sm-12">Адрес: <strong>{{ orderContent.StoModel.Address }}</strong></span>
                    <span class="col-sm-12">Начало работ: <strong>{{ orderContent.StoModel.WorkStartTime | onlyTime }}</strong></span>
                    <span class="col-sm-12">Окончание работ: <strong>{{ orderContent.StoModel.WorkStopTime | onlyTime  }}</strong></span>
                    <span class="col-sm-12">Нормо-час: <strong>{{ orderContent.StoModel.StdCost }}</strong></span>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addPartOrLaborModal" @click="selorderGetOrderById(orderContent.UserCarModel.Id)">Каталог</button> -->
            <!-- <button v-if="typeOrder='preorder' && orderContent && !getOrderError" type="button" class="btn btn-success" @click="openOrder(orderId); selorderGetOrderById(orderContent.UserCarModel.Id);">Заказ</button> -->
            
            
            <button type="button" class="btn btn-danger" data-dismiss="modal">Отмена</button>
            <button v-if="typeOrder='preorder' && orderContent.PreOrderId && !getOrderError" type="button" class="btn btn-success" @click="openPreOrder(orderContent.PreOrderId); selorderGetOrderById(orderContent.UserCarModel.Id);">Предзаказ №{{orderContent.PreOrderId}}</button>
            <button v-if="typeOrder='preorder' && orderContent && !getOrderError" type="button" class="btn btn-success" @click="openOrder(orderId); selorderGetOrderById(orderContent.UserCarModel.Id);">Заказ №{{orderId}}</button>
          </div>
        </div>
      </div>
    </div>
<!--     <popuppal v-if="orderContent"
      :showInModalTypical="showInModalTypical"
      :detailType="detailType"
      :data="$store.state.selorder.trees"
      :vehid="orderContent.UserCarModel.VehicleRecordId"
      :parent="0"
      :wload="$store.state.selorder.workDetailLoader"
      :dload="$store.state.selorder.detailLoader"
      :carInfo="orderContent.UserCarModel"
      :orderPreorder="orderPreorder"
    ></popuppal> -->

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


    <new-preorder
      :loader="preOrderCarsLoader"
      :carList="preOrderCars"
      :selectCar="selectpreOrderCarId"
    ></new-preorder>


    <preorderloader />
    <preorder v-if="preorderInfo" :preOrderId="preorderInfo.Id" />
    <order v-if="orderInfo" :orderId="orderId" />
  </div>
</template>

<script>
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  import Tree from './Tree'
  import host from '../data/host.js'
  import newPreorder from './modals/newPreorder'
  // import Datepicker from 'vuejs-datepicker'
  import popuppal from './popuppal'
  import preorderloader from './modals/PreOrderLoader'
  import preorder from './modals/PreOrder'
  import order from './modals/Order'
  export default {
    name: 'Chat',
    components: {
      headers,
      Breadcrumb,
      Tree,
      popuppal,
      newPreorder,
      preorderloader,
      preorder,
      order
      // Datepicker
    },
    data() {
      return {
        title: 'Диалоги',
        allUserOrders: [], // Список заказов выбранного в чате юзера
        allUserPreorders: [], // Список предзаказов выбранного в чате юзера
        allOrdersLoader: false,
        allPreordersLoader: false,
        messageText: '',
        dialogs: [],
        sendMessLoader: false,
        activeDialogs: [],
        openDialogLoader: false,
        loader: false,
        userId: 0,
        // orderId: 0,
        orderContent: '',
        loaderOrder: false,
        getOrderError: '',
        showInModalTypical: '',
        detailType: 1,
        preOrderCarsLoader: false,
        preOrderCars: '',
        selectpreOrderCarId: '',
        // orderInfo: '',
        // orderPreorder: 0, // состояние последней открытой модалки для popuppal 0-order 1-preorder
        // preorderInfo: '',
        prpreOrderId: '',
        orOrderId: '',
        typeOrder: '',
        // 
        requestUrl: 'Order',
        isOrder: true,
        orderId: 0,
        preorderId: 0,
        notifications: 0,
        orderInfo: '',
        preorderInfo: '',
        contentInfo: '',
      }
    },
    watch: {
      dialogs: function(val) {

      }
    },
    computed: {
      filterDialogs() {
        return this.dialogs.sort(function(min, max) {
          return Date.parse(max.timeMessage) - Date.parse(min.timeMessage)
        })
      },
      searchTrees() {
        return this.$store.state.selorder.trees
      },
    },
    methods: {
      deleteChat(){
        this.$http.put(`${host.host}/Notif/DeleteUserChats?userId=14`, '', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json'
            }
          }).then(response => {
            if (response.body.error) return toastr.error('Ошибка сервера.')
            else return toastr.success('Чат очищен.')

          }, response => {
            toastr.error('Ошибка сервера.')
          })
      },

      checkAndReloadChat(message){ // проверяем есть ли чат в открытых и перезагружаем список чатов
        let searchTerm = message.userId;
        let findedInDialogs = this.dialogs.filter(item => item.userId == searchTerm)[0] || 'reload'

        if(localStorage.getItem('soket') == 'kek' && findedInDialogs == 'reload'){
          toastr.success(message.nameUser +' начал диалог с вами','',{timeOut: 9999999999})
          this.getDialogs(message.userId)
        } else {

          $('[data-user="user'+message.userId+'"]').addClass('chat_item-new')
        }
        
      },

      closePopupPal(){ // при закрытии модалки деталек и работ открываем предыдущую модалку
        if (this.orderPreorder == 0){ //order
          $('#Order').modal('show')

        }
        if (this.orderPreorder == 1){
          $("#PreOrder").modal('show')
        }
      },
      getUserCars (userId) {
        this.preOrderCarsLoader = true
        this.$http.get(`${host.host}/Garage/${userId}/AllCarsUser`, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.preOrderCarsLoader = false
          let data = JSON.parse(response.data.model).reverse()
          this.preOrderCars = data
        }, response => {

        })
      },
      selPreOrderCarId(car) {
        this.selectpreOrderCarId = car
      },
      createPreOrder() {
        $("#selectCarForPreOrder").modal('hide')
        this.preOrderLoader = true
        this.preorderInfo = ''
        this.orderInfo = ''
        this.contentInfo = ''
        this.orderId = 0
        this.requestUrl = '/PreOrder/'
        this.isOrder = false
        // $("#createPreOrderLoader").modal('show')
        this.$http.post(`${host.host}/PreOrder/Create`, {
          'ucId': this.selectpreOrderCarId.Id,
          'reasonsAndComms': '',
          'createPreOrderForDiagnosticOrder': false,
          'orderId': 0
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.preOrderLoader = false
          if(response.body.message == 'A day can create a maximum of 20 pre-orders') return toastr.error('В день можно создавать максимум 20 предзаказов для одной машины!')
          if(response.body.error == true) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model)

          this.preorderInfo = data
          this.contentInfo = data
          this.orderId = data.Id
          $("#createPreOrderLoader").modal('hide')
          setTimeout(function() {
            $("#PreOrder").modal('show')
          }, 300)
        }, response => {
          this.$store.state.orders.preOrderLoader = false
          return toastr.error('Ошибка сервера')
        })
      },
      openOrder(id) {
        this.preOrderLoader = true
        this.orderInfo = ''
        this.contentInfo = ''
        this.orderId = 0
        this.requestUrl = '/Order/'
        this.isOrder = true
        // $("#createPreOrderLoader").modal('show')
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
//       addPatrAndLabotToPrreOrder() {

//         //$("#addPartOrLaborModal").modal('hide')
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
//                 return this.$store.state.selorder.updateDetail = false
//             }
//             let data = JSON.parse(response.data.model)

// //------------------------------

// $("#createPreOrderLoader").modal('hide')
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
//           this.$store.state.selorder.updateWork = false
//           return toastr.error('Ошибка сервера')
//         })
//       },
//       sendNewFav() {
//         // $("#createPreOrderLoader").modal('show')
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

//           $("#createPreOrderLoader").modal('hide')
//           if (this.orderPreorder == 0){ 
//             $('#Order').modal('show')
//             $('#orderRefreshDetails').click() 
//           }
//           if (this.orderPreorder == 1){ 
//             $('#PreOrder').modal('show')
//             $('#preorderRefreshDetails').click() 
//           }


//           this.$store.state.selorder.updateDetail = false
//           this.$store.state.selorder.orders = data
//           this.addedFav = []
//           return toastr.success('Выбранные избранные детали успешно добавлены!')
//         }, response => {
//           this.$store.state.selorder.updateDetail = false
//           $("#createPreOrderLoader").modal('hide')
//           return toastr.error('Ошибка сервера')
//         })
//       },
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
          fromPartCatalogType: 0//this.$store.state.selorder.addedLabor[i].fromPartCatalogType
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
      socketConnection() {
        let self = this;
        let url = `${host.ws}/support`;
        let socket = new WebSocket(url)
        socket.onopen = function(event) {
          localStorage.setItem('soket', '')
        }
        socket.onclose = function(event) {
          self.socketConnection()
        }
        socket.onmessage = function(event) {
          if (!localStorage.getItem('soket')) {
            localStorage.setItem('soket', JSON.parse(event.data).data)
          }
  
          if (localStorage.getItem('soket') && localStorage.getItem('soket') != 'kek') {
            self.$http.put(`${host.host}/Notif/SetUserIdForSocket?socketId=${localStorage.getItem('soket')}`, '', {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
              }
            }).then(response => {
              if (response.body.error) return toastr.error('Ошибка сервера при соединении с socket.')
              localStorage.setItem('soket', 'kek')

            }, response => {
              toastr.error('Ошибка сервера при соединении с socket.')
            })
          }
          

          var message = JSON.parse(event.data)
          message.user = 'user'
          self.pushMessage(message)
          setTimeout('$(".chat").scrollTop(99999)', 10)


          self.checkAndReloadChat(message);
        }
      },
      inputHandler(e) {
        if (e.keyCode === 13 && !e.shiftKey && this.messageText != '') {
          e.preventDefault()
          this.sendMessage(this.userId, this.messageText)
        }
      },
      pushMessage(message) {
        if (message.messageType == undefined) {
          if (this.userId == message.userId) {
            message.OrderId = message.orderId
            this.activeDialogs.push(message)
          }
          for (var i = 0; i < this.dialogs.length; i++) {
            if (this.dialogs[i].userId == message.userId) {
              if (this.dialogs[i].messages == undefined) this.dialogs[i].messages = []
              this.dialogs[i].messages.push(message)
              this.dialogs[i].message = message.message
              this.dialogs[i].timeMessage = message.timeMessage
              this.dialogs[i].OrderId = message.orderId
              if (this.dialogs[i].userId == this.userId) this.dialogs[i].unread = false
              else this.dialogs[i].unread = true
            }
          }
        }
      },
      getDialogs(id) {
        this.loader = true
        this.$http.get(`${host.host}/Notif/Support/Users/LastMessages`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) return toastr.error('Ошибка сервера при получении диалогов.')
          this.loader = false
          let data = JSON.parse(response.body.model)
          for (let i = 0; i < data.length; i++) {
            data[i].nameUser = data[i].FromName
            data[i].message = data[i].Message
            data[i].timeMessage = data[i].TimeSend
            data[i].userId = data[i].FromId
            data[i].image = data[i].Base64Image
          }
          this.dialogs = data
          setTimeout('$(".chat").scrollTop(99999)', 10)
          this.socketConnection()

          if(id){
            setTimeout(() => {
               $('[data-user="user'+id+'"]').addClass('chat_item-new')
            }, 200);
          }
        }, response => {
          toastr.error('Ошибка сервера при получении диалогов.')
        })
      },
      sendMessage(userId, messageText) {
        $('[data-user="user'+userId+'"]').removeClass('chat_item-new')

        this.sendMessLoader = true
        this.$http.post(`${host.host}/Notif/SendMessage?message=${messageText}&userId=${userId}&orderId=${this.prpreOrderId}`, '', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) return toastr.error('Ошибка сервера при отправке сообщения.')
          this.sendMessLoader = false
          localStorage.setItem('soket', 'kek')
          this.messageText = ''
          var firstMessage = {
            image: "",
            message: messageText,
            nameUser: 'Вы',
            timeMessage: new Date(),
            userId: userId,
            OrderId: this.prpreOrderId
          }
          this.activeDialogs.push(firstMessage)
          setTimeout('$(".chat").scrollTop(99999)', 10)
          this.preOrderCars = '',
          this.selectpreOrderCarId = '',
          this.preorderInfo = '',
          this.prpreOrderId = '',
          this.typeOrder = ''
        }, response => {
          toastr.error('Ошибка сервера при отправке сообщения.')
        })
  
      },
      openDialog(userId, name) {
        $('[data-user="user'+userId+'"]').removeClass('chat_item-new') //снимаем выделение с нового сообщения

        this.openDialogLoader = true
  
        for (var i = 0; i < this.dialogs.length; i++) {
          if (userId == this.dialogs[i].userId) {
            this.dialogs[i].unread = false
          }
        }
  
        this.$http.get(`${host.host}/Notif/History/Chat?whoId=${userId}&offSet=25`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) return toastr.error('Ошибка сервера при получении диалога.')
          this.openDialogLoader = false
          let data = JSON.parse(response.body.model)
          for (let i = 0; i < data.length; i++) {
            if (data[i].FromId == userId) data[i].nameUser = name
            else data[i].nameUser = 'Вы'
            data[i].message = data[i].Message
            data[i].timeMessage = data[i].TimeSend
            data[i].image = data[i].Base64Image
          }
          this.activeDialogs = data

          this.getAllUserOrders(`${userId}`)
          this.getAllUserPreorders(`${userId}`)


          setTimeout('$(".chat").scrollTop(99999)', 10)
        }, response => {
          toastr.error('Ошибка сервера при получении диалога.')
        })
        this.userId = userId
      },

      getAllUserOrders(userId){
        this.allUserOrders = []
        this.allOrdersLoader = true
        
        this.$http.get(`${host.host}/Order/All?userId=`+ userId, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) {
            this.allOrdersLoader = false
            return toastr.error('Ошибка сервера при получении ордеров.')
          }

          this.allOrdersLoader = false
          let data = JSON.parse(response.body.model)
          this.allUserOrders = data

        }, response => {
          toastr.error('Ошибка сервера при получении ордеров.')
        })
      },

      getAllUserPreorders(userId){
        this.allUserPreorders = []

        this.allPreordersLoader = true
        this.$http.get(`${host.host}/PreOrder/All?userId=`+ userId, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) {
            this.allPreordersLoader = false
            if (response.body.message == "PreOrders don't exist's!") {
              return toastr.error('Предзаказы не найдены.')
            } else {
              return toastr.error('Ошибка сервера при получении преордеров.')
            }
          }

          this.allPreordersLoader = false

          let data = JSON.parse(response.body.model)
          this.allUserPreorders = data
          
        }, response => {
          toastr.error('Ошибка сервера при получении преордеров.')
        })
      },


//--------------------------------
      getOrder(id) {
        this.$store.state.selorder.trees = []
        this.loaderOrder = true
        this.getOrderError = ''
        this.orderId = id
        
        this.$http.get(`${host.host}/Order/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) {
            if (response.body.message == 'Order not found!') {
              this.loaderOrder = false
              $('#openOrder').modal('hide')
              toastr.error('Заказ не создан или был удален.')
              return this.getPreOrder(id)
            }
          }
          if (response.body.error) {
            if (response.body.message == 'Order not exist!') {
              this.loaderOrder = false
              $('#openOrder').modal('hide')
              this.getOrderError = 'Заказ не создан или был удален.'
              return toastr.error('Заказ не создан или был удален.')
            }
          }

          
          this.loaderOrder = false
          let data = JSON.parse(response.body.model)
          this.orderContent = data
          this.typeOrder = 'order'
        }, response => {
          return toastr.error('Ошибка сервера при получении заказа.')
        })
      },
      getPreOrder(id) {
        this.loaderOrder = true
        this.getOrderError = ''
        this.orderId = id
        this.$http.get(`${host.host}/PreOrder/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.body.error) {
            if (response.body.message == 'Order not found!') {
              this.loaderOrder = false
              this.getOrderError = 'Заказ удален'
              return toastr.error('Ошибка. Заказ удален или не существует.')
            }
            return toastr.error('Ошибка сервера при получении заказа.')
          }
          this.loaderOrder = false
          let data = JSON.parse(response.body.model)
          this.orderContent = data
        }, response => {
          return toastr.error('Ошибка сервера при получении заказа.')
        })
      },
      selorderGetOrderById(id) {
        if (id) {
          this.$http.get(`${host.host}/Catalog/Parts/Tree?userCarId=${id}`, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type' : 'application/json; charset=UTF-8',
              'Accept' : 'application/json'
            }
          }).then(response => {
            let self = this
            $('#openOrder').modal('hide')
            if(response.body.error == true) return toastr.error('Ошибка сервера')
              let data = response.body
            data.forEach((it) => {
              it.Id = it.id
              it.Title = it.title
              it.PictureId = it.pictureId
              it.ParentId = it.parentId

              delete it.id
              delete it.title
              delete it.pictureId
              delete it.parentId
            })
            if(data == '') setTimeout(self.selorderGetOrderById(), 1000)

              let nodes = []

            nodes.push({ "id" : "root", "parent" : "#", "text" : "Каталог"})
            for(let i=0;i<data.length;i++) {
              if(data[i].ParentId == 0) data[i].ParentId = "root"
                nodes.push({
                  id: data[i].Id,
                  parent: data[i].ParentId,
                  text: data[i].Title,
                  PictureId: data[i].PictureId
                })
            }

            this.$store.state.selorder.trees = nodes
          }, response => {
            return toastr.error('Ошибка сервера')
          })
        }
      },
      addPreorderToMessage(preOrderId) {
        this.prpreOrderId = preOrderId
      },
      addOrderToMessage(orderId) {
        this.orOrderId = orderId
      },
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title
      this.getDialogs()
    },
    mounted() {
      this.$on('addDeAndLa', function(data) {
        this.$store.state.selorder.addedTypical = data.typical
        this.$store.state.selorder.addedDetail = data.detail
        this.$store.state.selorder.addedLabor = data.labor
        this.$store.state.selorder.addedFav = data.fav
   
        this.addPatrAndLabotToPrreOrder()
      })
      this.$on('createPreOrder', function() {
        this.createPreOrder()
      })
      this.$on('selPreOrderCarId', function(car) {
        this.selPreOrderCarId(car)
      })
      this.$on('addPreorderToMessage', function(preOrderId) {
        this.addPreorderToMessage(preOrderId)
      })
      this.$on('addOrderToMessage', function(orderId) {
        this.addOrderToMessage(orderId)
      })
      this.$on('getAddWorkOrder', function() {
        this.getAddWork()
      })
      this.$on('selorderGetOrderById', function(id) {
        this.selorderGetOrderById(id)
      })
      this.$on('closePopupPal', function() {
        this.closePopupPal()
      })
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
  .chat
    overflow-y: auto
    max-height: 283px
  .loader
    width: 100%
    text-align: center
  .openDialogLoader
    margin: auto
    margin-top: 15px
  .media-body img
    height: auto
    max-width: 200px
  .h-divider
    margin-top: 1rem
    margin-bottom: 1rem
    border-top: 1px solid #f1f1f1
    width: 95%
  .media img
    width: 45px
  .media-body
    max-width: 90%
</style>

<style scoped>
  .chat_item-new { background-color: #ffdddd;}
</style>

