<template>
  <div class="col-10">
          <div v-if="step == 1">
            <h4>Шаг 1: Поиск автомобиля по VIN-номеру</h4>
            <div class="form-group">
              <label>Ваш VIN <a data-toggle="tooltip" data-placement="right" title="VIN - уникальный код транспортного средства, состоящий из 17 символов">?</a></label>
              <the-mask
                mask="XXXXXXXXXXXXXXXXX"
                v-model="vin"
                type="text"
                class="form-control"
                placeholder="Введите VIN автомобиля"
                @input="toUpperCaseVin"
                @keyup.enter.native="sendVin">
              </the-mask>
              <p v-if="vin.length != 17 && vin.length != 0 || isNaN(Number(vin.substr(vin.length - 5))) == true || isProhibited != false" class="errorVin">Невалидный VIN</p>
            </div>
            <button type="button" class="btn btn-primary" @click="backStep(true)">Назад</button>
            <button class="btn btn-success" @click="sendVin" :disabled="!isAddNewVinForm || newVinLoader || vin.length != 17 && vin.length != 0 || isNaN(Number(vin.substr(vin.length - 5))) == true || isProhibited != false">Далее</button>
            <img src="../assets/load.svg" alt="load gif" width="40" v-if="newVinLoader">
          </div>

          <div v-if="step == 2">
            <div v-if="!carsLoaded">
            <h4 v-if="!carInDbNotFound">Шаг 2: Выбор автомобиля</h4>

            <div class="alert alert-info" role="alert" v-if="foundCarByVin.length != 0">
              <span class="fa fa-exclamation-circle" ></span>
              <span>По Вашему VIN-номеру были найдены следующие автомобили</span>
            </div>

            <div class="alert alert-info" role="alert" v-if="foundCarByVin.length == 0 && !carInDbNotFound && !carLoader">
              <span class="fa fa-exclamation-circle"></span>
              <span>По вашему VIN-номеру ничего не найдено. Выберите автомобиль из списка</span>
            </div>

            <div class="alert alert-info" role="alert" v-if="foundCarByVin.length == '' && carInDbNotFound" style="margin-bottom: 0;">
              <span class="fa fa-exclamation-circle"></span>
              <span>По Вашему VIN-номеру не найдено ни одной машины</span>
            </div>

            <div class="panel panel-default" v-if="foundCarByVin.length > 0">
              <div class="panel-heading">
                <span class="pull-right activeLink" data-toggle="collapse" href="#selectFoundCar">
                  <i class="fa fa-bars"></i>
                </span>
                <h3 href="#selectFoundCar" class="panel-title activeLink">Список автомобилей</h3>
              </div>
              <div id="selectFoundCar" class="panel-collapse">
                <div class="list-group" style="margin-bottom: 0;">
                  <div class="list-group-item" v-for="car in foundCarByVin">
                    <span>Марка: <b>{{ car.Make }}</b></span><br>
                    <span>Модель: <b>{{ car.Model }}</b></span><br>
                    <span>Год: <b>{{ car.Year }}</b></span><br>
                    <span v-for="(value, key, index) in car.Data">
                      {{ value.Item1 }}: <b>{{ value.Item2 }}</b><br>
                    </span>
                    <p></p>
                    <button class="btn btn-success" @click="addToGarage(car)">Добавить в гараж</button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="catalogByCar.length != 0" v-for="(car, index) in catalogByCar">
              <div class="form-group" v-for="(select, index) in car.PrevSelected" v-if="car.PrevSelected != ''">
                <label>{{ select.Name }}</label>
                <div class="input-group">
                  <input type="text" class="form-control" :disabled="true" :value="select.Value">
                  <span class="input-group-addon danger" @click="removeSSD(select.Ssd)">
                    <span class="glyphicon glyphicon-remove"></span>
                  </span>
                </div>
              </div>
              <div class="form-group" v-for="(select, index) in car.CurrentFieldOptions" v-if="!carLoader">
                <label>{{ select.Name }}</label>
                <select class="form-control" @change="goNewSsd(index)" v-model="catalogLength[index]" :disabled="carLoader">
                  <option disabled value="">Не выбрано</option>
                  <option v-for="(option, index) in select.Ssd" :value="option">{{ select.Value[index] }}</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-top: 30px" v-if="!carLoader && catalogByCar != '' ">
              <button type="button" class="btn btn-primary" v-if="step > 1" @click="backStep">Назад</button>
              <button class="btn btn-success" @click="getVehBySSD">Далее</button>
            </div>
          </div>

            <div class="panel panel-default" v-if="searchCarByFilterSSD != ''">
              <div class="panel-heading">
                <h3 href="#selectFoundCars" class="panel-title activeLink">Список автомобилей</h3>
              </div>
              <div id="selectFoundCars" class="panel-collapse collapse show">
                <div class="list-group" style="margin-bottom: 0;" v-for="fullList in searchCarByFilterSSD">
                  <div class="list-group-item" v-for="car in fullList">
                    <span>Марка: <b>{{ car.Make }}</b></span><br>
                    <span>Модель: <b>{{ car.Model }}</b></span><br>
                    <span>Год: <b>{{ car.Year }}</b></span><br>
                    <span v-for="(value, key, index) in car.Data">
                      {{ value.Item1 }}: <b>{{ value.Item2 }}</b><br>
                    </span>
                    <button class="btn btn-success" @click="addToGarage(car)">Добавить в гараж</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center" v-if="carLoader">
              <img src="../assets/load.svg" alt="load gif" width="40">
            </div>

          </div>

          <div class="row" v-if="step == 3">
            <div class="col-8">
              <h4>Шаг 3: Данные об автомобиле</h4>

              <div class="form-group">
                <label>Госномер автомобиля</label>
                <input type="text" class="form-control" placeholder="X111XX11" v-model="infoCar.gosnum">
                <p class="errorGosNum" v-if="errorGosNum">Машина с таким госНомером уже добавлена!</p>
              </div>

              <div class="form-group">
                <label>Цвет</label>
                <input type="text" class="form-control" placeholder="Цвет автомобиля" v-model="infoCar.color">
              </div>

              <div class="form-group">
                <label>Пробег (км.)</label>
                <input type="number" class="form-control" placeholder="Пробег автомобиля" v-model="infoCar.mileage" @input="checkMilageTypping" max="1000000">
              </div>

              <div class="form-group">
                <button class="btn btn-primary" type="button" @click="backStep">Назад</button>
                <button class="btn btn-success" type="button" @click="goStepFour" :disabled="isInfoFormFull || errorGosNum">Далее</button>
              </div>
            </div>
          </div>

          <div v-if="step == 4">

            <h4>Шаг 4: Последнее ТО</h4>

            <div class="form-group">
              <label>Дата последнего ТО {{ newTO.date }}</label>
              <datepicker
                v-model="newTO.date"
                :required="true"
                input-class="form-control "
                language="ru"
                placeholder="Выберите день">
              </datepicker>
            </div>

            <div class="form-group">
              <label>Время прохождения</label>
              <input type="time" class="form-control" placeholder="Введите время прохождения последнего ТО" v-model="newTO.time">
            </div>

            <div class="form-group">
              <label>Пробег автомобиля при прохождении ТО</label>
              <input type="number" class="form-control" placeholder="км" v-model="newTO.mileage">
            </div>

            <div class="checkbox">
              <label>
                <input type="checkbox" v-model="newTO.isDuring"> ТО было пройдено вовремя
              </label>
            </div>

            <div class="form-group">
              <button class="btn btn-primary" type="button" v-if="step > 3" @click="backStep">Назад</button>
              <button class="btn btn-success" type="button" @click="addCarToGarage">Готово</button>
            </div>

          </div>

  </div>
