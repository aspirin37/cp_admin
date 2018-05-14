<template>
	<div class="modal fade" id="addPartOrLaborModal">
	  <div class="modal-dialog modal-lg" role="document" style="max-width: 95%;width: 100%;">
	    <div class="modal-content">

        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">
            Выбор деталей и работ для <b>{{ carInfo.Make }} {{ carInfo.Model }}</b>
          </h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="row">


            <div class="col-md-12 form-group">
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-default" :class="{ active: deType == 1 }" @click="newDetailType(1)">
                  Общие работы
                </button>
                <button type="button" class="btn btn-default" :class="{ active: deType == 2 }" @click="newDetailType(2)">
                  По ОЕМ
                </button>
                <button type="button" class="btn btn-default" :class="{ active: deType == 4 }" @click="newDetailType(4)">
                  Избранные детали <i class="fa fa-star"></i>
                </button>
              </div>

              <div class="btn-group" role="group" style="margin-left: 20px;">
                <button type="button" class="btn btn-default" :class="{ active: deType == 3 }" @click="newDetailType(3)">
                  Выбранные детали ({{infoAboutDetail.length + selectedFavParts.length }}) и работы ({{getInfoAboutWork.length + listTypicalLabors.length}})
                </button>
              </div>

              <div class="btn-group pull-right" style="margin-top: 10px;">
                <b><span class="fa fa-wrench" aria-hidden="true"></span>
                  Сопровождается работами
                </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b><span class="fa fa-map-marker" aria-hidden="true"></span>
                  Позиция на картинке
                </b>
              </div>
              <hr />
            </div>

<!-- deltype 1 -->
            <div v-if="deType == 1" class="col-md-12 row">
              
                <div class="col-md-3 text-center">
                  <span class="modalTitle">Дерево общих работ:</span>

                  <div class="thumbnail" style="padding: 0;min-height: 400px;border-radius: 0px;overflow-x: hidden;overflow-y: auto;width: calc(100% + 2px);">
                    <div v-if="typicalTreeLoader" class="text-center">
                      <img src="../assets/load.svg" alt="load gif" width="40">
                    </div>

                    <div class="typical-list">
                      <typical-tree
                        v-if="typicalTree.length != 0"
                        :data="typicalTree"
                        :selectedTypical="selectedTypical"
                      ></typical-tree>
                    </div>
                  </div>
                </div>

                <div class="col-md-9 text-center" style="margin-top: -10px;">
                  <span class="modalTitle">Найденные работы:</span>
                  <div class="thumbnail" style="padding: 0;min-height: 400px;border-radius: 0px;overflow-x: hidden;overflow-y: auto;">

                    <div v-if="loaderTypical" class="text-center">
                      <img src="../assets/load.svg" alt="load gif" width="40">
                    </div>

                    <ul class="list-group typicalList-group" v-if="!loaderTypical">
                      <li class="list-group-item" v-for="work in typicalWorkList" :class="{ active: activeTypical === work.Id }" @click="setActiveTypical(work.Id)">
                      <input type="checkbox" style="margin-left: 0px !important;" v-model="listTypicalLabors" :value="work" >
                      <b>{{ work.Text }} - {{ work.Time }} (ч.) </b></li>
                    </ul>
                  </div>
                </div>

            </div>



