<template>
	<div class="workPanel">
		<div class="panel">
		  <div class="panel-heading">
  		  <h3 class="panel-title pull-left">Работы</h3>
        <div class="btn-group pull-right">
          <button id="orderRefreshLabors" type="button" class="btn btn-sm btn-warning" @click="uploadWorks" style="display: none;">Обновить</button>
          <button type="button" class="btn btn-sm btn-warning" @click="uploadWorks" v-if="newWorks.labors.length != 0 || newWorks.typicals.length != 0" :disabled="updateWork || updateDetail || preOrderActionLoader">Сохранить изменения</button>
          <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#addPartOrLaborModal" @click="getAllDetail" :disabled="updateWork || updateDetail || preOrderActionLoader">Добавить</button>

          <!-- <button type="button" class="btn btn-danger" @click="selectForDelete" v-if="list != '' || typical != ''" :disabled="updateWork || updateDetail || preOrderActionLoader">
            <span v-if="!isSelectForDelete">Удалить</span>
            <span v-if="isSelectForDelete">Отмена</span>
          </button> -->
        </div>

  		  <div class="clearfix"></div>
		  </div>
		  <div class="text-center" style="margin-top: 10px;margin-bottom: 10px;" v-if="list == '' && !updateWork && typical == ''">
  		  <span>Ничего не добавлено</span>
		  </div>
      <div v-if="updateWork" class="text-center">
        <img src="../../../assets/load.svg" alt="load gif" width="40"> 
      </div>
      <div class="table-responsive">
        <table class="table order-table table-bordered table-responsive" v-if="list != '' && !updateWork || typical != '' && !updateWork">
          <thead>
            <tr>
              <th class="panel-th" style="width: 40px;text-align: center;" v-if="isSelectForDelete">
                <input type="checkbox" v-model="isChangeSelect" @change="isSelect">
              </th>
              <th class="panel-th" style="white-space: nowrap;">Описание</th>
              <th class="panel-th">Примечание</th>
              <th class="panel-th" style="white-space: nowrap;">Длительность (ч)</th>
              <th class="panel-th">Количество</th>
              <th class="panel-th" style="width: 35px;"></th>
            </tr>
          </thead>
          <tbody v-for="(labor, index) in list">
            <tr class="workList">
              <td v-if="isSelectForDelete" class="panel-td text-center" style="vertical-align: middle;">
                <input type="checkbox" v-model="selected.labors" :value="labor" v-if="isSelectForDelete" />
              </td>
              <td class="panel-td">
                <span>{{ labor.Text }}</span>
                <small><a href="#" @click="getLaborInModal(labor.FromPartId, labor.LaborId, labor.FromPartCatalogType)">(Показать в каталоге)</a></small>
              </td>
              <td class="panel-td">
                <span v-if="labor.Note != '' && labor.Note != null && labor.Note != undefined">{{ labor.Note }}</span>
                <span v-else>Не указано</span>
              </td>
              <td class="panel-td">{{ labor.Time }}</td>
              <td class="panel-td" width="135px">
                <NumberInputSpinner
                  @input="setWork(index)"
                  :min="0"
                  :max="99"
                  :integerOnly="true"
                  :value="labor.NumberCustomLabors"
                  v-model="labor.NumberCustomLabors"
                  :disabled="orderStatus == 'Archive'"
                />
              </td>
              <td class="panel-td"><i class="fa fa-times" @click="delLabot(labor.Id)"></i></td>
            </tr>
          </tbody>
          <tbody v-for="(typ, index) in typical">
            <tr class="workList">
              <td v-if="isSelectForDelete" class="panel-td text-center" style="vertical-align: middle;">
                <input type="checkbox" v-model="selected.typicals" :value="typ" v-if="isSelectForDelete" />
              </td>
              <td class="panel-td">
                <span><i aria-hidden="true" class="fa fa-star"></i>{{ typ.Text }}</span>
                <small><a href="#" data-toggle="modal" data-target="#addPartOrLaborModal" @click="getTypicalLaborInModal(typ.NodeId)">(Показать в каталоге)</a></small>
              </td>
              <td class="panel-td">
                <span v-if="typ.Note != '' && typ.Note != null && typ.Note != undefined">{{ typ.Note }}</span>
                <span v-else>Не указано</span>
              </td>
              <td class="panel-td">{{ typ.Time }}</td>
              <td class="panel-td" width="135px">
                <NumberInputSpinner
                  @input="setTypical(index)"
                  :min="0"
                  :max="99"
                  :integerOnly="true"
                  :value="typ.Amount"
                  v-model="typ.Amount"
                  :disabled="orderStatus == 'Archive'"
                />
              </td>
              <td class="panel-td"><i class="fa fa-times" @click="delTypical(typ.Id)"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel-footer panel-footer-delete" v-if="isSelectForDelete">
        <div class="btn-group">
          <button class="btn btn-danger" @click="delSelected" :disabled="checkSelected">Удалить отмеченные ({{selected.labors.length + selected.typicals.length}})</button>
        </div>
      </div>
      <div class="panel-footer" v-if="list != '' && !updateWork || typical != '' && !updateWork">
        <span>Итого: {{ totalLaborTime.toFixed(2) }} часов</span>
      </div>
	  </div>
	</div>
