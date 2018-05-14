<template>
  <div>
    <img src="../assets/load.svg" alt="load gif" width="40" v-if="garageLoader">
    <div v-else>
      <div class="alert alert-info" v-if="!garage.length">
        <span class="fa fa-exclamation-circle" ></span>
        <span>Гараж пуст!</span>
      </div>
      <div style="margin-bottom: 15px">
        <button class="btn btn-success" @click="addToGarage">Добавить автомобиль</button>
        <button class="btn btn-secondary pull-right" @click="goToUserRegistration">К регистрации пользователей</button>
      </div>
      <div v-if="garage.length">
        <div class="card-header">
          <a :class="shownCarIdx == i ? 'text-primary active-link' : 'text-dark'" style="margin-right: 30px" href="#" @click.prevent="shownCarIdx = i; shownCarId = car.Id" v-for="(car, i) in garage">
            <i class="fa fa-star mgr5" v-if="car.IsPriority"></i>
            {{ car.Make }}<span class="capitalize"> {{ car.Model }}</span>
          </a>
        </div>
        <div class="row" v-for="(car, i) in garage" v-if="i == shownCarIdx">
          <div class="col-4">
            <div class="d-flex img-thumbnail" style="height: 200px; margin-bottom: 15px">
              <img class="mr-auto ml-auto" style="object-fit: contain" :src="host + '/Image/CarLogo/' + car.Make + '/black'">
              <!-- <span style="margin-left: 10px" v-else>Нет изображений</span> -->
            </div>
            <button class="btn btn-success" @click="createPreOrder" v-if="garage.length">Создать предзаказ</button>
            <button class="btn btn-danger" @click="removeCar" v-if="garage.length">Удалить автомобиль</button>
          </div>
          <div class="col-6">
            <table class="table table-striped">
              <tr>
                <td>Модель и марка: </td>
                <td><b>{{ car.Make }}<span class="capitalize"> {{ car.Model }}</span> (id:{{ car.Id }})</b></td>
              </tr>
              <tr>
                <td>VIN-номер: </td>
                <td><b>{{ car.Vin }}</b></td>
              </tr>
              <tr>
                <td>Год авто: </td>
                <td><b>{{ car.Year }}</b></td>
              </tr>
              <tr>
                <td>Цвет: </td>
                <td><b>{{ car.CarColor ? car.CarColor : 'Не указан' }}</b></td>
              </tr>
              <tr>
                <td>Пробег: </td>
                <td><b>{{ car.Mileage }} км.</b></td>
              </tr>
              <tr>
                <td>ГосНомер: </td>
                <td><b>{{ car.GosNum ? car.GosNum : 'Не указан' }}</b></td>
              </tr>
              <tr>
                <td>Коробка передач: </td>
                <td><b>{{ car.GearBox ? car.GearBox : 'Не указан' }}</b></td>
              </tr>
              <tr>
                <td>Двигатель: </td>
                <td><b>{{ car.Engine ? car.Engine : 'Не указан' }}</b></td>
              </tr>
              <tr>
                <td>Последнее ТО: </td>
                <td>
                  <b v-if="!car.LastTO">Не пройдено</b>
                  <b v-else>Пройдено {{ car.TO.VisitDate | formatDate }}</b>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <preorderloader />
    <preorder v-if="preorderInfo" :preOrderId="preorderInfo.Id" />
    <popuppal v-if="orderContent"
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
import host from '../data/host.js'
import preorderloader from './modals/PreOrderLoader'
import preorder from './modals/PreOrder'
import popuppal from './popuppal'