</template>

<script>
import host from '../data/host.js'
import {TheMask} from 'vue-the-mask'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'AddCar',
  props: ['newUserId'],
  data() {
    return {
      step: 1,
      vin: '',
      prohibited: /(I)|(Q)|(O)/,
      isProhibited: false,
      newVinLoader: false,
      carInDbNotFound: false,
      foundCarByVin: '',
      successFoundCarByVin: false,
      carLoader: false,
      carsLoaded: false,
      catalogLength: [],
      catalogByCar: [],
      lastSSD: '',
      searchCarByFilterSSD: [],
      selectCarByAdded: [],
      infoCar: {
        gosnum: '',
        color: '',
        mileage: '',
      },
      newTO: {
        date: '',
        time: '',
        mileage: '',
        isDuring: false
      },
      errorGosNum: false,
      selectionVinId: ''
    }
  },
  components: {
    TheMask,
    Datepicker
  },
  computed: {
    isUserStartSendTo() {
      if(this.newTO.date == '' || this.newTO.time == '' || this.newTO.mileage == '') return true
      else return false
    },
    isUserStopTypingSendTo() {
      if(this.newTO.date != '' || this.newTO.time != '' || this.newTO.mileage != '') return true
      else return false
    },
    isAddNewVinForm() {
      return this.vin == '' ? false : true
    },
    isInfoFormFull() {
      if(this.infoCar.gosnum == '' || this.infoCar.color == '' || this.infoCar.mileage == '') return true
      return false
    }
  },
  methods: {
    checkMilageTypping() {
      if(this.infoCar.mileage < 0) this.infoCar.mileage = 1
    },
    backStep(toGarage) {
      if (toGarage) this.$parent.$emit('stepToGarage')
      this.step = this.step - 1
      this.carsLoaded = false
    },
    toUpperCaseVin() {
      this.vin = this.vin.toUpperCase()
      if(this.vin.match(this.prohibited) == null) return this.isProhibited = false
      return this.isProhibited = true
    },
    sendVin() {
      this.catalogByCar = {}
      this.foundCarByVin = {}
      this.searchCarByFilterSSD = ''

      if(this.vin.length != 17 && this.vin.length != 0 || isNaN(Number(this.vin.substr(this.vin.length - 5))) == true || this.isProhibited != false) return false;
      this.newVinLoader = true
      this.$http.post(`${host.host}/Garage/VIN`, '"'+this.vin+'"', {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.newVinLoader = false
        this.step = 2
        if(response.body.message == '' && response.body.model == '[]') return this.getAllMakes()
        if(response.body.error == true) {
          if(response.body.message == 'Object reference not set to an instance of an object.') {
            return this.carInDbNotFound = true
          }
          toastr.error(response.body.message)
          this.carInDbNotFound = false
          return this.getAllMakes()
        }
        let data = JSON.parse(response.data.model)
        this.newVinLoader = false
        this.successFoundCarByVin = true
        return this.foundCarByVin = data
      }, response => {
        this.newVinLoader = false
        toastr.error('Ошибка сервера')
      })
    },
    getAllMakes() {
      this.carLoader = true
      this.$http.get(`${host.host}/Garage/SelectionStep?vin=${this.vin}&ssd=`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.body.error == true) {
          this.carLoader = false
          if(response.body.message == 'Object reference not set to an instance of an object.') {
            this.step = 2
            toastr.info('Машина не найдена')
            return this.carInDbNotFound = true
          }
          return toastr.error('Ошибка сервера')
        }
        this.carLoader = false
        let data = JSON.parse(response.data.model)
        if(data == null) return this.carInDbNotFound = true
        for(let i=0;i<data[0].CurrentFieldOptions.length;i++) {
          this.catalogLength.push('')
        }
        return this.catalogByCar = data
      }, response => {
        this.carLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    addToGarage(car) {
      if(car.Year > 2018 && car.Data['Vehicle date'] != undefined) {
        car.Year = car.Data['Vehicle date'].split('.')[2]
      }
      this.step = 3
      this.selectionVinId = car.Id
      this.searchCarByFilterSSD = []
      return this.selectCarByAdded = car
    },
    removeSSD(ssd) {
      if(ssd == '') ssd = null
      this.lastSSD = ssd
      this.catalogByCar = []
      this.carLoader = true

      ssd = ssd.replace(/\+/g, '%2b')
      ssd = ssd.replace(/\//g, '%2f')
      ssd = ssd.replace(/\=/g, '%3d')

      this.$http.get(`${host.host}/Garage/SelectionStep?vin=${this.vin}&ssd=${ssd}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.carLoader = false
        let data = JSON.parse(response.data.model)

        for(let i=0;i<data[0].CurrentFieldOptions.length;i++) {
          this.catalogLength.push('')
        }
        this.catalogByCar = data
      }, response => {
        this.carLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    goNewSsd(index) {
      let ssd = this.catalogLength[index]
      ssd = ssd.replace(/\+/g, '%2b')
      ssd = ssd.replace(/\//g, '%2f')
      ssd = ssd.replace(/\=/g, '%3d')

      this.carLoader = true
      this.lastSSD = this.catalogLength[index]
      this.$http.get(`${host.host}/Garage/SelectionStep?vin=${this.vin}&ssd=${ssd}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.carLoader = false
        let data = JSON.parse(response.data.model)

        for(let i=0;i<data[0].CurrentFieldOptions.length;i++) {
          this.catalogLength.push('')
        }
        this.catalogByCar = data
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

      this.carLoader = true
      this.carsLoaded = true
      
      this.$http.get(`${host.host}/Garage/GetVehiclesBySsd?vin=${this.vin}&ssd=${ssd}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.carLoader = false
        this.searchCarByFilterSSD = []
        let data = JSON.parse(response.data.model)
        this.searchCarByFilterSSD.push(data)
      }, response => {
        this.carLoader = false
      })
    },
    goStepFour() {
      this.step = 4
    },
    clearData() {
      // this.step = 1
      this.vin = ''
      this.infoCar.gosnum = ''
      this.infoCar.color = ''
      this.infoCar.mileage = ''
      this.newTO.date = ''
      this.newTO.time = ''
      this.newTO.mileage = ''
      this.newTO.isDuring = false
    },
    addCarToGarage() {
      let newCar = this.$data
      this.$http.post(`${host.host}/Garage/${newCar.vin}/${newCar.selectionVinId}/Add?endUserId=${this.newUserId}`,{ }, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let newGarageModel = JSON.parse(response.data.model)

        if (response.body.message == 'This car already in Garage!') return toastr.error('Выбранная машина уже есть в гараже!')
        if (response.body.message == 'unsupported model year!\r\nParameter name: Vehicle.Year') return toastr.error('Модель данного года не поддерживается!')
        let car = newGarageModel.Item1

        let TimeTO = ""

        if(newCar.newTO.date != '' && newCar.newTO.time != '') {
          let parseDate = new Date(newCar.newTO.date)
          TimeTO = parseDate.getFullYear()+'-'+parseDate.getMonth()+1+'-'+parseDate.getDate()+'T'+newCar.newTO.time+':00.341Z'
        } else TimeTO = new Date()

        this.$http.put(`${host.host}/Garage/${this.newUserId}`, {
          'gosNum': newCar.infoCar.gosnum,
          'color': newCar.infoCar.color,
          'lastVisitDate': TimeTO,
          'milleage': Number(newCar.newTO.mileage),
          'inTime': newCar.newTO.isDuring,
          'allMilleage': Number(newCar.infoCar.mileage)
        }, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.$parent.$emit('carAdded')
          return toastr.success('Машина добавлена!')
        }, response => {
          return toastr.error('Ошибка сервера')
        })
      }, response => {
        return toastr.error('Ошибка сервера')
      })
      this.clearData()
    },
  }
}
</script>

<style scoped>

  .errorVin {
    color: red;
    margin-top: 5px;
  }

  .errorGosNum {
    color: red;
    margin-top: 5px;
    margin-bottom: -10px;
  }

  .form-group {
    margin-bottom: 6px;
  }

</style>