<!-- deltype 2 -->
            <div v-if="deType == 2" class="col-md-12 row">
              <div class="col-md-3 text-center" style="margin-top: -10px;">

                <div class="btn-group btn-tree-group">
                  <button type="button" class="btn btn-default" :class="{ active: treesType == 1 }" @click="setTreesType(1)">Дерево АМ</button>
                  <button type="button" class="btn btn-default" :class="{ active: treesType == 2 }"@click="setTreesType(2)">Поиск</button>
                </div>

                <div class="input-group" v-if="treesType == 2">
                  <input type="text" class="form-control" placeholder="Поиск по деталям" v-model="searchDetailsText" @keyup.enter="searchDetails">
                  <span class="input-group-btn">
                    <button class="btn btn-success" type="button" @click="searchDetails" :disabled="data.length == 0">Найти</button>
                  </span>
                </div>

                <br />

                <!-- <div class="text-center" v-if="searchDetailsLoader">
                  <img src="../assets/load.svg" alt="load gif" width="40">
                </div> -->

                <div class="thumbnail" v-if="treesType == 2 && foundedDetails.length != 0 && !searchDetailsLoader" style="min-height: 292px;text-align: left;padding: 0;overflow-x: hidden;">

                  <div class="list-group" v-if="!searchDetailsLoader && foundedDetails.length != 0" style="padding-left: 0;margin-bottom: 20px;width: calc(100% + 2px);margin-left: -1px;margin-top: -1px;">
                    <a class="list-group-item" v-for="detail in foundedDetails" @click="selectInTreeDetails(detail)">
                      <b>{{ detail.Text }}</b>
                      <br /><b>ОЕМ: {{ detail.Oem }}</b>
                    </a>
                  </div>

                </div>

                <p v-if="treesType == 2 && !searchDetailsLoader && foundedDetails.length == 0">Ничего не найдено</p>

                <div v-if="treesType == 1" class="thumbnail" style="padding: 0;min-height: 321px;border-radius: 0px;overflow-x: hidden;overflow-y: scroll;">

                  <div v-if="oemDetailsLoader" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>

                  <tree
                    v-if="this.$store.state.selorder.trees.length != 0"
                    :data="this.$store.state.selorder.trees"
                    :carModel="carInfo.Model"
                    :carId="carInfo.UserCarId || carInfo.Id"
                    :vehid="vehid"
                    :openNode="openNode">
                  </tree>

                </div>

              </div>

              <div class="col-md-6 text-center relative" style="margin-top: -10px;">
                <span class="modalTitle">Иллюстрация</span>
                <div class="thumbnail" style="min-height: 370px;border-radius: 0px;">
                  <div class="text-left btn-resize" v-if="!pictureLoader && detailImage != null && detailImage != ''">
                    <button class="btn btn-primary" @click="scaleImgPlus">+</button>
                    <button class="btn btn-primary" @click="scaleImgMinus">-</button>
                  </div>

                  <div style="transform-origin: top left;max-height: 100vh;float: left;" v-if="!pictureLoader && detailImage != null && detailImage != ''" :style="{ transform: 'scale('+scaleImg+')' }">
                    <img :src="detailImage" v-if="!pictureLoader && detailImage != ''" style="width: auto;max-height: 100%;max-width: none;"/>

                    <div v-if="!pictureLoader && detailImage != ''"
                      class="detail" v-for="pic in coordSchema"
                      @click="backLight(pic)"
                      :style="{
                        width: pic.Width + 'px',
                        height: pic.Height + 'px',
                        left: pic.X + 'px',
                        top: pic.Y + 'px'
                      }"
                    >
                      <span class="tooltiptext" :style="{ transform: 'translateY(-50%) scale('+ 1 / scaleImg +')' }">{{ tooltipText(pic.Index) }}</span>


                    </div>

                  </div>

                  <div v-if="pictureLoader" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>
                  <p v-if="detailImage == null && !pictureLoader">Не указана</p>

                </div>
              </div>

              <div class="col-md-3 text-center" style="margin-top: -10px;">
                <span class="modalTitle">Детали:</span>
                <div class="thumbnail" id="details_block" style="min-height: 370px;padding: 0;border-radius: 0px;">

                  <div v-if="detailLoader" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>

                  <p v-else-if="allDetail.length == 0">Не найдено</p>

                  <div class="list-group" style="margin-top: -11px;margin-left: -1px;" v-else>
                    <a class="list-group-item checkbox" style="border-radius: 0px !important;padding-top: 5px;text-align: left;margin-bottom: 20px;" v-for="detail in allDetail" :id="'coord_'+detail.CoordIndex" @click="getWorkForDetail(detail.Id, detail.Oem, false)" :class="{ active: activeDetailId === detail.Id }">
                      <input type="checkbox" style="margin-left: 0px !important;" v-model="infoAboutDetail" :value="detail">
                      <span v-if="detail.Text != ''" style="margin-left: 20px;white-space: pre-line;">{{ detail.Text }}</span>
                      <span v-if="detail.Oem != ''"><b>{{ detail.Oem }}</b></span><br v-if="detail.Oem != ''">
                      <span v-if="detail.Note != ''"><b>{{ detail.Note }}</b></span><br v-if="detail.Note != ''">
                      <span><i class="fa fa-map-marker"></i> <span v-if="detail.CoordIndex != '' && detail.CoordIndex != null && detail.CoordIndex != '-'">{{ detail.CoordIndex }}</span>
                      <span v-else>Не указано</span> &nbsp;&nbsp; <i v-if="detail.HasLabors" class="fa fa-wrench"></i></span><br>
                      <span><b>Кол-во:</b>
                        <span v-if="detail.Amount > 0">{{ detail.Amount }}</span>
                        <span v-else>Расходники</span>
                        </span>
                    </a>
                  </div>

                </div>

              </div>
              <div class="col-md-12">
                <span class="modalTitle"><b>Работы для детали:</b></span>
                <div class="thumbnail" id="wfdpanel" style="min-height: 185px;border-radius: 0;padding: 0;">

                  <div v-if="workDetailLoader" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>

                  <div v-else-if="workForDetail.length == 0" class="text-center">
                    <span >Не найдено</span>
                  </div>

                  <ul class="list-group" style="margin-top: -11px;margin-left: -1px;" v-if="workForDetail.length != 0">
                    <li class="list-group-item checkbox" :class="{ active: activeWorkForDetail == workDetail.Id }" style="border-radius: 0px !important;padding-top: 5px;text-align: left;margin-bottom: 20px;" v-for="workDetail in workForDetail" :id="'wfd_'+workDetail.Id">
                      <input type="checkbox" style="margin-left: 0px !important;position: relative;" v-model="getInfoAboutWork" :value="workDetail" @click="setAddedDetails(getInfoAboutWork, workDetail, 0)">
                      <span><b>{{ workDetail.Text }}</b> за <i class="fa fa-clock-o"></i> <b>{{ workDetail.Time }}</b> часов</span><br>
                      <span v-if="workDetail.Note != ''"><b>Заметка: </b>{{ workDetail.Note }}</span><br v-if="workDetail.Note != ''">
                      <span v-if="workDetail.ModelInfo != ''"><b>Для модели: </b>{{ workDetail.ModelInfo }}</span>
                    </li>
                  </ul>

                </div>
              </div>
            </div>

