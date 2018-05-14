<template>
  <div id="fuel-catalog">
    <headers></headers>
    <div class="content-wrapper py-3">
      <div class="container-fluid">
        <Breadcrumb :title="'Каталог расходов топлива'" :icon="'fa fa-fw fa-fire'"></Breadcrumb>
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link active" id="get-models-tab" data-toggle="tab" href="#get-models" @click="switchTabType(1)">Выборка</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="add-models-tab" data-toggle="tab" href="#set-models" @click="switchTabType(2)">Добавление модели</a>
          </li>
        </ul>

        <div class="tab-content">
          <div class="show active tab-pane fade" id="get-models">
            <fuelInputGroup :type="tabType" :fuelCatalog="fuelCatalog" :hasModels="hasModels" :rowsToPrint="rowsToPrint"/>

            <div class="text-center" v-if="loader">
              <img src="../assets/load.svg" alt="load gif" width="40" style="margin-top: 50px">
            </div>

            <vue-good-table v-if="!loader && carModels.length"
              :columns="columns"
              :rows="carModels"
              globalSearch="true"
              globalSearchPlaceholder="Поиск по ключевому слову"
              paginate="true"
              styleClass="table custom-table">
              <template slot="table-column" slot-scope="props">
                <label class="custom-control custom-checkbox" style="margin: 0 8px" v-if="props.column.label =='deletion'">
                  <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="allSelected">
                  <span aria-hidden="true" class="custom-control-indicator"></span>
                </label>
                <span v-else>
                  {{props.column.label}}
                </span>
              </template>
              <template slot="table-row" slot-scope="props">
                <td><span>{{ props.row.id }}</span></td>
                <td><span>{{ props.row.make }}</span></td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="text" max="64" v-model="props.row.model" @keyup.enter="editModel(props.row)">
                  <span class="fuel-table-span">{{ props.row.model }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="text" max="40" v-model="props.row.body" @keyup.enter="editModel(props.row)">
                  <span class="fuel-table-span">{{ props.row.body }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="number" min="1985" :max="(new Date).getFullYear()" v-model="props.row.myFrom" @keyup.enter="editModel(props.row)">
                  <span class="fuel-table-span">{{ props.row.myFrom }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="number" :min="props.row.myFrom || 1985" :max="(new Date).getFullYear()" v-model="props.row.myTo" @keyup.enter="editModel(props.row)">
                  <span class="fuel-table-span">{{ props.row.myTo }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="number" placeholder="Трасса" min="0" v-model="props.row.fuelRoute" @keyup.enter="editModel(props.row)" style="max-width: 80px">
                  <span class="fuel-table-span">{{ props.row.fuelRoute }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="number" placeholder="Город" min="0" v-model="props.row.fuelCity" @keyup.enter="editModel(props.row)" style="max-width: 80px">
                  <span class="fuel-table-span">{{ props.row.fuelCity }}</span>
                </td>
                <td class="fuel-table-td">
                  <select class="fuel-table-control form-control form-control-sm d-none fuel-table-control--select" v-model="props.row.engineType" @keydown.enter.prevent="editModel(props.row)">
                    <option v-for="engType in fuelCatalog.engTypes">{{ engType }}</option>
                  </select>
                  <span class="fuel-table-span">{{ props.row.engineType }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="number" placeholder="hp" min="0" v-model="props.row.engineHp" @keyup.enter="editModel(props.row)" style="max-width: 80px">
                  <span class="fuel-table-span">{{ props.row.engineHp }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="number" placeholder="Трасса" min="0" step="0.1" v-model="props.row.engineVol" @keyup.enter="editModel(props.row)" style="max-width: 80px">
                  <span class="fuel-table-span">{{ props.row.engineVol }}</span>
                </td>
                <td class="fuel-table-td">
                  <select class="fuel-table-control form-control form-control-sm d-none fuel-table-control--select" v-model="props.row.gearboxType" @keydown.enter.prevent="editModel(props.row)">
                    <option v-for="gbxType in fuelCatalog.gbxTypes">{{ gbxType }}</option>
                  </select>
                  <span class="fuel-table-span">{{ props.row.gearboxType }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="number" placeholder="Трасса" min="0" max="9" v-model="props.row.gearboxStep" @keyup.enter="editModel(props.row)" style="max-width: 80px">
                  <span class="fuel-table-span">{{ props.row.gearboxStep }}</span>
                </td>
                <td class="fuel-table-td">
                  <select class="fuel-table-control form-control form-control-sm d-none fuel-table-control--select" v-model="props.row.drive" @keydown.enter.prevent="editModel(props.row)">
                    <option v-for="drvType in fuelCatalog.drvTypes">{{ drvType }}</option>
                  </select>
                  <span class="fuel-table-span">{{ props.row.drive }}</span>
                </td>
                <td class="fuel-table-td">
                  <select class="fuel-table-control form-control form-control-sm d-none fuel-table-control--select" v-model="props.row.ecoStd" @keydown.enter.prevent="editModel(props.row)">
                    <option v-for="ecoType in fuelCatalog.ecoTypes">{{ ecoType }}</option>
                  </select>
                  <span class="fuel-table-span">{{ props.row.ecoStd }}</span>
                </td>
                <td class="fuel-table-td">
                  <input class="fuel-table-control form-control form-control-sm d-none" type="text" max="40" v-model="props.row.fuel" @keyup.enter="editModel(props.row)">
                  <span class="fuel-table-span">{{ props.row.fuel }}</span>
                </td>
                <td class="fuel-table-td">
                  <label class="custom-control custom-checkbox"  style="margin: 0 8px">
                    <input type="checkbox" class="custom-control-input fuel-model-input" v-model="selectedModels" :value="props.row.id">
                    <span class="custom-control-indicator"></span>
                  </label>
                </td>
              </template>
            </vue-good-table>

            <button type="button" class="btn btn-sm btn-danger pull-right" @click="deleteSelected" v-if="selectedModels.length">Удалить выбранное</button>
          </div>

          <div class="tab-pane fade" id="set-models">
            <fuelInputGroup :type="tabType" :fuelCatalog="fuelCatalog" :hasModels="hasModels"/>
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
import fuelInputGroup from './reusable/fuelInputGroup'

export default {
  name: 'FuelCatalog',
  components: {
    headers,
    Breadcrumb,
    fuelInputGroup
  },
  data() {
    return {
      tabType: 1, // 1 - get, 2 - set
      selectedModels: [],
      rowsToPrint: [],
      allSelected: false,
      fuelCatalog: [],
      carModels: [],
      hasModels: false,
      loader: false,
      carModelUrl: '',
      columns: [{
        label: 'ID',
        field: 'id',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'производитель',
        field: 'make',
        thClass: 'th-class cursor-pointer',
        type: 'text',
      }, {
        label: 'модель',
        field: 'model',
        thClass: 'th-class cursor-pointer',
        type: 'text',
      }, {
        label: 'кузов',
        field: 'body',
        thClass: 'th-class cursor-pointer',
        type: 'text',
      }, {
        label: 'с',
        field: 'myFrom',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'по',
        field: 'myTo',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'шоссе',
        field: 'fuelRoute',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'город',
        field: 'fuelCity',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'тип дв.',
        field: 'engineType',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'hp',
        field: 'engineHp',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'vol',
        field: 'engineVol',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'тип кп',
        field: 'gearboxType',
        thClass: 'th-class cursor-pointer',
        type: 'text',
      }, {
        label: 'передач',
        field: 'gearboxStep',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'привод',
        field: 'drive',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'экол. стд',
        field: 'ecoStd',
        thClass: 'th-class cursor-pointer',
        type: 'text',
      }, {
        label: 'топливо',
        field: 'fuel',
        thClass: 'th-class cursor-pointer',
        type: 'text',
      }, {
        label: 'deletion',
        field: '',
        thClass: 'th-class cursor-pointer',
        type: 'text',
        sortable: false
      }],
    }
  },
  watch: {
    allSelected() {
      // Тут будут лежать айдишники выбранных моделек (для удаления)
      this.selectedModels = []

      if (this.allSelected) {
        let self = this

        $('.fuel-model-input').each(function() {
          self.selectedModels.push($(this).val())
        });
      }
    },
    selectedModels() {
      // Тут будут лежать модели целиком (для скачивания)
      this.rowsToPrint = [];

      [...this.carModels].forEach((model) => {
        this.selectedModels.forEach((id) => {
          if (model.id == id) {
            this.rowsToPrint.push(model)
          }
        })
      })
    }
  },
  methods: {
    getFuelCatalog () {
      this.$http.get(`${host.host}/Catalog/CarSpec/FuelSystem/ViewItems`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.fuelCatalog = response.body
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    switchTabType(type) {
      setTimeout(() => {
        this.tabType = type
      }, 150)
    },
    refreshEditableFields() {
      $('.fuel-table-control').each(function() {
        $(this).addClass('d-none')
      })
      $('.fuel-table-span').each(function() {
        $(this).removeClass('d-none')
      })
    },
    editModel(model) {
      this.$http.put(`${host.host}/Catalog/CarSpec/FuelSystem/UpdateCarInfo`, model, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.refreshEditableFields()
        return toastr.success('Модель успешно изменена!')
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    deleteSelected() {
      this.$http.delete(`${host.host}/Catalog/CarSpec/FuelSystem/Cars`, {
        body: this.selectedModels,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.allSelected = false;
        /**
         * Удаляем модели из таблицы по индексам
         * @param  {object}
         */
        [...this.carModels].forEach((model) => {
          this.selectedModels.forEach((id) => {
            if (model.id == id) {
              const index = this.carModels.indexOf(model)
              this.carModels.splice(index, 1)
            }
          })
        })
        return toastr.success('Модели успешно удалены!')
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    toggleCellsState(evt) {
      let target = evt.target;

      while (target !== evt.currentTarget) {
        if (target.className == 'fuel-table-td' && target.childNodes[2] && target.childNodes[2].className == 'fuel-table-span') {
          this.refreshEditableFields()
          target.childNodes[2].classList.toggle('d-none') // span
          target.childNodes[0].classList.toggle('d-none') // input
          target.childNodes[0].focus() 
          return;
        }

        target = target.parentNode;
      }
    }
  },
  created () {
    this.getFuelCatalog()
  },
  mounted () {
    this.$on('gotCarModels', function(data) {
      this.carModels = data
      this.hasModels = true
    })

    this.$on('resetFields', function() {
      this.carModels = []
      this.hasModels = false
    })

    this.$on('loader', function(data) {
      this.loader = data
    })

    $('#fuel-catalog').click((evt) => {
      this.toggleCellsState(evt)
    });
  }
}
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .tab-pane
    padding-top: 10px

  .fuel-table-control
    margin-top: -7px
    margin-bottom: -8px
    max-width: 160px
    border-color: #80bdff !important
</style>