</template>

<script>
import NumberInputSpinner from './../../reusable/inputNumber'

export default {
	name: 'workPanel',
	props: ['updateWork', 'updateDetail', 'preOrderActionLoader', 'list', 'typical', 'orderStatus'],
  data() {
    return {
      isSelectForDelete: false,
      selected: {
        labors: [],
        typicals: []
      },
      newWorks: {
        labors: [],
        typicals: []
      },
      isChangeSelect: false
    }
  },
  components: {
    NumberInputSpinner
  },
	computed: {
    checkSelected() {
      if(this.selected.labors == '' && this.selected.typicals == '') return true
      else return false
    },
    totalLaborTime() {
      let labor = this.list.reduce((total, item) => {
        return total + (item.Time * item.NumberCustomLabors)
      }, 0)
      let typical = this.typical.reduce((total, item) => {
        return total + (item.Time * item.Amount)
      }, 0)
      return labor+typical
    }
  },
	methods: {
    isSelect() {
      if(this.isChangeSelect) {
        this.selectedAll()
      } else {
        this.selected.labors = []
        this.selected.typicals = []
      }
    },
    getLaborInModal(partId, laborId, type) {
      if(type == 0) {
        $("#addPartOrLaborModal").modal('show');
        this.$parent.$emit('getLaborInModal', {
          part: partId,
          labor: laborId
        })
      } else if(type == 1) {
        //$("#addPartOrLaborModal").modal('show');
        toastr.info('In process..')
      }
    },
    getTypicalLaborInModal(node) {
      this.$parent.$emit('getTypicalLaborInModal', node)
    },
    delSelected() {
      this.$parent.$emit('delSelectedLabors', { labors: this.selected.labors, typicals: this.selected.typicals })
      this.selectForDelete()
    },
    selectedAll() {
      this.selected.labors = []
      this.selected.typicals = []
      for(let i=0;i<this.list.length;i++) {
        this.selected.labors.push(this.list[i])
      }
      for(let i=0;i<this.typical.length;i++) {
        this.selected.typicals.push(this.typical[i])
      }
    },
    selectForDelete() {
      if(this.isSelectForDelete) {
        this.selected.labors = []
        this.isChangeSelect = false
        this.selected.typicals = []
      }
      this.isSelectForDelete = !this.isSelectForDelete
    },
    setTypical(index) {
      if(this.newWorks.typicals.indexOf(this.typical[index]) == -1) this.newWorks.typicals.push(this.typical[index])
    },
    uploadWorks() {
      /*for(let i=0;i<this.newWorks.length;i++) {
        if(Number(this.newWorks[i].NumberCustomLabors) < 1) return toastr.error('Минимальное количество работ 1')
        if(Number(this.newWorks[i].NumberCustomLabors) > 99) return toastr.error('Максимальное количество работ 99')
      }*/
      this.$parent.$emit('uploadWorks', { labors: this.newWorks.labors, typicals: this.newWorks.typicals})
      this.newWorks.labors = []
      this.newWorks.typicals = []
    },
    setWork(index) {
      if(this.newWorks.labors.indexOf(this.list[index]) == -1) this.newWorks.labors.push(this.list[index])
    },
    delTypical(id) {
      this.$parent.$emit('delAllTypical', id)
    },
		getAllDetail() {
			this.$parent.$emit('getAllDetail')
		},
		delLabot(id) {
      this.$parent.$emit('delLabotOrder', id)
		},
    delAllLabor() {
      this.$parent.$emit('delAllLabor')
    }
  },
  mounted(){
    console.log('WORKPANEL')
    console.log(this)
  }
}
</script>

<style scoped>
  .panel-footer-delete {
    padding: 0;
    height: 60px;
  }
  .panel-footer-delete .btn-group {
    margin-top: 12px;
    margin-left: 15px;
  }
   .modalLink {
    cursor: pointer;
  }
  .modalLink:hover {
    background-color: #f5f5f5;
  }
</style>

<style lang="sass" scoped>

.panel 
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
  box-shadow: 0 1px 1px rgba(0,0,0,.05);

.panel-heading 
  color: #333;
  background-color: #f5f5f5;
  border-color: #ddd;
  padding: 0 15px;
  padding-right: 0
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;

.panel-heading h3 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: normal;
  width: 45%;
  padding-top: 8px;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 16px;
  color: inherit;

.panel-th,
.panel-td 
  padding: 0.4rem 0.75rem

.panel-footer
  padding: 5px 15px

  
</style>