<!-- deltype 3 -->
            <div v-if="deType == 3" class="col-md-12 row">

              <div class="col-md-6 text-center">
                <span class="modalTitle">Выбранные детали:</span>
                <div class="thumbnail" style="padding: 0;min-height: 400px;border-radius: 0px;overflow-x: hidden;overflow-y: auto;">
                  <span v-if="infoAboutDetail.length == 0 && selectedFavParts.length == 0">Не найдено</span>

                  <ul class="list-group selectedStuff" v-if="infoAboutDetail.length != 0">
                    <li class="list-group-item" v-for="(infoDetail, index) in infoAboutDetail">
                      <button class="btn btn-danger btn-sm pull-right" @click="delOneDetailInfo(index)">
                        <i class="fa fa-times"></i>
                      </button>
                      <span><b>Название: </b>{{ infoDetail.Text }}</span><br>
                      <span><b>ОЕМ: </b>{{ infoDetail.Oem }}</span><br>
                      <span v-if="infoDetail.Note != null && infoDetail.Note != ''"><b>Заметка: </b>{{ infoDetail.Note }}</span><br v-if="infoDetail.Note != null && infoDetail.Note != ''">
                      <span>
                        <b>Рекомендуемое количество: </b>
                        <span v-if="infoDetail.Amount != undefined">{{ infoDetail.Amount }}</span>
                        <span v-else>Не указано</span>
                      </span>
                    </li>
                  </ul>

                  <ul class="list-group selectedStuff" v-if="selectedFavParts.length != 0">
                    <li class="list-group-item" v-for="(infoDetail, index) in selectedFavParts">
                      <button class="btn btn-danger btn-sm pull-right" @click="delFavDetail(index)">
                        <i class="fa fa-times"></i>
                      </button>
                      <span><b>Название: </b>{{ infoDetail.Text }}</span><br>
                      <span><b>ОЕМ: </b>{{ infoDetail.Oem }}</span><br>
                    </li>
                  </ul>

                </div>
              </div>

              <div class="col-md-6 text-center">
                <span class="modalTitle">Выбранные работы:</span>
                <div class="thumbnail" style="padding: 0;min-height: 400px;border-radius: 0px;overflow-x: hidden;overflow-y: scroll;">
                  <span v-if="getInfoAboutWork.length == 0 && listTypicalLabors.length == 0">Не найдено</span>

                  <ul class="list-group selectedStuff" v-if="getInfoAboutWork.length != 0">
                    <li class="list-group-item" v-for="(aboutWork, index) in getInfoAboutWork">
                      <button class="btn btn-danger btn-sm pull-right" @click="delWorkInfo(index)">
                        <i class="fa fa-times"></i>
                      </button>
                      <span><b>Название: </b>{{ aboutWork.Text }}</span><br>
                      <span v-if="aboutWork.Note != null && aboutWork.Note != ''"><b>Заметка: </b>{{ aboutWork.Note }}</span><br v-if="aboutWork.Note != null && aboutWork.Note != ''">
                  <span v-if="aboutWork.Time != null"><b>Время работы: </b>{{ aboutWork.Time }} часов</span><br v-if="aboutWork.Time != null">
                    </li>
                  </ul>

                  <ul class="list-group selectedStuff" v-if="listTypicalLabors.length != 0">
                    <li class="list-group-item" v-for="(typical, index) in listTypicalLabors">
                      <button class="btn btn-danger btn-sm pull-right" @click="delTypicalList(index)">
                        <i class="fa fa-times"></i>
                      </button>
                      <span><b>Название: </b>{{ typical.Text }}</span><br>
                      <span v-if="typical.Note != null && typical.Note != ''"><b>Заметка: </b>{{ typical.Note }}</span><br v-if="typical.Note != null && typical.Note != ''">
                  <span v-if="typical.Time != null"><b>Время работы: </b>{{ typical.Time }} часов</span><br v-if="typical.Time != null">
                    </li>
                  </ul>


                </div>
              </div>
            </div>

