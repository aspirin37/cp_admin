<template>
  <div id="addCar" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Добавить новый автомобиль</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-4">
              <b>Выбран автомобиль:</b><br>
              <b>Марка: </b>{{selectedCar.Make}}<br>
              <b>Модель: </b>{{selectedCar.Model}}<br>
              <b>Год: </b>{{selectedCar.Year}}<br>
              <b>Двигатель: </b>{{selectedCar.Engine}}<br>
            </div>
            <div class="col-6">
              <div class="input-group" style="margin-top:0">
                <input v-model="make" type="text" class="form-control" placeholder="Марка">
              </div>
              <div class="input-group">
                <input v-model="name" type="text" class="form-control" placeholder="Модель">
              </div>
              <div class="input-group">
                <input v-model="fullName" type="text" class="form-control" placeholder="Полное название">
              </div>
              <div class="input-group">
                <input v-model="yearS" type="number" class="form-control" placeholder="Начало выпуска">
              </div>
              <div class="input-group">
                <input v-model="yearE" type="number" class="form-control" placeholder="Окончание выпуска">
              </div>
              <div class="input-group">
                <input v-model="engine" type="text" class="form-control" placeholder="Двигатель">
              </div>
              <select v-model="engineType" class="form-control" style="margin-top:5px">
                <option value="0" selected>Тип двигателя</option>
                <option value="1">Дизельный</option>
                <option value="2">Бензиновый</option>
                <option v-if="0" value="4">Электродвигатель</option>
              </select>
              <div class="input-group">
                <input v-model="volume" type="number" class="form-control" placeholder="Литраж">
              </div>
              <div class="input-group">
                <input v-model="baseCode" type="text" class="form-control" placeholder="Каталожный код">
              </div>
              <div class="input-group">
                <input v-model="code" type="text" class="form-control" placeholder="Упрощенный код">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="addCar">Добавить</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../../data/host.js'

export default {
  name: 'addCar',
  props: ['selectedCar'],
  data() {
    return {
      loader: false,
      yearS: '',
      yearE: '',
      make: '',
      name: '',
      fullName: '',
      engine: '',
      engineType: 0,
      volume: '',
      engineKw: '',
      baseCode: '',
      code: ''
    }
  },
  methods: {
    addCar () {
      this.$http.put(`${host.host}/Catalog/PutCarModel`, {
        "id": 0,
        "make": this.make,
        "name": this.name,
        "nameLong": this.fullName,
        "yearStart": this.yearS,
        "yearEnd": this.yearE,
        "engine": this.engine,
        "volume": this.volume,
        "engineType": this.engineType,
        "engineKw": 0,
        "enginePs": 0,
        "baseCode": this.baseCode,
        "code": this.code
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.body.error) return toastr.error('Ошибка сервера!')
        this.make = ''
        this.name = ''
        this.fullName = ''
        this.yearS = ''
        this.yearE = ''
        this.engine = ''
        this.volume = 0
        this.engineType = ''
        this.baseCode = ''
        this.code = ''
        this.$parent.$emit('getAssignedCarModels', true)
        toastr.success('Автомобиль добавлен')
      }, response => {
        toastr.error('Ошибка сервера!')
      })
    }
  },
  created() {
    
  }
}
</script>

<style scoped>
  .input-group {
    margin-top: 5px
  }
</style>