<template>
<div>
  <div id="getLaborsModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Работы для детали</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs" id="labors" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="getLabors-tab" data-toggle="tab" href="#getLabors" role="tab" aria-controls="getLabors" aria-selected="true">Работы</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="getCars-tab" data-toggle="tab" href="#getCars" role="tab" aria-controls="getCars" aria-selected="true">Автомобили</a>
            </li>
          </ul>
          <div class="tab-content" id="laborsContent">
            <div class="tab-pane fade show active" id="getLabors" role="tabpanel" aria-labelledby="getLabors-tab">
              <span class="modalTitle"><b>Работы для детали c OEM {{ id }}:</b></span>
              <div class="thumbnail" style="min-height: 45vh;border-radius: 0;padding: 0;">

                <div v-if="works.length == 0" class="text-center">
                  <span>Не найдено</span>
                </div>

                <ul class="list-group" style="margin-top: 0px;margin-left: -1px;" v-if="works.length != 0">
                  <li class="list-group-item checkbox" style="border-radius: 0px !important;padding-top: 10px;text-align: left;margin-bottom: 0px;" v-for="workDetail in works">
                    <span><b>{{ workDetail.Text }}</b> за <i class="fa fa-clock-o"></i> <b>{{ workDetail.Time }}</b> часов</span><br>
                    <span v-if="workDetail.Note != ''"><b>Заметка: </b>{{ workDetail.Note }}</span><br v-if="workDetail.Note != ''">
                    <span v-if="workDetail.ModelInfo != ''"><b>Для модели: </b>{{ workDetail.ModelInfo }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="tab-pane fade" id="getCars" role="tabpanel" aria-labelledby="getCars-tab">
              <div>
                <button type="button" class="btn btn-primary" style="margin-top:5px" data-toggle="modal" data-target="#addCar"><i class="fa fa-plus-square-o" aria-hidden="true"></i> Добавить</button>
                <button type="button" class="btn btn-info pull-right" :class="{'btn-warning':assigned.length > selectedCars.length,'btn-danger':assigned.length == selectedCars.length}" style="margin-top:5px" @click="toggleAllCars"><i class="fa" :class="{'fa-crosshairs':assigned.length > selectedCars.length,'fa-ban':assigned.length == selectedCars.length}" aria-hidden="true"></i> {{ assigned.length == selectedCars.length?'Отменить выбор':'Выбрать все' }}</button>
              </div>
              <div class="thumbnail" style="min-height: 45vh;border-radius: 0;padding: 0;margin-top:5px">
                <div v-if="assigned.length == 0" class="text-center">
                  <span>Не найдено</span>
                </div>
                <table v-if="assigned.length != 0" class="table table-bordered dataTable table-sm" width="100%" id="dataTable" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
                  <thead>
                    <tr role="row">
                      <th class="sorting_asc text-center" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1" aria-sort="ascending"></th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Марка</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Модель</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Полное название</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Период</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Двигатель</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">Литраж</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1">BaseCode</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr role="row" class="odd" v-for="row in assigned">
                      <td class="sorting_1 text-center">
                        <input @click="togleCar(row.Id)" class="form-check-input position-static" style="margin:auto" type="checkbox" id="blankCheckbox" :value="row.Id" :checked="selectedCars.indexOf(row.Id) != -1 ">
                      </td>
                      <td>{{ row.Make }}</td>
                      <td>{{ row.Name }}</td>
                      <td>{{ row.NameLong }}</td>
                      <td>{{ row.YearStart }} - {{ row.YearEnd }}</td>
                      <td>{{ row.Engine }}</td>
                      <td>{{ row.Volume }}</td>
                      <td>{{ row.BaseCode }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal" data-toggle="modal" data-target="#addPartOrLaborModal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
  <addCar :selectedCar="selectedCar"></addCar>
</div>
</template>

<script>
import host from '../../data/host.js'
import addCar from './AddCar'

export default {
  name: 'showLabors',
  data () {
    return {
      selectedCars: [],
      selectAll: false
    }
  },
  components: {
    addCar
  },
  props: ['works','id','assigned','selectedCar'],
  methods: {
    closeModal () {
      $('#getLaborsModal').modal('hide')
    },
    getAssignedCarModels () {
      this.$parent.$emit('getAssignedCarModels', true)
    },
    togleCar (id) {
      let index = this.selectedCars.indexOf(id)
      if (index === -1) this.selectedCars.push(id)
      else this.selectedCars.splice(index,1)
    },
    toggleAllCars () {
      if (this.assigned.length > this.selectedCars.length) {
        this.selectAll = true
        this.selectedCars = []
        for (let i = 0; i < this.assigned.length; i++) {
          this.selectedCars.push(this.assigned[i].Id)
        }
      } else {
        this.selectAll = false
        this.selectedCars = []
      }
    }
  },
  created() {
    
  },
  mounted() {
    this.$on('getAssignedCarModels', function(data) {
      this.getAssignedCarModels(data)
    })
  }
}
</script>

<style scoped>
  .selectedStuff {
    text-align: left;
    margin-left: -1px;
    margin-top: -1px;
    width: calc(100% + 2px);
  }
  
  .selectedStuff .list-group-item {
    border-radius: 0;
  }
  
  .typicalList-group {
    margin-bottom: 0px;
    text-align: left;
    border-radius: 0px;
    margin-left: -1px;
    width: calc(100% + 2px);
    margin-top: -1px;
  }
  
  .typicalList-group li:last-child {
    border-radius: 0px;
  }
  
  .image_detail {
    width: 59px;
    height: 80px;
    outline: 2px solid red;
    position: absolute;
    top: 177px;
    left: 657px;
  }
  
   ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  
   ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
  
  .modalTitle {
    position: relative;
    top: -5px;
  }
  
  .noresize {
    resize: none;
  }
  
  .nav-pills>li+li {
    margin-left: 0;
  }
  
  i,
  .activeItem {
    cursor: pointer;
  }
  
  .thumbnail {
    overflow: auto;
    max-height: 175px;
    min-height: 175px;
  }
  
  .activeLink {
    cursor: pointer;
  }
  
  .detail {
    outline: 2px solid red;
    position: absolute;
  }
  
  .detail:hover {
    background: red;
    opacity: 0.4;
    cursor: pointer;
  }
  
  .btn-resize button {
    position: absolute;
    z-index: 2;
    opacity: 0.9;
  }
  
  .btn-resize button {
    width: 35px;
    height: 35px;
  }
  
  .btn-resize button:last-child {
    margin-left: 40px;
  }
  
  .search-labor {
    padding: 5px;
    position: fixed;
    width: 400px;
    z-index: 3;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }
  
  .typical-list {
    /*margin-top: 45px;*/
  }
  
  .treeSearch-control {
    padding: 5px;
    position: fixed;
    width: 290px;
    z-index: 3;
    background: #fff;
    border-bottom: 1px solid #ccc;
  }
  
  .tree-list {
    /*margin-top: 45px;*/
  }
  
  .favorite-details {
    text-align: left;
    margin-top: -1px;
    margin-left: -1px;
    width: calc(100% + 2px);
    margin-bottom: 0 !important;
  }
  
  .favorite-details a {
    border-radius: 0;
  }
  
  .thumbnail-searchDetails {
    padding: 0;
    min-height: 100%;
    width: calc(100% + 2px);
    height: 34px;
    border-radius: 0;
    overflow: hidden;
    margin-bottom: 15px;
  }
  
  .thumbnail-searchDetails .input-group {
    width: calc(100% + 3px);
    margin-left: -1px;
    margin-top: -1px;
  }
  
  .thumbnail-searchDetails .input-group .form-control {
    box-shadow: none;
    border: none;
    border-right: 1px solid #ddd;
  }
  
  .thumbnail-searchDetails .input-group .input-group-addon {
    border-radius: 0;
  }
  
  .loaderOemSearch {
    margin-top: 20px;
  }
  
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    background-color: #fff;
  }
  
  .h4,
  h4 {
    font-size: 18px;
  }
  
  .modal-title {
    margin: 0;
    line-height: 1.42857143;
  }
  
  .close {
    float: right;
    font-size: 21px;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    filter: alpha(opacity=20);
    opacity: .2;
  }
  
  .btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
  }
  
  .btn-default.active,
  .btn-default:active,
  .open>.dropdown-toggle.btn-default {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }
  
  .btn-default.active.focus,
  .btn-default.active:focus,
  .btn-default.active:hover,
  .btn-default:active.focus,
  .btn-default:active:focus,
  .btn-default:active:hover,
  .open>.dropdown-toggle.btn-default.focus,
  .open>.dropdown-toggle.btn-default:focus,
  .open>.dropdown-toggle.btn-default:hover {
    color: #333;
    background-color: #d4d4d4;
    border-color: #8c8c8c;
  }
  
  .btn-default {
    color: #333;
    background-color: #fff;
    border-color: #ccc;
  }

  .modal-body {
    font-size: 14px;
  }
  .thumbnail {
    display: block;
    padding: 4px;
    margin-bottom: 20px;
    line-height: 1.42857143;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    -webkit-transition: border .2s ease-in-out;
    -o-transition: border .2s ease-in-out;
    transition: border .2s ease-in-out;
}
#getLabors {
  margin-top: 20px
}
.modal-dialog.modal-lg {
  margin-top: 50px;
}
</style>