<!-- deltype 4 -->
            <div v-if="deType == 4" class="col-md-12 row">

              <div class="col-md-12">
                <div class="btn-group btn-group-fav" role="group">
                  <button type="button" class="btn btn-default" :class="{ active: favPageType === 1 }" @click="changeFavType(1)">Мои детали</button>
                  <button type="button" class="btn btn-default" :class="{ active: favPageType === 2 }" @click="changeFavType(2)">Добавить новую</button>
                </div>
              </div>

              <div class="col-md-4 text-center" v-if="favPageType == 1">
                <span class="modalTitle">Список деталей:</span>
                <div class="thumbnail" style="padding: 0;min-height: 400px;border-radius: 0px;overflow-x: hidden;overflow-y: auto;">
                  <div class="text-center" v-if="favoriteLoader">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>

                  <div class="list-group favorite-details" v-if="!favoriteLoader && favoriteList.length != 0">
                    <a class="list-group-item" v-for="(detail, index) in favoriteList" @click="getFavWork(detail.Id, detail.Oem)" :class="{ active: selectedFav === detail.Id }">
                      <input type="checkbox" v-model="selectedFavParts" :value="detail">
                      <i class="fa fa-times pull-right" @click="delFavorite(detail.Id)"></i>
                      <input type="checkbox" v-model="infoAboutDetail" :value="detail" v-if="false">
                      <span>ОЕМ: <b>{{ detail.Oem }}</b></span><br />
                      <span>Название: <b>{{ detail.Text }}</b></span>
                      <span>ID: {{ detail.Id }}</span>
                    </a>
                  </div>

                  <div class="text-center"  v-if="!favoriteLoader && favoriteList.length == 0" style="margin-top: 10px;">
                    <span>Ничего не добавлено</span>
                  </div>


                </div>
              </div>

              <div v-if="favPageType == 1" class="col-md-8 text-center">
                <span class="modalTitle">Список работ:</span>
                <div class="thumbnail" style="padding: 0;min-height: 400px;border-radius: 0px;overflow-x: hidden;overflow-y: auto;">
                  <div style="margin-top: 10px;">

                    <div v-if="favWorkLoader" class="text-center">
                      <img src="../assets/load.svg" alt="load gif" width="40">
                    </div>

                    <span v-else-if="favWorkList.length === 0">Ничего не найдено</span>

                    <div v-else class="list-group" style="margin-top: -10px;">
                      <a class="list-group-item" :class="{ active: activeTypicalWork == detail.Id }" v-for="detail in favWorkList" style="border-radius: 0px !important;padding-top: 5px;text-align: left;margin-bottom: 10px;" @click="setActiveTypicalWork(detail.Id)">
                        <input type="checkbox" style="margin-left: 0px !important;position: relative;" v-model="getInfoAboutWork" :value="detail" @click="setAddedDetails(getInfoAboutWork, detail, 1)">
                        <span><b>{{ detail.Text }}</b> за <i class="fa fa-clock-o"></i> <b>{{ detail.Time }}</b> часов</span><br>
                        <span v-if="detail.Note != ''"><b>Заметка: </b>{{ detail.Note }}</span><br v-if="detail.Note != ''">
                        <span v-if="detail.ModelInfo != ''"><b>Для модели: </b>{{ detail.ModelInfo }}</span>
                      </a>
                    </div>

                  </div>
                </div>
              </div>

              <div class="col-md-12 text-left" v-if="favPageType == 2">
                <div class="form-group">
                  <label>Название детали</label>
                  <input type="text" placeholder="Введите название детали" class="form-control" v-model="newDetail.name">
                </div>
                <div class="form-group">
                  <label>ОЕМ детали</label>
                  <input type="text" placeholder="Введите ОЕМ детали" class="form-control" v-model="newDetail.oem">
                </div>
                <button type="button" class="btn btn-success" @click="addNewDetail">
                  <i class="fa fa-plus-circle"></i> Добавить
                </button>
              </div>

            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-danger pull-left" data-dismiss="modal" @click="closePopupPal">Отмена</button>
          <button type="button" class="btn btn-success"  :disabled="isNothingAdded" @click="addNewDetailAndLabor">Добавить</button>
        </div>

      </div>
    </div>

    <FavModal />

  </div>
</template>

<script>
import Tree from './Tree'
import typicalTree from './typicalTree'
import host from '../data/host.js'
import FavModal from './modals/FavModal'

