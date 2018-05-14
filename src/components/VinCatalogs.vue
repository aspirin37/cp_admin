<template>
  <div class="VinCatalogs">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'VIN каталоги'" :icon="'fa fa-fw fa-list'"></Breadcrumb>

          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#vin-catalog" @click="switchCatalogs(1)">Каталог по вину</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#providers-catalog" @click="switchCatalogs(2)">Каталог по производителю</a>
            </li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane fade active show" id="vin-catalog">
              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>

              <vue-good-table v-if="!loader && vinCatalog.length"
                :columns="vinCatalogColumns"
                :rows="vinCatalog"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                paginate="true"
                :styleClass="'table custom-table'">
                <template slot="table-column" slot-scope="props">
                  <label class="custom-control custom-checkbox" style="margin: 0 8px; float: right" v-if="props.column.label =='deletion'">
                    <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="allSelected">
                    <span aria-hidden="true" class="custom-control-indicator"></span>
                  </label>
                  <span v-else>
                    {{props.column.label}}
                  </span>
                </template>
                <template slot="table-row" slot-scope="props">
                  <td @click="toggleEditing">
                    <input class="catalog-control catalog-control--small form-control form-control-sm d-none" minlength="3" maxlength="3" v-model="props.row.wmi" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.wmi }}</span>
                  </td>
                  <td @click="toggleEditing">
                    <input class="catalog-control catalog-control--small form-control form-control-sm d-none" minlength="3" maxlength="3" v-model="props.row.wis" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.wis }}</span>
                  </td>
                  <td @click="toggleEditing">
                    <input class="catalog-control form-control form-control-sm d-none" maxlength="64" v-model="props.row.make" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.make }}</span>
                  </td>
                  <td @click="toggleEditing">
                    <input class="catalog-control form-control form-control-sm d-none" maxlength="64" v-model="props.row.country" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.country }}</span>
                  </td>
                  <td @click="toggleEditing">
                    <input class="catalog-control form-control form-control-sm d-none" maxlength="200" v-model="props.row.owner" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.owner }}</span>
                  </td>
                  <td @click="toggleEditing">
                    <input class="catalog-control form-control form-control-sm d-none" maxlength="256" v-model="props.row.comment" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.comment }}</span>
                  </td>
                  <td class="fuel-table-td">
                    <label class="custom-control custom-checkbox" style="margin: 0 8px; float: right">
                      <input type="checkbox" class="custom-control-input vin-catalog-input" v-model="selectedModels" :value="props.row.id">
                      <span class="custom-control-indicator"></span>
                    </label>
                  </td>
                </template>
              </vue-good-table>
            </div>

            <div class="tab-pane fade" id="providers-catalog">
              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>

              <vue-good-table v-if="!loader && providersCatalog.length"
                :columns="providersCatalogColumns"
                :rows="providersCatalog"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                paginate="true"
                :styleClass="'table custom-table'">
                <template slot="table-column" slot-scope="props">
                  <label class="custom-control custom-checkbox" style="margin: 0 8px; float: right" v-if="props.column.label =='deletion'">
                    <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="allSelected">
                    <span aria-hidden="true" class="custom-control-indicator"></span>
                  </label>
                  <span v-else>
                    {{props.column.label}}
                  </span>
                </template>
                <template slot="table-row" slot-scope="props">
                  <td @click="toggleEditing">
                    <input class="catalog-control catalog-control--small form-control form-control-sm d-none" minlength="3" maxlength="3" v-model="props.row.wmi" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.wmi }}</span>
                  </td>
                  <td @click="toggleEditing">
                    <input class="catalog-control catalog-control--small form-control form-control-sm d-none" minlength="3" maxlength="3" v-model="props.row.wis" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.wis }}</span>
                  </td>
                  <td @click="toggleEditing">
                    <input class="catalog-control form-control form-control-sm d-none" maxlength="32" v-model="props.row.catalog" @keyup.enter="editModel(props.row)">
                    <span class="catalog-span">{{ props.row.catalog }}</span>
                  </td>
                  <td>
                    <label class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" v-model="props.row.enabled" @change="editModel(props.row)">
                        {{ props.row.enabled ? 'Активен' : 'Не активен' }}
                      <span class="custom-control-indicator"></span>
                    </label>
                    <!-- <span class="catalog-span">{{ props.row.enabled ? 'Активен' : 'Не активен' }}</span> -->
                  </td>
                  <td class="fuel-table-td">
                    <label class="custom-control custom-checkbox" style="margin: 0 8px; float: right">
                      <input type="checkbox" class="custom-control-input providers-catalog-input" v-model="selectedModels" :value="props.row.id">
                      <span class="custom-control-indicator"></span>
                    </label>
                  </td>
                </template>
              </vue-good-table>
            </div>
          </div>

          <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#add-catalog-model">Добавить модель</button>
          <button type="button" class="btn btn-sm btn-danger pull-right" @click="deleteSelected" v-if="selectedModels.length">Удалить выбранное</button>

        </div>
      </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="add-catalog-model">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Добавить модель в каталог</h5>
            <button type="button" class="close cursor-pointer" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-12">

                <form id="add-model-form" @submit.prevent="addModel">
                  <div class="input-group" style="margin-bottom: 8px">
                    <div class="input-group-addon" style="width: 150px">WMI</div>
                    <input class="form-control" v-model="newModel.wmi" minlength="3" maxlength="3" required>
                  </div>
                  <div class="input-group" style="margin-bottom: 8px">
                    <div class="input-group-addon" style="width: 150px">WIS</div>
                    <input class="form-control" v-model="newModel.wis" minlength="3" maxlength="3" required>
                  </div>
                  <div class="input-group" style="margin-bottom: 8px" v-if="selectedCatalog == 1">
                    <div class="input-group-addon" style="width: 150px">Производитель</div>
                    <input class="form-control" v-model="newModel.make" maxlength="64" required>
                  </div>
                  <div class="input-group" style="margin-bottom: 8px" v-if="selectedCatalog == 1">
                    <div class="input-group-addon" style="width: 150px">Страна</div>
                    <input class="form-control" v-model="newModel.country" maxlength="64">
                  </div>
                  <div class="input-group" style="margin-bottom: 8px" v-if="selectedCatalog == 1">
                    <div class="input-group-addon" style="width: 150px">Владелец</div>
                    <input class="form-control" v-model="newModel.owner" maxlength="200">
                  </div>
                  <div class="input-group" style="margin-bottom: 8px" v-if="selectedCatalog == 1">
                    <div class="input-group-addon" style="width: 150px">Комментарий</div>
                    <input class="form-control" v-model="newModel.comment" maxlength="256">
                  </div>
                  <div class="input-group" style="margin-bottom: 8px" v-if="selectedCatalog == 2">
                    <div class="input-group-addon" style="width: 150px">Каталог</div>
                    <input class="form-control" v-model="newModel.catalog" maxlength="32" required>
                  </div>
                  <label class="custom-control custom-checkbox" v-if="selectedCatalog == 2">
                    <input type="checkbox" class="custom-control-input" v-model="newModel.enabled">
                      Активен
                    <span class="custom-control-indicator"></span>
                  </label>
                  
                  <button type="submit" class="btn btn-success pull-right">Добавить модель</button>
                </form> 

              </div>
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
  name: 'VINcatalogs',
  components: {
    headers,
    Breadcrumb
  },
  data() {
    return {
      title: 'VIN каталоги',
      loader: false,
      selectedCatalog: 1, // 1 - vin, 2 - providers
      request: 'WmiTable',
      selectedModels: [],
      newModel: {
        id: '',
        wmi: '',
        wis: '',
        make: '',
        country: '',
        owner: '',
        comment: '',
        catalog: '',
        enabled: false,
      },
      allSelected: false,
      vinCatalog: [],
      vinCatalogColumns: [ {
        label: 'WMI',
        field: 'wmi',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'WIS',
        field: 'wis',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'Производитель',
        field: 'make',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'Страна',
        field: 'country',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'Владелец',
        field: 'owner',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'Комментарий',
        field: 'comment',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'deletion',
        field: '',
        thClass: 'th-class cursor-pointer',
        type: 'text',
        sortable: false
      }],
      providersCatalog: [],
      providersCatalogColumns: [{
        label: 'WMI',
        field: 'wmi',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'WIS',
        field: 'wis',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'Каталог',
        field: 'catalog',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'Статус',
        field: 'enabled',
        thClass: 'th-class cursor-pointer',
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
        switch (self.selectedCatalog) {
          case 1:
          $('.vin-catalog-input').each(function() {
            self.selectedModels.push($(this).val())
          });
          break;
          case 2:
          $('.providers-catalog-input').each(function() {
            self.selectedModels.push($(this).val())
          });
          break;
        }
      }
    },
  },
  methods: {
    switchCatalogs (type) {
      this.allSelected = false
      this.selectedCatalog = type
      this.newModel = {
        id: '',
        wmi: '',
        wis: '',
        make: '',
        country: '',
        owner: '',
        comment: '',
        catalog: '',
        enabled: false,
      }

      this.request = this.selectedCatalog == 1 ? 'WmiTable' : 'WmiMapTable'
      this.refreshEditableFields()
    },
    deleteSelected() {
      this.$http.delete(`${host.host}/Catalog/vin/${this.request}`, {
        body: this.selectedModels,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.allSelected = false;
        const catalog = this.selectedCatalog == 1 ? this.vinCatalog : this.providersCatalog;
        // Удаляем модели из таблицы по индексам
        [...catalog].forEach((model) => {
          this.selectedModels.forEach((id) => {
            if (model.id == id) {
              const index = catalog.indexOf(model)
              catalog.splice(index, 1)
            }
          });
        })
         return toastr.success('Модели успешно удалены!')
       }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error("Ошибка сервера")
      })
    },
    addModel () {
      this.$http.post(`${host.host}/Catalog/vin/${this.request}`, this.newModel, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.selectedCatalog == 1 ? this.vinCatalog.push(this.newModel) : this.providersCatalog.push(this.newModel)
        $("#add-catalog-model").modal('hide')
        this.newModel = {
          id: '',
          wmi: '',
          wis: '',
          make: '',
          country: '',
          owner: '',
          comment: '',
          catalog: '',
          enabled: false,
        }
      }, response => {
        response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    refreshEditableFields() {
      $('.catalog-control').each(function() {
        $(this).addClass('d-none')
      })
      $('.catalog-span').each(function() {
        $(this).removeClass('d-none')
      })
    },
    toggleEditing (evt) {
      let target = evt.target;

      while (target.tagName != 'TD') {
        target = target.parentNode;
      }

      this.refreshEditableFields()

      console.log(target.childNodes)

      target.childNodes[2].classList.add('d-none') // span
      target.childNodes[0].classList.remove('d-none') // input
      target.childNodes[0].focus() 
    },
    editModel (model) {
      this.$http.put(`${host.host}/Catalog/vin/${this.request}`, model, {
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
    getVinCatalog () {
      this.loader = true
      this.$http.get(`${host.host}/Catalog/vin/WmiTable`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        this.vinCatalog = response.body
        this.vinCatalog.forEach((it) => {
          if (it.comment == null) it.comment = ''
        })
      }, response => {
        this.loader = false
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    getProvidersCatalog () {
      this.loader = true
      this.$http.get(`${host.host}/Catalog/vin/WmiMapTable`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        this.providersCatalog = response.body
      }, response => {
        this.loader = false
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },  
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title

    this.getVinCatalog()
    this.getProvidersCatalog()
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px

  .catalog-control--small
    max-width: 80px
</style>