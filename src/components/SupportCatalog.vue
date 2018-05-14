<template>
  <div class="Sto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Каталог'" :icon="'fa fa-fw fa-list'"></Breadcrumb>
          <div class="col-md-12 row">

            <div class="col-md-3 text-center">

              <div class="thumbnail" style="padding: 0;min-height: 400px;border-radius: 0px;overflow-x: hidden;overflow-y: auto;width: calc(100% + 2px);">
                <div v-if="typicalTreeLoader" class="text-center">
                  <img src="../assets/load.svg" alt="load gif" width="40">
                </div>

                <catalog-tree
                  v-if="typicalTree.length != 0"
                  :data="typicalTree"
                  :admin="admin">
                </catalog-tree>

              </div>
            </div>

            <div class="col-md-8">
              <div class="thumbnail">

                <div v-if="loaderTypical" class="text-center">
                  <img src="../assets/load.svg" alt="load gif" width="40">
                </div>

                <div class="form-group d-flex" v-if="!loaderTypical && selectedCategory.value">
                  <div class="col-lg-9">
                    <label class="form-control-label">Категория:</label>
                    <v-select v-model="selectedCategory" :options="categories" placeholder="Выберите из списка"></v-select>
                  </div>
                  <button type="button" class="btn btn-primary align-self-end" @click="changeCategory">Сменить категорию</button>
                </div>

                <ul class="list-group typicalList-group" id="laborsList" style="margin-bottom: 15px" v-if="!loaderTypical">
                  <li class="list-group-item d-flex justify-content-end" 
                      v-for="work in typicalWorkList"
                      v-if="!work.isRemoved">

                    <span class="col-lg-8" style="" v-if="!work.isEditing">{{ work.Text }}</span>
                    <input class="form-control col-lg-7" type="text" v-else v-model="work.Text" style="margin-right: auto; padding: 8px 14px" @keyup.enter="editLabor(work.Id, work.Text, work.Time)">

                    <b class="col-lg-2" style="margin-left: auto; margin-right: 14px" v-if="!work.isEditing"> {{ work.Time }} ч. </b>
                    <input class="form-control col-lg-2" type="number" step="0.1" v-else  v-model="work.Time" style="margin-right: 15px; padding: 8px 14px" @keyup.enter="editLabor(work.Id, work.Text, work.Time)">

                    <div class="col-lg-2 text-right">
                      <a href="#" class="text-secondary" @click.prevent style="position: relative; top: 2px"><span class="fa fa-fw fa-lg fa-pencil-square-o" @click="refreshEditingLabors(); work.isEditing = true"></span></a>
                      <a href="#" class="text-secondary" @click.prevent><span class="fa fa-fw fa-lg fa-trash" @click="deleteLabor(work.Id); work.isRemoved = true"></span></a>
                    </div>
                  </li>

                  <li class="list-group-item" v-if="selectedNode">
                    <form class=" d-flex justify-content-end" @submit.prevent="addLabor">
                      <input class="form-control col-lg-7" type="text" v-model="newLaborText" style="margin-right: auto; padding: 8px 14px" placeholder="Введите название работы">
                      <input class="form-control col-lg-2" type="number" step="0.1" v-model="newLaborTime" style="margin-right: 15px; padding: 8px 14px" placeholder="часы">
                      <button class="btn btn-success col-lg-2" type="submit">Добавить</button>
                    </form>
                  </li>
                </ul>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import host from '../data/host.js'
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import catalogTree from './catalogTree'

