<template>
	<div class="detailPanel">
		<div class="panel">
		  <div class="panel-heading">
  		  <h3 class="panel-title pull-left">Детали</h3>
        <div class="btn-group pull-right">
          <button id="orderRefreshDetails" type="button" class="btn btn-sm btn-warning" @click="uploadDetails">Обновить</button>
          <button type="button" class="btn btn-sm btn-warning" @click="uploadDetails" v-if="newDetails.parts.length != 0 || newDetails.favs.length != 0">Сохранить изменения</button>
          <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#addPartOrLaborModal" @click="getAllDetail" :disabled="updateWork || updateDetail || preOrderActionLoader">Добавить</button>
          <!--delAllDetails-->
          <!-- <button type="button" class="btn btn-danger" @click="selectForDelete" v-if="list != '' || favList != ''" :disabled="updateWork || updateDetail || preOrderActionLoader">
            <span v-if="!isSelectForDelete">Удалить</span>
            <span v-if="isSelectForDelete">Отмена</span>
          </button> -->
        </div>
		  	<div class="clearfix"></div>
	  	</div>
		  <div class="text-center" style="margin-top: 10px;margin-bottom: 10px;" v-if="list == '' && !updateDetail && favList == ''">
			  <span>Ничего не добавлено</span>
		  </div>
      <div v-if="updateDetail" class="text-center">
        <img src="../../../assets/load.svg" alt="load gif" width="40">
      </div>
      <div class="table-responsive">
        <table class="table order-table table-bordered table-responsive" v-if="list != '' && !updateDetail || favList != '' && !updateDetail">
          <thead>
            <tr>
              <th style="width: 40px;text-align: center;" v-if="isSelectForDelete">
                <input type="checkbox" v-model="isChangeSelect" @change="isSelect">
              </th>
              <th>Название</th>
              <th>ОЕМ</th>
              <th class="panel-th alignleft">Производитель</th>
              <th class="panel-th aligncenter">Доставка</th>
              <th class="panel-th nowrap aligncenter">Цена <i class="fa fa-rub"></i></th>
              <th class="panel-th aligncenter">Доступно</th>
              <th>Количество</th>
              <th class="panel-th nowrap aligncenter">Сумма <i class="fa fa-rub"></i></th>
              <th class="panel-th aligncenter">Оплата</th>
              <th class="panel-th aligncenter">Замена</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="(part, index) in list"> 
            <tr>
              <td v-if="isSelectForDelete" class="panel-td text-center" style="vertical-align: middle;"><input type="checkbox" v-model="selected.parts" :value="part" v-if="isSelectForDelete" /></td>
              <td class="panel-td">
                <span>{{ part.Text }}</span><br />
                <small><a href="#" data-toggle="modal" data-target="#addPartOrLaborModal" @click="getPartInModal(part.TreeNodeId, part.CatalogPartId)">Показать в каталоге</a></small>
              </td>
              <td>{{ part.OEM }}</td>
              <td class="panel-td">
                <span v-if="part.Manufacturer == null">Не указано</span>
                <span v-else>{{ part.Manufacturer }}</span>
              </td>
              <td class="panel-td aligncenter">
                <span v-if="part.DeliveryTime == '0001-01-01T00:00:00'">Не указано</span>
                <span v-else>{{ deliveryTimePart(part.DeliveryTime) }}</span>
              </td>
              <td class="panel-td aligncenter">
                <span v-if="part.Price == null">Не указано</span>
                <span v-else>{{ parsePrice(part.Price) }}</span>
              </td>
              <td class="panel-td aligncenter">∞</td>
              <td v-if="part.NumberCustomParts == null" class="aligncenter">
                <span>Не указано</span>
              </td>
              <td class="panel-td" width="135px" v-else>
                <NumberInputSpinner
                   @input="setDetails(index)"
                  :min="0"
                  :max="99"
                  :integerOnly="true"
                  v-model="part.NumberCustomParts"
                  :disabled="orderStatus == 'Archive'"
                />
              </td>
              <td class="panel-td aligncenter">
                <span>{{ parsePrice(part.Price * part.NumberCustomParts) }}</span>
              </td>
              <td class="panel-td">
                <span class="label label-danger" v-if="part.PaidPartially == 0">Не оплачено</span>
                <span class="label label-warning" v-if="part.PaidPartially == 1">Частично</span>
                <span class="label label-success" v-if="part.PaidPartially == 2">Оплачено</span>
              </td>
              <td class="panel-td">
                <button data-toggle="modal" data-target="#fisDetailModal" class="btn btn-primary btn-sm" @click="physicalDetail(part.OEM, part.Id, index, part.NumberCustomParts, false, part.PreOrderOEM)" :disabled="part.PaidPartially == 2 || !canFiz">Заменить</button>
              </td>
              <td class="panel-td"><i class="fa fa-times" @click="delDetail(part.Id)"></i></td>
            </tr>
          </tbody>
          <tbody v-for="(part, index) in favList">
            <tr>
              <td v-if="isSelectForDelete" class="panel-td text-center" style="vertical-align: middle;"><input type="checkbox" v-model="selected.fav" :value="part" v-if="isSelectForDelete" /></td>
              <td class="panel-td"><i data-v-0ac29184="" aria-hidden="true" class="fa fa-star"></i> {{ part.Text }}</td>
              <td class="panel-td">{{ part.OEM }}</td>
              <td class="panel-td">
                <span v-if="part.Manufacturer == null">Не указано</span>
                <span v-else>{{ part.Manufacturer }}</span>
              </td>
              <td class="panel-td aligncenter">
                <span v-if="part.DeliveryTime == '0001-01-01T00:00:00'">Не указано</span>
                <span v-else>{{ deliveryTimePart(part.DeliveryTime) }}</span>
              </td>
              <td class="panel-td aligncenter">
                <span v-if="part.Price == null">Не указано</span>
                <span v-else>{{ parsePrice(part.Price) }}</span>
              </td>
              <td class="panel-td aligncenter">∞</td>
              <td v-if="part.Count == null" class="panel-td aligncenter">
                <span>Не указано</span>
              </td>
              <td class="panel-td" width="135px" v-else>
                <NumberInputSpinner
                  @input="setFavDetails(index)"
                  :min="0"
                  :max="99"
                  :integerOnly="true"
                  v-model="part.Count"
                  :disabled="orderStatus == 'Archive'"
                />
              </td>
              <td class="panel-td aligncenter">
                <span>{{ parsePrice(part.Price * part.Count) }}</span>
              </td>
              <td class="panel-td">
                <span class="label label-danger" v-if="part.PaidPartially == 0">Не оплачено</span>
                <span class="label label-warning" v-if="part.PaidPartially == 1">Частично</span>
                <span class="label label-success" v-if="part.PaidPartially == 2">Оплачено</span>
              </td>
              <td class="panel-td">
                <button data-toggle="modal" data-target="#fisDetailModal" class="btn btn-primary btn-xs" @click="physicalDetail(part.OEM, part.Id, index, part.Count, false, part.PreOrderOEM)" :disabled="part.PaidPartially == 2 || !canFiz">Заменить</button>
              </td>
              <td class="panel-td"><i class="fa fa-times" @click="delFavDetail(part.Id)"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel-footer" v-if="isSelectForDelete">
        <div class="btn-group">
          <button class="btn btn-danger" :disabled="selected.parts == '' && selected.fav == ''" @click="delSelected">Удалить отмеченные ({{selected.parts.length + selected.fav.length }})</button>
        </div>
      </div>
	  </div>
	</div>