export default {
	name: 'popuppal',
	props: [
    'detailType', 
    'data',
    'vehid',
    'parent',
    'wload',
    'dload',
    'carInfo',
    'aboutDetail',
    'infoAboutWork',
    'isNewFavoriteDetail',
    'newFavoriteDetails',
    'selectedPart',
    'selectDetail',
    'selectedTypical',
    'newGetWorkForDetail',
    'setActiveWorkForDetail',
    'activeTypicals',
    'orderPreorder',
    'userId'
  ],
	components: {
		Tree,
		typicalTree,
    FavModal
	},
	data() {
		return {
      activeDetailId: '',
      activeTypical: '',
      activeTypicalWork: '',
      activeWorkForDetail: '',
      allDetail: [],
      coordScale: 1,
      coordSchema: [],
      deType: 1,
      detailImage: null,
      detailLoader: false,
      oemDetailsLoader: false,
      favoriteList: [],
      favoriteLoader: false,
      favPageType: 1,
      favWorkLoader: false,
      favWorkList: [],
      findOemLoader: false,
      findOems: [],
      foundedDetails: [],
      getInfoAboutWork: [],
      infoAboutDetail: [],
      infoCar: this.carInfo,
      isNewTrees: false,
      isNotFoundDetails: false,
      listTypicalLabors: [],
      loaderTypical: false,
      newFavDetail: '',
      newOem: '',
      newTrees: [],
      oemNotFound: false,
      openNode: 0,
      pictureLoader: false,
      searchDetailsLoader: false,
      searchDetailsText: '',
      seacrhOemLoader: false,
      selectedFav: '',
      selectedFavParts: [],
      scaleImg: 0.5,
      scaleImgLaxima: 0.5,
      treesType: 1,
      typicalTree: [],
      typicalTreeLoader: false,
      typicalWorkList: [],
      workForDetail: [],
      workDetailLoader: false,
      newDetail: {
        name: '',
        oem: ''
      }
		}
	},
  watch: {
    activeTypicals: function(data) {
      this.activeTypical = data
    },
    setActiveWorkForDetail: function(data) {
      this.activeWorkForDetail = data
    },
    newGetWorkForDetail: function(data) {
      this.getWorkForDetail(data.Id, data.Oem, true)
    },
    data: function(val) {
      let self = this;
      $("#treesDetails").jstree({
        'core': {
          data: val,
          themes: {
            "icons":false
          }
        }
      }).on("ready.jstree", function(e, data) {
        $("#treesDetails").jstree("select_node", "ul > li:first");
        var Selectednode = $("#treesDetails").jstree("get_selected");
        $("#treesDetails").jstree("open_node", Selectednode, false, true);

        $('#treesDetails').on("changed.jstree", function (e, data) {
          self.getPicAndDetails(data.node.original)
        })
      })
    },
    detailType: function(val) {
      this.deType = val
    },
    isNewFavoriteDetail: function(val) {
      if(val == true) {
        this.addNewFavoriteDetails(this.newFavoriteDetails.oem, this.newFavoriteDetails.name)
        this.$parent.$emit('closeAddNewFav')
      }
    },
    searchDetailsText: function(val) {
      if(val == '' && this.isNewTrees) {
        this.isNewTrees = false
        this.newTrees = this.data
      }
    },
    selectedPart: function(val) {
      this.openNode = val
    },
    selectDetail: function(val) {
      this.activeDetailId = val
    }
  },
  computed: {
    isNothingAdded() {
      if(this.getInfoAboutWork == '' && this.infoAboutDetail == '' && this.listTypicalLabors == '' && this.selectedFavParts == '') return true
      else return false
    },
    allTrees() {
      if(!this.isNewTrees) return this.data
      return this.newTrees
    }
  },
	methods: {
    closePopupPal(){
      this.$parent.$emit('closePopupPal')
    },
    setActiveTypicalWork(id) {
      this.activeTypicalWork = id
    },
    setActiveTypical(id) {
      this.activeTypical = id
    },
    getFavWork(index, oem) {
      this.selectedFav = index
      this.favWorkLoader = true
      let parseOem = oem.replace(/ /g,'')
      let parseModel = this.carInfo.Model.replace(/ /g,'')
      this.$http.get(`${host.host}/Catalog/oem/Labors?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}&oem=${parseOem}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.favWorkLoader = false
        if(response.body.error == true) return toastr.error('Ошибка сервера')
        let data = response.data
        data.forEach((it) => {
          it.Id = it.id
          it.Type = it.type
          it.Text = it.text
          it.Note = it.note
          it.Time = it.time
          it.ModelInfo = it.modelInfo
          it.FromPartId = it.fromPartId

          delete it.id
          delete it.type
          delete it.text
          delete it.note
          delete it.time
          delete it.modelInfo
          delete it.fromPartId
        })
        return this.favWorkList = data
      }, response => {
        this.favWorkLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    changeFavType(id) {
      this.favPageType = id
    },
    delFavDetail(index) {
      this.selectedFavParts.splice(index, 1)
    },
    getPicAndDetails(detail) {
      if(detail.parent == 'root') return false

      let parseModel = this.carInfo.Model.replace(/ /g,'')
      this.detailLoader = true
      this.pictureLoader = true
      this.$http.get(`${host.host}/Catalog/Parts?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}&nodeId=${detail.id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.body.error == true) {
          this.detailLoader = false
          this.pictureLoader = false
          return toastr.error('Ошибка сервера')
        }
        this.detailLoader = false
        let data = response.body
        //Переводим на рестфул
        data.forEach((it) => {
          it.Id = it.id
          it.TreeNodeId = it.treeNodeId
          it.Oem = it.oem
          it.Amount = it.amount
          it.Text = it.text
          it.Info = it.info
          it.CoordIndex = it.coordIndex
          it.Note = it.note
          it.HasLabors = it.hasLabors

          delete it.id
          delete it.treeNodeId
          delete it.oem
          delete it.amount
          delete it.text
          delete it.info
          delete it.coordIndex
          delete it.note
          delete it.hasLabors

        })
        this.allDetail = data
        this.$http.get(`${host.host}/Catalog/Parts/PictureMap?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}&imageId=${detail.PictureId}`, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          console.log('picture',response)
          this.pictureLoader = false
          let data = response.data
          if(detail.PictureId == 0) return this.detailImage = null
          this.detailImage = `${host.host}/Catalog/Parts/Picture/${detail.PictureId}?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}`
          this.coordSchema = data
        }, response => {
          this.pictureLoader = false
          return toastr.error('Ошибка сервера')
        })
      }, response => {
        this.detailLoader = false
        this.pictureLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    selectInTreeDetails(detail) {
      this.treesType = 1
      this.openNode = detail.TreeNodeId
    },
    setTreesType(type) {
      this.treesType = type
    },
    searchDetails() {
      this.isNotFoundDetails = false
      if(this.searchDetailsText.length < 3) return toastr.error('Введите минимум 3 символа')
      this.searchDetailsLoader = true
      this.$http.get(`${host.host}/Catalog/Parts/Search/name?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}&name=${this.searchDetailsText}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.searchDetailsLoader = false
        if(response.body.error == true) return toastr.error('Ошибка сервера')
        let data = response.body
        data.forEach((it) => {
          it.Id = it.id
          it.TreeNodeId = it.treeNodeId
          it.Oem = it.oem
          it.Amount = it.amount
          it.Text = it.text
          it.Info = it.info
          it.CoordIndex = it.coordIndex
          it.Note = it.note
          it.HasLabors = it.hasLabors

          delete it.id
          delete it.treeNodeId
          delete it.oem
          delete it.amount
          delete it.text
          delete it.info
          delete it.coordIndex
          delete it.note
          delete it.hasLabors
        })

        if(data.length == 0) return this.isNotFoundDetails = true
        return this.foundedDetails = data
      }, response => {
        this.searchDetailsLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    tooltipText(index) {
      let name = ''
      for(let i=0;i<this.allDetail.length;i++) {
        if(this.allDetail[i].CoordIndex == index) name = this.allDetail[i].Text
      }
      if(name != '') return name
      else return 'Деталь не найдена'
    },
    addNewFavoriteDetails(oem, text) {
      this.favPageType = 1
      this.favoriteLoader = true
      this.$http.post(`${host.host}/Trader/Create/Favorite?OEM=${oem}&Text=${text}`, {},{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.favoriteLoader = false
        let data = JSON.parse(response.body.model).reverse()
        let list = []
        for(let i=0;i<data.length;i++) {
          list.push({
            Oem: data[i].OEM,
            Text: data[i].Text,
            Id: data[i].Id,
            UserId: data[i].UserId,
          })
        }
        this.favoriteList = list
        this.newFavDetail = ''
        return toastr.success('Деталь успешно добавлена!')
      }, response => {
        this.favoriteLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    addNewFavDetail() {
      if(this.newFavDetail == '') return toastr.error('Введите название детали!')
      this.$http.post(`${host.host}/Trader/Create/Favorite?OEM=${this.newFavDetail}&Text=${this.newFavDetail}`, {},{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.body.model)
        let list = []
        for(let i=0;i<data.length;i++) {
          list.push({
            Oem: data[i].OEM,
            Text: data[i].Text,
            Id: data[i].Id,
            UserId: data[i].UserId,
          })
        }
        this.favoriteList = list
        this.newFavDetail = ''
        return toastr.success('Деталь успешно добавлена!')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    closeAlertOem() {
      this.oemNotFound = false
    },
    searchByOem() {
      if(this.newOem == '') return toastr.info('Введите название детали')
      this.oemNotFound = false
      this.seacrhOemLoader = true
      this.$http.get(`${host.host}/Trader/Offers/Search?oem=${this.newOem}`, {
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
        }
      }).then(response => {
        this.newOem = ''
        this.seacrhOemLoader = false
        let data = JSON.parse(response.body.model)
        if(data == '') this.oemNotFound = true
        this.findOems = data
      }, response => {
        this.seacrhOemLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    findDetailByOem() {
      if(this.newFavDetail == '') return toastr.error('Введите ОЕМ детали!')
      this.findOemLoader = true
      this.$http.get(`${host.host}/Trader/Offers/Search?oem=${this.newFavDetail}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
          }
        }).then(response => {
          this.findOemLoader = false
        }, response => {
          this.findOemLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    delFavorite(id) {
      this.favoriteLoader = true
      let favIds = []
      favIds.push(id)
      this.$http.delete(`${host.host}/Catalog/Custom/Part?partId=${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.favoriteLoader = false
        this.checkLoadFavorite()

        return toastr.success('Деталь успешно удалена!')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    
    scaleImgPlusLaxima() {
      if(this.scaleImgLaxima >= 1) return false
      this.coordScale = this.coordScale+0.5
      this.scaleImgLaxima = this.scaleImgLaxima + 0.1
    },
    scaleImgMinusLaxima() {
      if((this.scaleImgLaxima).toFixed(1) == 0.1) return false
      if(this.coordScale > 5) this.coordScale = this.coordScale-0.5
      this.scaleImgLaxima = this.scaleImgLaxima - 0.1
    },
    scaleImgPlus() {
      if(this.scaleImg >= 1) return false
      this.scaleImg += 0.1
      this.coordScale += +0.5
    },
    scaleImgMinus() {
      if((this.scaleImg).toFixed(1) == 0.1) return false
      if(this.coordScale > 5) this.coordScale = this.coordScale-0.5
      this.scaleImg -= 0.1
    },
    setAddedDetails(list, details, type) {
      if(type == 0) {
        for(let i=0;i<list.length;i++) {
          if(list[i].Id == details.Id && list[i].isAlready === undefined) {
            list[i].FromPartId = this.activeDetailId
            list[i].fromPartCatalogType = type
            list[i].isAlready = true
          }
        }
      } else if(type == 1) {
        for(let i=0;i<list.length;i++) {
          if(list[i].Id == details.Id && list[i].isAlready === undefined) {
            list[i].FromPartId = this.selectedFav
            list[i].fromPartCatalogType = type
            list[i].isAlready = true
          }
        }
      }
      this.getInfoAboutWork = list
    },
    delTypicalList(index) {
      this.listTypicalLabors.splice(index, 1)
    },
    addNewDetail() {
      if(this.newDetail.name == '' || this.newDetail.oem == '') {
        return toastr.error('Введите ОЕМ и название детали!');
      }

      this.addNewFavoriteDetails(this.newDetail.oem, this.newDetail.name )
      this.newDetail.name = ''
      this.newDetail.oem = ''
    },
    addNewFavoriteDetails(oem, text) {
      this.favPageType = 1
      this.favoriteLoader = true
      this.$http.post(`${host.host}/Catalog/Custom/Parts?oem=${oem}&name=${text}&userCarId=${this.carInfo.UserCarId || this.carInfo.Id}&userId=${this.userId}`, {},{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.favoriteLoader = false
        let data = JSON.parse(response.bodyText)

        this.checkLoadFavorite()

        return toastr.success('Деталь успешно добавлена!')
      }, response => {
        this.favoriteLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
    addNewDetailAndLabor() {
			this.$parent.$emit('addDeAndLa', {
        detail: this.infoAboutDetail,
        labor: this.getInfoAboutWork,
        typical: this.listTypicalLabors,
        fav: this.selectedFavParts
      })
      this.infoAboutDetail = []
      this.getInfoAboutWork = []
      this.listTypicalLabors = []
      this.selectedFavParts = []

      $("#addPartOrLaborModal").modal('hide')
      // $("#createPreOrderLoader").modal('show')
		},
		delWorkInfo(index) {
			this.getInfoAboutWork.splice(index, 1)
		},
		delOneDetailInfo(index) {
			this.infoAboutDetail.splice(index, 1)
		},
		backLight(pic) {
      if(document.getElementById('coord_'+pic.Index) == null) return toastr.info('Детали нет в списке деталей')
      let details = []
      for(let i=0;i<this.allDetail.length;i++) {
        if(this.allDetail[i].CoordIndex == pic.Index) details.push(this.allDetail[i])
      }
      this.activeDetailId = details[0].Id
      document.getElementById('details_block').scrollTop = document.getElementById('coord_'+pic.Index).offsetTop-20
		},
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
        // console.log('response', response.body.result)
        let data = response.body
        let nodes = []
        nodes.push({ "id" : "root", "parent" : "#", "text" : "Каталог"})
        for(let i=0;i<data.length;i++) {
          if(data[i].parentId == 0) data[i].parentId = "root"
          nodes.push({
            id: data[i].id,
            parent: data[i].parentId,
            text: data[i].text
          })
        }
        this.typicalTree = nodes
      }, response => {
        this.typicalTreeLoader = false
        return toastr.error('Ошибка сервера')
      })
    },
		newDetailType(id) {
      var that = this
      if(id == 4) this.checkLoadFavorite()
      
			this.deType = id
		},
    checkLoadFavorite() {
      this.favoriteList = []
      this.favoriteLoader = true
      this.$http.get(`${host.host}/Catalog/Custom/Parts?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}&userId=${this.userId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.favoriteLoader = false
        if(response.body.error) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.bodyText)
        let list = []
        for(let i=0;i<data.length;i++) {
          list.push({
            Oem: data[i].oem,
            Text: data[i].text,
            Id: data[i].id,
            UserId: data[i].userId,
          })
        }
        this.favoriteList = list
      }, response => {
        this.favoriteLoader = false
      })
    },
    decodeURI(url) {
      return url.replace(/%20/g, '')
    },
	  getWorkForDetail(id, oem, isScroll) {
      this.workForDetail = []
      $("#wfdpanel .list-group").length = 0
      this.activeDetailId = id
      this.workDetailLoader = true
      let parseOem = oem.replace(/ /g,'')
      let parseModel = this.carInfo.Model.replace(/ /g,'')
      this.$http.get(`${host.host}/Catalog/oem/Labors?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}&oem=${parseOem}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.body.error == true) {
          toastr.error('Ошибка сервера')
          return this.workDetailLoader = false
        }
        let data = response.data
        data.forEach((it) => {
          it.Id = it.id
          it.Type = it.type
          it.Text = it.text
          it.Note = it.note
          it.Time = it.time
          it.ModelInfo = it.modelInfo
          it.FromPartId = it.fromPartId

          delete it.id
          delete it.type
          delete it.text
          delete it.note
          delete it.time
          delete it.modelInfo
          delete it.fromPartId
        })
        this.workForDetail = data
        this.workDetailLoader = false
        if(isScroll == true && $("#wfdpanel .list-group").length != 0) {
          document.getElementById('wfdpanel').scrollTop = document.getElementById('wfd_'+this.activeWorkForDetail).offsetTop-20
        } else if($("#wfdpanel .list-group").length == 0) this.setActiveWFD(isScroll, this.activeWorkForDetail)
      }, response => {
        toastr.error('Ошибка сервера')
        return this.workDetailLoader = false
      })
    },
    getDamnedTree() {
      if (this.carInfo.UserCarId || this.carInfo.Id) {
        this.oemDetailsLoader = true
        this.$http.get(`${host.host}/Catalog/Parts/Tree?userCarId=${this.carInfo.UserCarId || this.carInfo.Id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          let nodes = []
          let data = response.body
          data.forEach((it) => {
            it.Id = it.id
            it.Title = it.title
            it.PictureId = it.pictureId
            it.ParentId = it.parentId

            delete it.id
            delete it.title
            delete it.pictureId
            delete it.parentId
          })

          nodes.push({ "id" : "root", "parent" : "#", "text" : "Каталог"})
          for(let i=0;i<data.length;i++) {
            if(data[i].ParentId == 0) data[i].ParentId = "root"
              nodes.push({
                id: data[i].Id,
                parent: data[i].ParentId,
                text: data[i].Title,
                PictureId: data[i].PictureId
              })
          }
          this.$store.state.selorder.trees = nodes
          this.oemDetailsLoader = false
        }, response => {
          this.oemDetailsLoader = false
          return toastr.error('Ошибка сервера')
        })
      }
    },
    setActiveWFD(scroll, detail) {
      if(scroll == true && $("#wfdpanel .list-group").length != 0) {
        document.getElementById('wfdpanel').scrollTop = document.getElementById('wfd_'+detail).offsetTop-20
      }
    },
    closePopup() {
      this.$parent.$emit('closePopup')
    }
	},
  created() {
    this.getTypicalLabors()
    let self = this;
    $(document).ready(function() {
      $('#addPartOrLaborModal').on('hidden.bs.modal', function () {
        self.closePopup()
      })
      $('#addPartOrLaborModal').on('show.bs.modal', function () {
        self.deType = self.detailType // ставим активный таб в зависимости от выбранного типа деталек
      })
      $('#addPartOrLaborModal').on('show.bs.modal', function () {
        self.getDamnedTree()
      })          
    })
  },
	mounted() {
    this.$on('getTreeData', function(data) {
      $("#details_block").animate({scrollTop: 0});
      this.allDetail = data
      this.detailLoader = false
    }),
    this.$on('detailLoader', function(data) {
      this.detailLoader = data
    }),
    this.$on('picLoader', function(data) {
      this.pictureLoader = data
    }),
    this.$on('getPicImage', function(data) {
      if(data == null) return this.detailImage = null
      this.detailImage = data
    }),
    this.$on('getCoordSchema', function(data) {
      this.coordSchema = data
    }),
    this.$on('getLoaderTypical', function(data) {
      this.loaderTypical = data
    }),
    this.$on('getTypicalWork', function(data) {
      this.typicalWorkList = data
    }),
    this.$on('getChildLoaderTypical', function(data) {
      this.loaderTypical = data
    }),
    this.$on('getChildTypicalWork', function(data) {
      this.typicalWorkList = data
    })

  }
}
</script>