export default {
  name: 'garage',
  props: ['garage', 'garageLoader', 'shownCarId'],
  components: {
    preorderloader,
    preorder,
    popuppal
  },
  data() {
    return {
      userId: localStorage.getItem('newUserId'),
      shownCarIdx: 0,
      vehId: 0,
      preorderInfo: '',
      orderContent: '',
      host: host.host
    }
  },
  methods: {
    addAllDetailsAndLabors() {
      $("#addPartOrLaborModal").modal('hide')
      
      localStorage.removeItem('step')
      localStorage.removeItem('newUserId')
      localStorage.removeItem('firstName')
      localStorage.removeItem('phoneNumber')

      setTimeout(() => {
        $("#PreOrder").modal('show')
        $('#preorderRefreshDetails').click() 
        // if (this.addedDetail.length || this.addedFav.length) {
        //   $('#preorderRefreshDetails').click() 
        // }
        // if (this.addedLabor.length || this.addedTypical.length) {
        //   $('#preorderRefreshLabors').click() 
        // }
      }, 300)

      if(this.addedLabor.length != 0 || this.addedTypical.length != 0) this.updateWork = true
        if(this.addedDetail.length != 0 || this.addedFav.length != 0) this.updateDetail = true
          this.sendNewDetail()
      },
      sendNewDetail() {
        if(this.addedDetail.length == 0) return this.sendNewLabor()
          let arrays = []
        for(let i=0;i<this.addedDetail.length;i++) {
          arrays.push({"catalogPart": Object.assign({}, this.addedDetail[i])})
          arrays[i].amount = this.addedDetail[i].Amount
        }
        if(this.addedDetail.length == 0) return this.updateDetail = false
          this.updateDetail = true
        this.$http.post(`${host.host}/PreOrder/${this.preorderInfo.Id}/Parts?ucId=${this.preorderInfo.UserCarModel.Id}`, arrays, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if(response.data.error) {
            if(response.body.message == "Logistic part for current car not found") toastr.info('В данный момент детали нет в продаже')
              else toastr.error('Ошибка при добавлении детали') 
                return this.updateDetail = false
            }
            let data = JSON.parse(response.data.model)
            if(this.addedFav.length == 0) this.updateDetail = false
              this.preOrderInfo = data
            this.addedDetail = []
            this.headerStep = '3'
            this.sendNewLabor();
            return toastr.success('Выбранные детали успешно добавлены!')
          }, response => {
            toastr.error('Ошибка при добавлении детали')
            return this.updateDetail = false
          })
      },
      sendNewLabor() {
        if(this.addedLabor.length == 0) return this.sendNewTypical()

          let addedLabors = []
        for(let i=0;i<this.addedLabor.length;i++) {
          addedLabors.push({
            laborId: this.addedLabor[i].Id,
            amount: 1,
            fromPartId: this.addedLabor[i].FromPartId,
            fromPartCatalogType: this.addedLabor[i].fromPartCatalogType
          })
        }
        this.updateWork = true
        this.$http.post(`${host.host}/PreOrder/${this.preorderInfo.Id}/Labors?ucId=${this.preorderInfo.UserCarModel.Id}`, addedLabors, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if(response.data.error) {
            this.updateWork = false
            return toastr.error('Ошибка при добавлении работы')
          }
          let data = JSON.parse(response.data.model)
          if(this.addedTypical.length == 0) this.updateWork = false
            this.preOrderInfo = data
          this.addedLabor = []
          this.headerStep = '3'
          this.sendNewTypical()
          return toastr.success('Выбранные работы успешно добавлены!')
        }, response => {
          this.updateWork = false
          return toastr.error('Ошибка при добавлении детали')
        })
      },
      sendNewTypical() {
        let typicalArr = []
        this.updateWork = true
        for(let i=0;i<this.addedTypical.length;i++) {
          typicalArr.push({
            laborId: this.addedTypical[i].Id,
            amount: 1,
            fromPartId: 0
          })
        }
        this.$http.post(`${host.host}/PreOrder/${this.preorderInfo.Id}/TypicalLabors/${this.preorderInfo.UserCarModel.Id}?IsDiagnostics=false`, typicalArr, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          let data = JSON.parse(response.data.model)
          this.updateWork = false
          this.preOrderInfo = data
          this.addedTypical = []
          this.headerStep = '3'
          $("#PreOrderLoader").modal('hide')
          
          return toastr.success('Выбранные общие работы успешно добавлены!')
        }, response => {
          this.updateWork = false
          return toastr.error('Ошибка сервера')
        })
      },
    addToGarage() {
      this.$parent.$emit('addToGarage')
    },
    translateToOrder() {
      let preOrderInfo = {
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

      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    createPreOrder() {
      this.preorderInfo = ''
      $("#createPreOrderLoader").modal('show')
      this.$http.post(`${host.host}/PreOrder/Create`, {
        'ucId': this.shownCarId,
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
        let self = this
        let data = JSON.parse(response.body.model)
        this.orderContent = {}
        this.preorderInfo = data
        this.vehId = data.VehicleRecordId
        $("#createPreOrderLoader").modal('hide')
        setTimeout(() => {
          $("#PreOrder").modal('show')
          this.translateToOrder()
        }, 300)
      }, response => {
        this.preOrderLoader = false
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    removeCar() {
      this.$http.delete(`${host.host}/Garage/${this.shownCarId}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.$parent.$emit('carRemoved')
        return toastr.success('Машина успешно удалена из гаража')
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    goToUserRegistration() {
      this.$parent.$emit('goToUserRegistration')
    }
  },
  mounted() {
    this.$on('addDeAndLa', function(data) {
      this.addedLabor = data.labor
      this.addedDetail = data.detail
      this.addedTypical = data.typical
      this.addedFav = data.fav
      this.addAllDetailsAndLabors()
    })
  }
}
</script>

<style scoped src="../assets/admin.css">

</style>

<style scoped lang="sass">
  .card-header
    margin-bottom: 15px
    border-bottom: 0
    border-radius: 2px

  .active-link
    text-decoration: underline

</style>