</template>

<script>
import numeral from 'numeral'
import NumberInputSpinner from './../../reusable/inputNumber'

export default {
	name: 'detailPanel',
	props: ['updateWork', 'updateDetail', 'preOrderActionLoader', 'list', 'updateDetail', 'favList', 'canFiz', 'orderStatus'],
  data() {
    return {
      isSelectForDelete: false,
      selected: {
        parts: [],
        fav: []
      },
      newDetails: {
        parts: [],
        favs: []
      },
      isChangeSelect: false
    }
  },
  components: {
    NumberInputSpinner
  },
	methods: {
    parsePrice(price) {
      return numeral(price).format('0,0.00');
    },
    deliveryTimePart(time) {
      let delivery = new Date(time.split('T')[0])
      let current = new Date()
      let timeDiff = Math.abs(current.getTime() - delivery.getTime())
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      let total = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if(Number(total) <= 0) return 'На складе'
      else return total+' дней'
    },
    isSelect() {
      if(this.isChangeSelect) {
        this.selectedAll()
      } else {
        this.selected.parts = []
        this.selected.fav = []
      }
    },
    setFavDetails(id) {
      if(this.favList[id].Count < 1) this.favList[id].Count = 1
      if(this.newDetails.favs.indexOf(this.favList[id]) == -1) this.newDetails.favs.push(this.favList[id])
    },
    getPartInModal(tree, catalog) {
      this.$parent.$emit('getPartInModal', {
        tree: tree,
        catalog: catalog
      })
    },
    selectedAll() {
      this.selected.parts = []
      this.selected.fav = []
      for(let i=0;i<this.list.length;i++) {
        this.selected.parts.push(this.list[i])
      }
      for(let i=0;i<this.favList.length;i++) {
        this.selected.fav.push(this.favList[i])
      }
    },
    selectForDelete() {
      if(this.isSelectForDelete) {
        this.selected.parts = []
        this.isChangeSelect = false
      }
      this.isSelectForDelete = !this.isSelectForDelete
    },
    uploadDetails() {

      // for(let i=0;i<this.list.length;i++) {
      //   if(this.list[i].NumberCustomParts > 99) return toastr.error('Максимльное количество деталей 99 штук')
      //   if(this.list[i].NumberCustomParts <= 0) return toastr.error('Минимальное количество деталей 1 штука')
      // }
      // for(let i=0;i<this.favList.length;i++) {
      //   if(this.favList[i].Count > 99) return toastr.error('Максимльное количество деталей 99 штук')
      //   if(this.favList[i].Count <= 0) return toastr.error('Минимальное количество деталей 1 штука')
      // }
      this.$parent.$emit('uploadDetailsCounts', {
        parts: this.newDetails.parts,
        favs: this.newDetails.favs,
      })
      this.newDetails.parts = []
      this.newDetails.favs = []
    },
    setDetails(id) {
      if(this.list[id].NumberCustomParts < 1) this.list[id].NumberCustomParts = 1
      if(this.newDetails.parts.indexOf(this.list[id]) == -1) this.newDetails.parts.push(this.list[id])
    },
    parseOem(oem) {
      return oem.replace(/ /g,'')
    },
    delSelected() {
      this.$parent.$emit('delSelected', {
        parts: this.selected.parts,
        fav: this.selected.fav,
      })
      this.selectForDelete()
    },
		getAllDetail() {
			this.$parent.$emit('getAllDetail')
		},
		delDetail(id) {
			this.$parent.$emit('delDetailOrder', id)
		},
    delFavDetail(id) {
      this.$parent.$emit('delFavDetail', id)
    },
    delAllDetails() {
      this.$parent.$emit('delAllDetails')
    },
    physicalDetail(oem, catalogId, index, num, isFav, preorderOem) {
      this.$parent.$emit('physicalDetailOrder', oem, catalogId, index, num, isFav, preorderOem)
		}
  }
}
</script>

<style scoped>
  .panel-footer {
    padding: 0;
    height: 60px;
  }
  .panel-footer .btn-group {
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

.order-table
  margin-bottom: 0
</style>