<style scoped>
  .row { margin: 0; width: 100%;}

  .btn.active { background-color: green; color: #fff;}

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

  i, .activeItem {
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
    border: 2px solid red;
    position: absolute;
    outline: 0 none !important;
  }

  .detail:hover {
    background: rgba(255,0,0,0.4);
    opacity: 1;
    cursor: pointer;
  }

  .btn-resize {
    position: absolute;
    z-index: 2;
    opacity: 0.9;
    left: 20px; 
    top: 25px;
  }

  .btn-resize button {
    width: 35px;
    height: 35px;
    padding: 0;
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

  .loaderOemSearch {
    margin-top: 20px;
  }

  .detail .tooltiptext {
    visibility: hidden;
    background-color: black;
    min-width: 180px;
    color: #fff;
    text-align: center;
    padding: 5px;
    border-radius: 3px;
    position: absolute;
    opacity: 0.85;
    line-height: 1.1;
    z-index: 10;
    font-size: 13px;
    letter-spacing: 1px;
    box-sizing: border-box;
    left: 120%;
    top: 50%;
    transform: translateY(-50%);
    transform-origin: 0 50% 0;
  }
  .detail .tooltiptext:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-right: 5px solid black;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    margin: auto;
    top: 0;
    bottom: 0;
    left: -4px;
  }

  .detail:hover .tooltiptext {
      visibility: visible;

  }

  .btn-tree-group {
    width: 100%;
    margin-bottom: 10px;
  }

  .btn-tree-group button {
    width: 50%;
  }

  .jstree {
    text-align: left;
  }

  .btn-group-fav {
    margin-top: -20px;
    margin-bottom: 20px;
  }
</style>