export default {
  name: 'SupportCatalog',
  components: {
    host,
    headers,
    Breadcrumb,
    catalogTree
  },
  data(){
    return {
      typicalTree: [],
      typicalWorkList: [],
      categories: [],
      selectedNode: 0,
      selectedCategory: {
        label: 'Выберите категорию',
        value: 0
      },
      typicalTreeLoader: false,
      loaderTypical: false,
      activeTypical: '',
      admin: true,
      newLaborText: '',
      newLaborTime: '',
    }
  },
  methods: {
    getTypicalLabors() {
      this.typicalTreeLoader = true
      this.$http.get(`${host.host}/Catalog/Typical/Tree`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.typicalTreeLoader = false
        let data = response.body

        this.typicalTree[0] = {
          id : 0,
          parent : "#",
          text : "Каталог",
          state: {
            selected: true,
            opened: true,
            disabled: true
          }
        }

        data.forEach((it) => {
          this.typicalTree.push({
            id: it.id,
            parent: it.parentId,
            text: it.text,
            data: {
              value: it.categoryId,
              label: it.category
            }
          })
        })

      }, response => {
        this.typicalTreeLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    getCategories() {
      this.$http.get(`${host.host}/Catalog/Typical/Categories`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        response.body.forEach((it) => {
          this.categories.push({
            label: it.name,
            value: it.id
          })
        })
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    changeCategory() {
      this.$http.put(`${host.host}/Catalog/Typical/Nodes/Category?nodeId=${this.selectedNode}&newCategoryId=${this.selectedCategory.value}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        return toastr.success('Категория успешно изменена')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    deleteLabor(id) {
      let confirmation = confirm('Вы действительно хотите удалить работу?')
      if (!confirmation) return 
        
      this.$http.delete(`${host.host}/Catalog/Typical/Labor?laborId=${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        return toastr.success('Работа успешно удалена')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    refreshEditingLabors() {
      this.typicalWorkList.forEach((it) => {
        it.isEditing = false
      })
    },
    editLabor(id, text, time) {
      if (!text.length || text.length > 64) return toastr.error('Наименование работы должно содержать от 1 до 64 символов')
      if (time == 0 || time > 100) return toastr.error('Указано слишком большое время работы (более 100 часов)')

      this.$http.put(`${host.host}/Catalog/Typical/Labors`, {
        laborId: id,
        title: text,
        time: time
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.refreshEditingLabors()
        return toastr.success('Параметры работы успешно изменены')
      }, response => {
        return toastr.error('Ошибка сервера')
      }) 
    },
    addLabor() {
      if (!this.newLaborText.length || this.newLaborText.length > 64) return toastr.error('Наименование работы должно содержать от 1 до 64 символов')
      if (this.newLaborTime > 100) return toastr.error('Указано слишком большое время работы (более 100 часов)')
      if (this.newLaborTime == 0) return toastr.error('Укажите время работы')

      this.$http.post(`${host.host}/Catalog/Typical/Labors`, {
        nodeId: this.selectedNode,
        title: this.newLaborText,
        time: this.newLaborTime
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        console.log(response.body)
        this.refreshEditingLabors()
        this.typicalWorkList.push({
          Id: response.body.id,
          Type: response.body.type,
          NodeId: response.body.nodeId,
          Text: response.body.text,
          Time: response.body.time,
          isEditing: false,
          isRemoved: false
        })
        return toastr.success('Работа успешно добавлена')
      }, response => {
        return toastr.error('Ошибка сервера')
      }) 
    }
  },
  created() {
    this.getTypicalLabors()
    this.getCategories()
  },
  mounted() {
    let self = this
    this.$on('getLoaderTypical', function(data) {
      this.loaderTypical = data
    }),
    this.$on('getTypicalWork', function(data) {
      this.typicalWorkList = data
    }),
    this.$on('getChildTypicalWork', function(data) {
      this.typicalWorkList = data
    })
    this.$on('getNodeCategory', function(data) {
      this.selectedCategory = data
    })
    this.$on('selectNode', function(data) {
      this.selectedNode = data
    })
  }
}
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style lang="sass">
  .container-fluid
    margin-top: 55px

  .typicalList-group 
    margin-bottom: 0px;
    text-align: left;
    border-radius: 0px;
    margin-left: -1px;
    width: calc(100% + 2px);
    margin-top: -1px;

  .typicalList-group li:last-child 
    border-radius: 0px;
</style>