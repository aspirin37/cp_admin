<template>
  <form @submit.prevent="submitForm" class="d-flex flex-wrap align-items-end">
    <div class="form-group">
      <label for="make">Производитель</label>
      <select class="form-control form-control-sm" id="make" v-model="fuelSystem.makeId">
        <option disabled="disabled" selected value='0'>Выберите производителя</option> 
        <option v-for="make in makes" v-model="make.name">{{ make.name }}</option>
      </select>
    </div>
    <div class="form-group" style="width: 300px">
      <label for="model">Модель</label>
      <input type="text" class="form-control form-control-sm" id="model" placeholder="Модель" v-model="fuelSystem.model" :required="type == 2 ? true : false">
    </div>
    <div class="form-group" style="width: 200px" v-if="type == 2">
      <label for="body">Кузов</label>
      <input type="text" class="form-control form-control-sm" id="body" placeholder="Кузов" v-model="fuelSystem.body">
    </div>
    <div class="form-group" style="width: 200px" v-if="type == 2">
      <label for="generation">Поколение</label>
      <input type="text" class="form-control form-control-sm" id="generation" placeholder="Поколение" v-model="fuelSystem.generation">
    </div>
    <div class="form-group" style="width: 80px" v-if="type == 2">
      <label for="from">C</label>
      <input type="number" class="form-control form-control-sm" id="from" placeholder="С" min="1985" :max="(new Date).getFullYear()" v-model="fuelSystem.myFrom" required>
    </div>
    <div class="form-group" style="width: 80px" v-if="type == 2">
      <label for="to">По</label>
      <input type="number" class="form-control form-control-sm" id="to" placeholder="По" :min="fuelSystem.myFrom || 1985" :max="(new Date).getFullYear()" v-model="fuelSystem.myTo" required>
    </div>
    <div class="form-group" style="width: 80px" v-if="type == 1">
      <label for="year">Год</label>
      <input type="number" class="form-control form-control-sm" id="year" placeholder="Год" min="1990" :max="(new Date).getFullYear()" v-model="fuelSystem.year">
    </div>
    <div class="form-group" style="width: 80px" v-if="type == 2">
      <label for="fuelRoute">Трасса</label>
      <input type="number" class="form-control form-control-sm" id="fuelRoute" placeholder="Трасса" min="0" v-model="fuelSystem.fuelRoute">
    </div>
    <div class="form-group" style="width: 80px" v-if="type == 2">
      <label for="fuelRoute">Город</label>
      <input type="number" class="form-control form-control-sm" id="fuelRoute" placeholder="Город" min="0" v-model="fuelSystem.fuelCity">
    </div>
    <div class="form-group">
      <label for="engineType">Тип движка</label>
      <select class="form-control form-control-sm" id="engineType" v-model="fuelSystem.et">
        <option v-for="engType in fuelCatalog.engTypes">{{ engType }}</option>
      </select>
    </div>
    <div class="form-group" style="width: 80px">
      <label for="hp">hp</label>
      <input type="number" class="form-control form-control-sm" id="hp" placeholder="hp" min="0" step="1" v-model="fuelSystem.hp">
    </div>
    <div class="form-group" style="width: 80px" v-if="type == 1">
      <label for="kw">kw</label>
      <input type="number" class="form-control form-control-sm" id="kw" placeholder="kw" min="0" step="1" v-model="fuelSystem.kw">
    </div>
    <div class="form-group" style="width: 80px">
      <label for="ccm">ccm</label>
      <input type="number" class="form-control form-control-sm" id="ccm" placeholder="ccm" min="0" step="1" v-model="fuelSystem.engineCcm">
    </div>
    <div class="form-group" style="width: 80px">
      <label for="vol">vol</label>
      <input type="number" class="form-control form-control-sm" id="vol" placeholder="vol" min="0" step="0.1" v-model="fuelSystem.vol">
    </div>
    <div class="form-group">
      <label for="et">Экол. стд</label>
      <select class="form-control form-control-sm" id="et" v-model="fuelSystem.ecoType">
        <option v-for="ecoType in fuelCatalog.ecoTypes">{{ ecoType }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="gbxTypes">Тип кп</label>
      <select class="form-control form-control-sm" id="gbxTypes" v-model="fuelSystem.gt">
        <option v-for="gbxType in fuelCatalog.gbxTypes">{{ gbxType }}</option>
      </select>
    </div>
    <div class="form-group" style="width: 100px">
      <label for="gs">Передач</label>
      <input type="number" class="form-control form-control-sm" id="gs" placeholder="Передач" min="0" step="1" v-model="fuelSystem.gs">
    </div>
    <div class="form-group">
      <label for="drive">Привод</label>
      <select class="form-control form-control-sm" id="drive" v-model="fuelSystem.drive">
        <option v-for="drvType in fuelCatalog.drvTypes">{{ drvType }}</option>
      </select>
    </div>
    <div class="form-group" v-if="type == 2">
      <label for="fuel">Топливо</label>
      <input type="text" class="form-control form-control-sm" id="fuel" placeholder="Топливо" v-model="fuelSystem.fuel">
    </div>
    <div class="form-group">
      <button type="submit"class="btn btn-sm btn-primary" style="margin-right: 10px">{{type == 1 ? 'Получить выборку' : 'Добавить модель'}}</button>
      <button type="button" class="btn btn-sm btn-success" style="margin-right: 10px" @click="getZeroConsumption" v-if="type == 1">Найти с нулевым расходом</button>
      <json-excel
        class   = "btn btn-sm btn-warning"
        style   = "margin-right: 10px"
        :data   = "rowsToPrint.length ? rowsToPrint : carModels"
        :fields = "XLSfields"
        :name   = "fileName + '.xls'"
        v-if="type == 1 && hasModels">
          Скачать
      </json-excel>
      <button type="reset"class="btn btn-sm btn-secondary" @click="resetFields">Очистить</button>
    </div>
  </form>
</template>

<script>
import host from '../../data/host.js'
import JsonExcel from 'vue-json-excel'

export default {
  name: '',
  props: ['type', 'fuelCatalog', 'hasModels', 'rowsToPrint'],
  components: {
    JsonExcel
  },
  data() {
    return {
      makes: [],
      carModels: [],
      fuelSystem: {
        makeId: 0,
        make: '',
        model: '',
        body: '', // 
        generation: '', //
        myFrom: '', //
        myTo: '', //
        fuelRoute: 0, //
        fuelCity: 0, //
        year: '',
        et: '',
        hp: '',
        kw: '',
        engineCcm: '', //
        vol: '',
        drive: '',
        gt: '',
        gs: '',
        ecoType: '',
        fuel: '', //
      },
      fileName: 'Топливный каталог',
      XLSfields: {
        'ID': 'makeId',
        'Производитель': 'make',
        'модель': 'model',
        'Поколение': 'generation',
        'Кузов': 'body',
        'С': 'myFrom',
        'По': 'myTo',
        'Трасса': 'fuelRoute',
        'Город': 'fuelCity',
        'Тип движка': 'engineType',
        'hp': 'engineHp',
        'vol': 'engineVol',
        'ccm': 'engineCcm',
        'Тип кп': 'gearboxType',
        'Передач': 'gearboxStep',
        'Привод': 'drive',
        'Эк стд': 'ecoStd',
        'Тип топлива': 'fuel'
      }
    }
  },
  methods: {
    getMakes () {
      this.$http.get(`${host.host}/Catalog/CarSpec/FuelSystem/Makes`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.makes = response.body
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    getModels () {
      if (!this.fuelSystem.makeId) return toastr.error('Выберите производителя!')

      this.$parent.$emit('loader', true)

      let URL = `${host.host}/Catalog/CarSpec/FuelSystem/Cars?makeId=${this.fuelSystem.makeId}`

      if (this.fuelSystem.model || this.fuelSystem.year || this.fuelSystem.et || this.fuelSystem.hp || this.fuelSystem.kw || this.fuelSystem.vol || this.fuelSystem.drive || this.fuelSystem.gt || this.fuelSystem.gs || this.fuelSystem.ecoType) {

        URL = `${host.host}/Catalog/CarSpec/FuelSystem/CarModels?makeId=${this.fuelSystem.makeId}&model=${this.fuelSystem.model}&year=${this.fuelSystem.year}&et=${this.fuelSystem.et}&hp=${this.fuelSystem.hp}&kw=${this.fuelSystem.kw}&vol=${this.fuelSystem.vol}&drive=${this.fuelSystem.drive}&gt=${this.fuelSystem.gt}&gs=${this.fuelSystem.gs}&ecoType=${this.fuelSystem.ecoType}`
      }

      this.$http.get(URL, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.$parent.$emit('loader', false)
        this.carModels = response.body
        if (this.carModels.length) {
          this.$parent.$emit('gotCarModels', this.carModels)
        }
      }, response => {
        this.$parent.$emit('loader', false)
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    getZeroConsumption () {
      const URL = `${host.host}/Catalog/CarSpec/FuelSystem/Cars/Undefined?makeId=${this.fuelSystem.makeId}`
      this.$parent.$emit('loader', true)

      this.$http.get(URL, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.$parent.$emit('loader', false)
        this.carModels = response.body
        if (this.carModels.length) {
          this.$parent.$emit('gotCarModels', this.carModels)
        }
      }, response => {
        this.$parent.$emit('loader', false)
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    addModel () {
      this.$http.post(`${host.host}/Catalog/CarSpec/FuelSystem/AddCarInfo`, this.fuelSystem, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        return toastr.success('Модель успешно добавлена!')
        this.resetFields()
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    resetFields () {
      this.fuelSystem = {
        makeId: 0,
        model: '',
        body: '', //
        generation: '', //
        myFrom: '', //
        myTo: '', //
        fuelRoute: '', //
        fuelCity: '', //
        year: '',
        et: '',
        hp: '',
        kw: '',
        vol: '',
        drive: '',
        gt: '',
        gs: '',
        ecoType: '',
        fuel: '', //
      }
      if (this.type == 1) {
        this.$parent.$emit('resetFields')
      }
    },
    submitForm () {
      this.type == 1 ? this.getModels() : this.addModel()
    }
  },
  created() {
    this.getMakes()
  },
}
</script>

<style scoped src="../../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .form-group
    margin-right: 15px
    margin-bottom: 5px

  label
    font-size: .875rem
</style>
