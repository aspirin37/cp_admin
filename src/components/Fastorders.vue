<template>
  <div class="Debet">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Быстрые заказы'" :icon="'fa fa-credit-card'"></Breadcrumb>

          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation"><a :class="{active: currentTab == 1}" @click="currentTab = 1" href="#">Открытые</a></li>
            <li role="presentation"><a :class="{active: currentTab == 2}" @click="currentTab = 2" href="#">Звершенные</a></li>


            <li role="presentation" class="floatright" style="margin-left: auto;"><a @click="getAll" href="#" class="reload">Обновить</a></li>
          </ul>

          <div class="text-center" v-if="loader">
            <img src="../assets/load.svg" alt="load gif" width="40">
          </div>
          <div v-else class="tab-content">
            <div role="tabpanel" v-show="currentTab == 1">

              <div class="sort_block">
                <a href="#" class="sort_block__item" :class="{ active: sortParam == 'number' }"  @click="setSort('number')">По номеру</a>
                <a href="#" class="sort_block__item" :class="{ active: sortParam == 'date' }"  @click="setSort('date')">По дате</a>
              </div>

              <div class="orders">
                <!-- <paginate name="sortedList" :list="sortedList" class="paginate-list" :per="10" :tag="'div'"> -->
	
                  <!-- <div class="orders_item" v-for="(order, index) in paginated('sortedList')" :key="index" @click="openOrder(order)" data-toggle="modal" data-target="#openOrder"> -->
                  <div class="orders_item" v-for="(order, index) in sortedList" :key="index" @click="openOrder(order)" data-toggle="modal" data-target="#openOrder">
                    <div class="orders_item__top">
                      <b>№{{order.id}}</b>
                      <span class="mgl10 mgr10">&#128900;</span>
                      {{order.date | friendlyOnlyDate}} {{order.time}}
                      <span class="mgl10 mgr10">&#128900;</span>
                      <b>{{order.name}}</b>
                      <span class="mgl10 mgr10">&#128900;</span> 
                      тел. +{{order.phone}}
                    </div>
                    <div class="orders_item__bottom">
                      <div class="mgb5">{{order.model}}, VIN: {{order.vin}}</div>
                      <div class="orders_item__message">{{order.message}}</div>
                    </div>
 
                    <hr>
                  </div>
                <!-- </paginate> -->
              </div>
              <!-- <paginate-links for="sortedList" :show-step-links="true" :limit="4" :hide-single-page="true"></paginate-links> -->


            </div>
            <div role="tabpanel" v-show="currentTab == 2">

              <div class="orders">
                <div class="orders_item" v-for="(order, index) in archiveOrders" :key="index" @click="openOrder(order)" data-toggle="modal" data-target="#openOrder">
                  <div class="orders_item__top">
                    <b :class="[order.isSuccess ? 'success' : 'not_success']">№{{order.id}}</b>
                    <span class="mgl10 mgr10">&#128900;</span>
                    {{order.date | friendlyOnlyDate}} {{order.time}}
                    <span class="mgl10 mgr10">&#128900;</span>
                    <b>{{order.name}}</b>
                    <span class="mgl10 mgr10">&#128900;</span> 
                    тел. +{{order.phone}}

                    <span class="mgl10 mgr10">&#128900;</span> 
                    Закрыл: {{order.whoProcessed}}
                  </div>
                  <div class="orders_item__bottom">
                    <div class="mgb5">{{order.model}}, VIN: {{order.vin}}</div>
                    <div class="orders_item__message">{{order.message}}</div>

                  </div>
                  <hr>
                </div>
              </div>

            </div>
          </div>
          

        </div>
      </div>
    </div>


    <div class="modal fade bs-example-modal-lg" id="openOrder">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Быстрый заказ №{{ currentOrder.id }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="mgb5" v-if="currentOrder.isProcessed"><b>Статус: </b><span v-if="currentOrder.isSuccess" style="color: gren">Успешно</span><span v-else style="color: red">Отказ</span></div>
            <div class="mgb5"><b>Создан: </b>{{currentOrder.date | friendlyOnlyDate}} {{currentOrder.time}}</div>
            <div class="mgb5" v-if="currentOrder.whoProcessed"><b>Кем закрыт: </b>{{currentOrder.whoProcessed}}</div>

            <div class="mgb5"><b>Клиент: </b>{{currentOrder.name}}</div>
            <div class="mgb5"><b>Телефон: </b>{{currentOrder.phone}}</div>
            <div class="mgb5"><b>IP: </b>{{currentOrder.ip}}</div>
            
            <div class="mgb5"><b>VIN: </b>{{currentOrder.vin}}</div>
            <div class="mgb5"><b>Авто: </b>{{currentOrder.model}}</div>
            <div class="mgb5"><b>Сообщение: </b>{{currentOrder.message}}</div>

            <hr>
            <template v-if="!currentOrder.isProcessed">
              <div class="mgb5"><b>Причина отказа / комментарий:</b></div>

              <div><label><input type="radio" name="otkaz" v-model="currentOrder.otkaz" value="не актуально"> не актуально</label></div>
              <div><label><input type="radio" name="otkaz" v-model="currentOrder.otkaz" value="дорого"> дорого</label></div>
              <div><label><input type="radio" name="otkaz" v-model="currentOrder.otkaz" value="необходимые сведения не получены"> необходимые сведения не получены</label></div>
              <div>
                <label>Или укажите иное:</label><br>
                <textarea v-model="currentOrder.otkaz" ></textarea>
              </div>
            </template>
            <template v-else>
              <div class="mgb5"><b>Причина отказа/комментарий:</b></div>

              {{currentOrder.comment}}
            </template>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary mr-auto" @click="startRegistration">Зарегистрировать</button>
            <button type="button" class="btn btn-danger floatleft" data-dismiss="modal">Отмена</button>
            <template v-if="!currentOrder.isProcessed">
              <button type="button" class="btn btn-warning" data-dismiss="modal" @click="closOrder(currentOrder, false)">Закрыть с отказом</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" @click="closOrder(currentOrder, true)">Закрыть успешно</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="selectionStep">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Выберите концигурацию автомобиля:</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="min-height: 300px">
            <div v-for="(car, index) in catalogByCar">
              <div class="form-group" v-for="(select, index) in car.PrevSelected" v-if="car.PrevSelected != ''">
                <label>{{ select.Name }}</label>
                <div class="input-group">
                  <input type="text" class="form-control" :disabled="true" :value="select.Value">
                </div>
              </div>
              <div class="form-group" v-for="(select, index) in car.CurrentFieldOptions" v-if="!carLoader">
                <label>{{ select.Name }}</label>
                <select class="form-control" @change="goNewSsd(index)" v-model="catalogLength[index]">
                  <option disabled value="">Не выбрано</option>
                  <option v-for="(option, index) in select.Ssd" :value="option">{{ select.Value[index] }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">Закрыть</button>
            <button type="button" class="btn btn-secondary ml-auto" @click="checkForStepSelection(true)">Сбросить</button>
            <button type="button" class="btn btn-primary" @click="getVehBySSD">Далее</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="selectCar" v-if="carModels.length > 1 ">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Выберите нужный автомобиль из списка:</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="list-group" style="margin-bottom: 0;">
              <div class="list-group-item" v-for="car in carModels">
                <span>Марка: <b>{{ car.Make }}</b></span><br>
                <span>Модель: <b>{{ car.Model }}</b></span><br>
                <span>Год: <b>{{ car.Year }}</b></span><br>
                <span v-for="(value, key, index) in car.Data">
                  {{ value.Item1 }}: <b>{{ value.Item2 }}</b><br>
                </span>
                <p></p>
                <button class="btn btn-success" @click="selectCar(car.Id)">Добавить в гараж</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary ml-auto" @click="checkForStepSelection(false)">Назад</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Закрыть</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bs-example-modal-sm" id="infoModal">
      <div class="modal-dialog" style="margin: 70px auto; max-width: 500px" >
        <div class="modal-content">
          <div class="modal-body">
            <div class="alert alert-info" role="alert">
              {{ infoMessage }}
            </div>
            <ul>
              <li><a href="#" class="text-primary info-link" @click.prevent="goToGarage">Перейти в гараж</a></li>
              <li><a href="#" class="text-primary info-link" @click.prevent="createPreOrder(carId)">Создать предзаказ</a></li>
              <li><a href="#" class="text-primary info-link" @click.prevent data-dismiss="modal">Закрыть окно</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <preorderloader />
    <preorder v-if="preorderInfo" :preOrderId="preorderInfo.Id" />
    <popuppal v-if="preorderInfo"
      :userId="userId"
      :showInModalTypical="''"
      :detailType="1"
      :data="$store.state.selorder.trees"
      :vehid="vehId"
      :parent="0"
      :wload="$store.state.selorder.workDetailLoader"
      :dload="$store.state.selorder.detailLoader"
      :carInfo="preorderInfo"
      :orderPreorder="1"
    ></popuppal>
  </div>
</template>

<script>
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import host from '../data/host.js'
import preorderloader from './modals/PreOrderLoader'
import preorder from './modals/PreOrder'
import popuppal from './popuppal'

export default {
  name: 'Fastorders',
  components: {
    headers,
    Breadcrumb,
    preorderloader,
    preorder,
    popuppal
  },
  data() {
    return {
      title: 'Быстрые заказы',
      currentTab: 1,
      userId: 0,
      vinId: 0,
      loader: false,
      carLoader: false,
      isCarAllreadyInGarage: false,
      catalogLength: [],
      catalogByCar: [],
      garage: [],
      orders: [],
      carModels: [],
      archiveOrders: [],
      currentOrder: {},
      preorderInfo: '',
      orderPreorder: 1,
      orderId: 0,
      lastSSD: '',
      sortParam: 'number',
      infoMessage: '',
      requestUrl: '/PreOrder/',
      isOrder: false,
      // paginate: ['sortedList'],

    }
  },
  computed: {
    sortedList() {
      switch(this.sortParam){
        case 'number': return this.orders.sort(function(min, max) {
          return min.id - max.id
        });
        case 'date': return this.orders.sort(function(min, max) {
          return new Date(min.date) - new Date(max.date)
        }).reverse();

        default: return this.orders;
      }
    },
  },
  methods:{
    setSort(param) {
      this.sortParam = param
    },
    getAll(){
      this.getOrders()
      this.getArchive()
    },
    closOrder(order, status){
      this.$http.put(`${host.host}/Request/Close?id=${order.id}&success=${status}&comment=${order.otkaz}`, {}, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.getOrders()
        this.getArchive()
        return toastr.success('Заказ завершен!')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    getOrders() {
      this.loader = true
      this.$http.get(`${host.host}/Request/Actual/All`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.loader = false
        this.orders = JSON.parse(response.bodyText)

        return toastr.success('Список заказов обновлен')
      }, response => {
        this.loader = false

        return toastr.error('Ошибка сервера')
      })
    },
    getArchive(){
      let date = Date.now(),
          dateFrom = new Date(date)
      dateFrom = new Date(dateFrom.setDate(dateFrom.getDate() - 7)).toISOString()
      dateFrom = dateFrom.toString().split('T')[0]

      this.$http.get(`${host.host}/Request/Completed?dateFrom=${dateFrom}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.archiveOrders = JSON.parse(response.bodyText)
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    openOrder(order){
      this.currentOrder = order
    },
    // Начинаем автоматическую регистрацию
    startRegistration() {
      this.userId = 0
      this.vinId = 0
      this.carId = 0
      this.garage = []
      this.carModels = []
      this.isCarAllreadyInGarage = false
      this.carLoader = false
      this.catalogLength = []
      this.catalogByCar = []
      this.lastSSD = ''
      this.infoMessage = ''

      this.checkVin()
    },
    // Сперва проверяем вин
    checkVin() {
      this.$http.post(`${host.host}/Garage/VIN`, '"'+this.currentOrder.vin+'"' , {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        // Если модель по вину пустая, проверяем выборку машин
        if (response.body.message == '' && response.body.model == '[]') {
          this.checkForStepSelection()
        } else {
          this.carModels = JSON.parse(response.body.model)
          // Если в модели одна машина, запоминаем ее и проверяем телефон юзера. Если машин несколько, переходим к выбору машины из списка
          if (this.carModels.length == 1) {
            this.vinId = this.carModels[0].Id
            this.checkPhoneNumber()
          } else {
            $('#openOrder').modal('hide')
            setTimeout(() => {
              $('#selectCar').modal('show')
            }, 800)
          }
        }
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    // Выбираем машину из списка
    selectCar(id) {
      this.vinId = id
      this.checkPhoneNumber()
      $('#selectCar').modal('hide')
    },
    // Смотрим, есть ли выборка по вину
    checkForStepSelection(reset) {
      this.carLoader = false
      this.$http.get(`${host.host}/Garage/SelectionStep?vin=${this.currentOrder.vin}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        // Если выборки по вину нет, выкидываем сообщение об ошибке и говорим досвидания
        if (response.body.model == "null") return toastr.error('Вин в системе не идентифициуется, создание заказа невозможно :(')
        // Если выборка есть, достаем ее
        this.catalogLength = []
        this.catalogByCar = []
        this.lastSSD = ''
        let data = JSON.parse(response.data.model)
        for(let i=0;i<data[0].CurrentFieldOptions.length;i++) {
          this.catalogLength.push('')
        }
        this.catalogByCar = data
        if (!reset) {
          $('#openOrder').modal('hide')
          $('#selectCar').modal('hide')
          setTimeout(() => {
            $('#selectionStep').modal('show')
          }, 800)
        }
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    goToGarage() {
      localStorage.setItem('step', 2)
      localStorage.setItem('newUserId', this.userId)
      localStorage.setItem('firstName', this.currentOrder.name)
      localStorage.setItem('phoneNumber', this.currentOrder.phone)
      window.location = '/reg'
    },
    goNewSsd(index) {
      this.carLoader = true
      let ssd = this.catalogLength[index]
      ssd = ssd.replace(/\+/g, '%2b')
      ssd = ssd.replace(/\//g, '%2f')
      ssd = ssd.replace(/\=/g, '%3d')

      this.lastSSD = this.catalogLength[index]
      this.$http.get(`${host.host}/Garage/SelectionStep?vin=${this.currentOrder.vin}&ssd=${ssd}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)
        for(let i=0;i<data[0].CurrentFieldOptions.length;i++) {
          this.catalogLength.push('')
        }
        this.carLoader = false
        return this.catalogByCar = data
      }, response => {
        this.carLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    getVehBySSD() {
      let ssd = this.lastSSD
      ssd = ssd.replace(/\+/g, '%2b')
      ssd = ssd.replace(/\//g, '%2f')
      ssd = ssd.replace(/\=/g, '%3d')
      
      this.$http.get(`${host.host}/Garage/GetVehiclesBySsd?vin=${this.currentOrder.vin}&ssd=${ssd}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)
        this.carModels = data
        this.catalogLength = []
        this.catalogByCar = []
        this.lastSSD = ''
        // Если в модели одна машина, запоминаем ее и проверяем телефон юзера. Если машин несколько, переходим к выбору машины из списка
        if (this.carModels.length == 1) {
          this.vinId = this.carModels[0].Id
          $('#selectionStep').modal('hide')
          this.checkPhoneNumber()
        } else {
          $('#selectionStep').modal('hide')
          setTimeout(() => {
            $('#selectCar').modal('show')
          }, 800)
        }
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    // По номеру телефона проверяем, зареган ли юзер в системе
    checkPhoneNumber() {
      this.$http.get(`${host.host}/Users?phone=${this.currentOrder.phone}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.userId = response.body.userId
        // Если такой юзер есть, смотрим его гараж
        this.checkGarage()
      }, response => {
        // Если такого юзера нет, регаем нового
        if (response.body.code == 3) {
          this.regUser()
          return;
        } 

        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    regUser() {
      this.$http.post(`${host.host}/Users`, {
        phone: this.currentOrder.phone,
        firstName: this.currentOrder.name
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.userId = response.body.userId
        this.addCar()
        return toastr.success('Пользователь зрегистрирован')
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    checkGarage() {
      this.$http.get(`${host.host}/Garage/${this.userId}/AllCarsUser`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.garage = JSON.parse(response.body.model)
        // Если в гараже уже есть машина с этим вином, то выкидываем алерт
        this.garage.forEach((car) => {
          if (car.Vin == this.currentOrder.vin) {
            this.isCarAllreadyInGarage = true
            this.carId = car.Id
            this.infoMessage = 'Машина уже закреплена за пользователем.'
            $('#infoModal').modal('show')
            return
          }
        })
        // Если такой машины нет, то регаем тачку!
        if (!this.isCarAllreadyInGarage) this.addCar()
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    // Добавляем машину в гараж
    addCar() {
      this.$http.post(`${host.host}/Garage/${this.currentOrder.vin}/${this.vinId}/Add?endUserId=${this.userId}`,{ }, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if (response.body.error) return toastr.error(response.body.message)
        this.carId = JSON.parse(response.body.model).Item1
        this.infoMessage = 'Машина успешно добавлена в гараж пользователя.'
        $('#infoModal').modal('show')
        return
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    // Создаем предзаказ при желании
    createPreOrder(id) {
      this.preorderInfo = ''
      $('#infoModal').modal('hide')
      setTimeout(() => {
        $("#openOrder").modal('hide')
      }, 250)
      this.$http.post(`${host.host}/PreOrder/Create`, {
        'ucId': id,
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
        let data = JSON.parse(response.body.model)
        this.preorderInfo = data
        this.vehId = data.VehicleRecordId
        this.orderId = data.Id

        setTimeout(() => {
          this.translateToOrder()
        }, 300)
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    // Cразу же переводим его в заказ
    translateToOrder() {
      const preOrderInfo = {
        preOrderId: this.preorderInfo.Id,
        reasonsAndComms: ''
      }
      this.$http.post(`${host.host}/PreOrder/TranslateToOrder`, preOrderInfo, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if (response.body.error == true && response.body.message) {
          return toastr.error(response.body.message)
        } else {
          $("#PreOrder").modal('show')
          const orderId = JSON.parse(response.body.model).Id
          this.closeFastOrder(orderId)
        }
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    // И закрываем заявку. Profit!
    closeFastOrder(orderId) {
      this.$http.put(`${host.host}/Request/Close?success=true&id=${this.currentOrder.id}&orderId=${orderId}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        return toastr.success('Заявка успешно закрыта')
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },

    addPatrAndLabotToPrreOrder() {
      // $("#createPreOrderLoader").modal('show')
      
      setTimeout(() => {
        $('#PreOrder').modal('show')
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

      this.$http.post(`${host.host + this.requestUrl + this.orderId}/Parts?ucId=${this.vinId}`, addedParts, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.data.error) {
          if(response.body.message == "Logistic part for current car not found") toastr.info('В данный момент детали нет в продаже')
            else toastr.error('Ошибка при добавлении детали')
              $("#preOrderLoader").modal('hide')
              return this.$store.state.selorder.updateDetail = false
          }
          let data = JSON.parse(response.data.model)

//------------------------------

          // $("#createPreOrderLoader").modal('hide')
        // если был открыт заказ или предзаказ // сия дичь потому что я не знаю как обновить эти долбаные детальки при добавлении

          $('#preorderRefreshDetails').click() 

        if(this.$store.state.selorder.addedFav.length == 0) this.$store.state.selorder.updateDetail = false
          this.$store.state.selorder.orders = data
        this.$store.state.selorder.addedDetail = []
        return this.sendNewLabor()
      }, response => {
        // $("#createPreOrderLoader").modal('hide')
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
      this.$http.post(`${host.host + this.requestUrl + this.orderId}/Labors/${this.vinId}`, addedLabors, {
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

        // $("#createPreOrderLoader").modal('hide')

        $('#preorderRefreshLabors').click()

        if(this.$store.state.selorder.addedTypical.length == 0) this.$store.state.selorder.updateWork = false
          this.$store.state.selorder.orders = data
        this.$store.state.selorder.addedLabor = []
        toastr.success('Выбранные работы успешно добавлены!')
        this.sendNewTypical()
      }, response => {
        this.$store.state.selorder.updateWork = false
        return toastr.error('Ошибка при добавлении детали')
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
      this.$http.post(`${host.host + this.requestUrl + this.orderId}/TypicalLabors/${this.vinId}`, addedTypical, {
        headers: {
          'Authorization': 'Bearer '  + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)

        // $("#createPreOrderLoader").modal('hide')
        $('#preorderRefreshLabors').click()

        this.$store.state.selorder.updateWork = false
        this.$store.state.selorder.orders = data
        this.$store.state.selorder.addedTypical = []
        this.sendNewFav()
        return toastr.success('Выбранные общие работы успешно добавлены!')
      }, response => {
         // $("#createPreOrderLoader").modal('hide')
        this.$store.state.selorder.updateWork = false
        return toastr.error('Ошибка сервера')
      })
    },

    sendNewFav() {
      // $('#createPreOrderLoader').modal('show')
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
          'Authorization': 'Bearer '  + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.body.error == true) {
          this.$store.state.selorder.updateDetail = false
          return toastr.error('Ошибка сервера')
        }
        let data = JSON.parse(response.data.model)

        // $("#createPreOrderLoader").modal('hide')
        this.$store.state.selorder.updateDetail = false
        this.$store.state.selorder.orders = data
        this.addedFav = []

        $('#preorderRefreshDetails').click()

        return toastr.success('Выбранные избранные детали успешно добавлены!')
      }, response => {
        this.$store.state.selorder.updateDetail = false
        // $('#createPreOrderLoader').modal('hide')
        return toastr.error('Ошибка сервера')
      })
    },
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title

    this.getOrders()
    this.getArchive()

    setInterval(() => {
      this.getOrders()
    }, 3e5);
  },
  mounted () {
    $('#openOrder').on('hidden.bs.modal', () => {
      this.carNotFound = false
    })

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

<style scoped src="../assets/admin.css"></style>
<style scoped lang="scss">
.modal-dialog {
  max-width: 900px;

  & textarea {
    box-sizing: border-box;
    width: 100%;
  }
}

.info-link {
  display: block;
  margin-bottom: 5px;
}

.nav.nav-tabs {
  margin-bottom: 30px;
}
  
.nav.nav-tabs a {
  display: block;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 3px 3px 0 0;
  margin-right: 10px;
  text-decoration: none;
  margin-bottom: -1px;
  background-color: #fff;

  &.active {
    border-color: #007bff;
    border-bottom-color: transparent;
  }

  &.reload {
    background-color: #28a745;
    color: #fff;
  }
}
  

.orders_item { cursor: pointer; }
  
.orders_item__top {
  font-size: 13px;
  margin-bottom: 5px;
}

.orders_item__message {
  padding: 5px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background-color: #f2f2f2;
}

.orders_item__top .not_success { color: red; }
  
.orders_item__top .success { color: #28a745; }

.sort_block { margin-bottom: 30px;}
.sort_block__item {
  display: inline-block;
  margin-right: 5px;
  border-radius: 3px;
  padding: 2px 9px;

  &:hover {
    text-decoration: none;
  }

  &.active {
    color: #fff;
    background-color: #28a745;
  }
}


</style>


<style lang="scss">
.paginate-links.sortedList {
  text-align: center;
  list-style: none;
  display: flex;
  justify-content: center;
}

.paginate-links.sortedList li {
  margin: 0 5px;
  font-size: 16px;
}

.paginate-links.sortedList li a {
  cursor: pointer;
}
</style>

