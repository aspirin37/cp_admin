<!-- <template>
<div>
  <div class="modal fade" id="addPartOrLaborModal">
    <div class="modal-dialog modal-lg" role="document" style="max-width: 95%;width: 100%;">
      <div class="modal-content">
  
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">
            Каталог деталей для - {{ carInfo.Make }} {{ carInfo.Model }}
          </h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
  
        <div class="modal-body">
          <div class="row">
            
              <div v-if="deType == 2" class="col-md-3 text-center" style="margin-top: -10px;">
                <span class="modalTitle">Дерево деталей:</span>
  
                <div v-if="0" class="thumbnail thumbnail-searchDetails">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Поиск по работам">
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                  </div>
                </div>
  
  
  
                <div class="thumbnail" style="padding: 0;min-height: 370px;border-radius: 0px;overflow-x: hidden;overflow-y: scroll;">
  
                  <div v-if="data.length == 0" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>
  
                  <div class="tree-list">
                    <tree :data="data" :vehid="vehid" :parent="parent" :wload="workDetailLoader" :dload="detailLoader" :carModel="carInfo"></tree>
                  </div>
  
                </div>
              </div>
  
              <div v-if="deType == 2" class="col-md-6 text-center" style="margin-top: -10px;">
                 {{detailImage}}
                <span class="modalTitle">Иллюстрация</span>
                <div class="thumbnail" style="min-height: 370px;border-radius: 0px;">
                  <div class="text-left btn-resize" v-if="!pictureLoader && detailImage != null && detailImage.Data != null">
                    <button class="btn btn-primary" @click="scaleImgPlus">+</button>
                    <button class="btn btn-primary" @click="scaleImgMinus">-</button>
                  </div>

                 
  
                  <div style="transform: scale(0.3);transform-origin: top left;max-height: 100vh;float: left;" v-if="!pictureLoader && detailImage != null && detailImage.Data != null" :style="{ transform: 'scale('+scaleImg+')' }">
                    <img :src="'data:image/jpeg;base64,'+detailImage.Data" v-if="!pictureLoader && detailImage.Data != null" style="width: auto;max-height: 100%;max-width: none;" />
  
                    <div v-if="!pictureLoader && detailImage.Data != null" class="detail" v-for="pic in coordSchema" data-toggle="tooltip" data-placement="top" title="Hooray!" @click="backLight(pic.Index)" :style="{
                      width: pic.Width + 'px',
                      height: pic.Height + 'px',
                      left: pic.X + 'px',
                      top: pic.Y + 'px'
                    }"></div>
  
                  </div>
  
                  <div style="transform: scale(0.8);transform-origin: top left;max-height: 100vh;-webkit-transform: scale(0.8, 0.8);float: left;" v-if="!pictureLoader && detailImage != null && detailImage.Url != null">
                    <img :src="detailImage.Url" v-if="!pictureLoader && detailImage.Url != null" style="width: auto;max-height: 100%;max-width: none;" />
  
                    <div v-if="!pictureLoader && detailImage.Url != null" class="detail" v-for="pic in coordSchema" @click="backLight(pic.Index)" :style="{
                      width: pic.Width + 'px',
                      height: pic.Height + 'px',
                      left: pic.X + 'px',
                      top: pic.Y + 'px'
                    }"></div>
                  </div>
  
                  <div v-if="pictureLoader" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>
                  <p v-if="detailImage == null && !pictureLoader">Не указана</p>
  
  
                </div>
              </div>
  
              <div v-if="deType == 2" class="col-md-3 text-center" style="margin-top: -10px;">
                <span class="modalTitle">Детали:</span>
                <div class="thumbnail" id="details_block" style="min-height: 370px;padding: 0;border-radius: 0px;">
  
                  <div v-if="detailLoader" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>
  
                  <p v-else-if="allDetail.length == 0">Не найдено</p>
  
                  <div class="list-group" style="margin-top: 0px;margin-left: -1px;" v-else>
                    <a class="list-group-item checkbox" style="border-radius: 0px !important;padding-top: 10px;text-align: left;margin-bottom: 0px;" v-for="detail in allDetail" :id="'coord_'+detail.CoordIndex" @click="getWorkForDetail(detail.Id, detail.LaborIds, detail.Oem, detail.HasLabors )"
                      :class="{ active: activeDetailId === detail.Id }">
                      <span v-if="detail.Text != ''" style="margin-left: 0px;white-space: pre-line;">{{ detail.Text }}</span>
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
              <div v-if="deType == 2" class="col-md-12">
                <span class="modalTitle"><b>Работы для детали:</b></span>
                <div class="thumbnail" style="min-height: 185px;border-radius: 0;padding: 0;">
  
                  <div v-if="workDetailLoader" class="text-center">
                    <img src="../assets/load.svg" alt="load gif" width="40">
                  </div>
  
                  <div v-else-if="workForDetail.length == 0" class="text-center">
                    <span>Не найдено</span>
                  </div>
  
                  <ul class="list-group" style="margin-top: 0px;margin-left: -1px;" v-if="workForDetail.length != 0">
                    <li class="list-group-item checkbox" style="border-radius: 0px !important;padding-top: 10px;text-align: left;margin-bottom: 0px;" v-for="workDetail in workForDetail">
                      <span><b>{{ workDetail.Text }}</b> за <i class="fa fa-clock-o"></i> <b>{{ workDetail.Time }}</b> часов</span><br>
                      <span v-if="workDetail.Note != ''"><b>Заметка: </b>{{ workDetail.Note }}</span><br v-if="workDetail.Note != ''">
                      <span v-if="workDetail.ModelInfo != ''"><b>Для модели: </b>{{ workDetail.ModelInfo }}</span>
                    </li>
                  </ul>
                </div>
              </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Отмена</button>
          <button type="button" @click="getAssignedCarModels" class="btn btn-success" :disabled="activeDetailId == ''" data-toggle="modal" data-target="#getLaborsModal">Управление работами</button>
        </div>
  
      </div>
    </div>
  </div>
  <ShowLabors :works="workForDetail" :id="selectedOem" :assigned="assigned" :selectedCar="carInfo"></ShowLabors>
</div>
</template>

<script>
  import host from '../data/host.js'
  import Tree from './Tree'
  import typicalTree from './typicalTree'
  import ShowLabors from './modals/ShowLabors'
  
  export default {
    name: 'popuppal',
    props: ['detailType', 'data', 'vehid', 'parent', 'wload', 'dload', 'carInfo', 'aboutDetail', 'infoAboutWork', 'isNewFavoriteDetail', 'newFavoriteDetails'],
    components: {
      Tree,
      typicalTree,
      ShowLabors
    },
    data() {
      return {
        findOems: [],
        oemNotFound: false,
        newOem: '',
        seacrhOemLoader: false,
        activeTrees: '',
        scaleImg: 0.5,
        scaleImgLaxima: 0.5,
        infoCar: this.carInfo,
        deType: 2,
        infoAboutDetail: [],
        detailLoader: false,
        allDetail: [],
        pictureLoader: false,
        detailImage: null,
        coordSchema: [],
        workForDetail: [],
        workDetailLoader: false,
        getInfoAboutWork: [],
        listTypicalLabors: [],
        typicalTree: [],
        typicalTreeLoader: false,
        loaderTypical: false,
        typicalWorkList: [],
        activeDetailId: '',
        favoriteList: [],
        favoriteLoader: false,
        newFavDetail: '',
        findOemLoader: false,
        selectedOem: '',
        assigned: '',
        hasLabors: false
      }
    },
    watch: {
      detailType: function(val) {
        this.deType = val
      },
      isNewFavoriteDetail: function(val) {
        if(val == true) {
          this.addNewFavoriteDetails(this.newFavoriteDetails.oem, this.newFavoriteDetails.name)
        }
      }
    },
    methods: {
      getAssignedCarModels () {
        $('#addPartOrLaborModal').modal('hide')
        this.$http.get(`${host.host}/Catalog/GetAssignedCarModels?make=${this.carInfo.Make}&model=${this.carInfo.Model}&year=${this.carInfo.Year}&oem=${this.hasLabors?this.selectedOem:''}&vin=${this.carInfo.Vin}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          let data = JSON.parse(response.body.model)
          this.assigned = data
        }, response => {
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
        this.$http.post(`${host.host}/Trader/Create/Favorite?OEM=${oem}&Text=${text}`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          let data = JSON.parse(response.body.model)
          let list = []
          for(let i=0;i<data.length;i++) {
            list.push({
              Oem: data[i].OEM,
              Text: data[i].Text
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
        if (this.newOem == '') return toastr.success('Введите название детали')
        this.oemNotFound = false
        this.seacrhOemLoader = true
        this.$http.get(`${host.host}/Trader/Offers/Search?oem=${this.newOem}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.newOem = ''
          this.seacrhOemLoader = false
          let data = JSON.parse(response.body.model)
          if (data == '') this.oemNotFound = true
          this.findOems = data
        }, response => {
          this.seacrhOemLoader = false
          return toastr.error('Ошибка сервера')
        })
      },
      findDetailByOem() {
        if (this.newFavDetail == '') return toastr.error('Введите ОЕМ детали!')
        this.findOemLoader = true
        this.$http.get(`${host.host}/Trader/Offers/Search?oem=${this.newFavDetail}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.findOemLoader = false
          console.log(response)
        }, response => {
          this.findOemLoader = false
          return toastr.error('Ошибка сервера')
        })
      },
      detFavorite(id) {
        this.favoriteLoader = true
        let favIds = []
        favIds.push(id)
        this.$http.post(`${host.host}/Trader/Delete/Favorite`, {
          fIds: favIds
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          let data = JSON.parse(response.body.model)
          let list = []
          for(let i=0;i<data.length;i++) {
            list.push({
              Oem: data[i].OEM,
              Text: data[i].Text
            })
          }
          this.favoriteList = list
          this.favoriteLoader = false
          return toastr.success('Деталь успешно удалена!')
        }, response => {
          return toastr.error('Ошибка сервера')
        })
      },
      addNewFavDetail() {
        if (this.newFavDetail == '') return toastr.error('Введите название детали!')
        this.$http.post(`${host.host}/Trader/Create/Favorite?OEM=${this.newFavDetail}&Text=${this.newFavDetail}`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          let data = JSON.parse(response.body.model)
          let list = []
          for(let i=0;i<data.length;i++) {
            list.push({
              Oem: data[i].OEM,
              Text: data[i].Text
            })
          }
          this.favoriteList = list
          this.newFavDetail = ''
          return toastr.success('Деталь успешно добавлена!')
        }, response => {
          return toastr.error('Ошибка сервера')
        })
      },
      scaleImgPlusLaxima() {
        if(this.scaleImgLaxima >= 1) return false
        this.scaleImgLaxima = this.scaleImgLaxima + 0.1
      },
      scaleImgMinusLaxima() {
        if((this.scaleImgLaxima).toFixed(1) == 0.1) return false
        this.scaleImgLaxima = this.scaleImgLaxima - 0.1
      },
      scaleImgPlus() {
        if (this.scaleImg >= 1) return false
        this.scaleImg = this.scaleImg + 0.1
      },
      scaleImgMinus() {
        if ((this.scaleImg).toFixed(1) == 0.1) return false
        this.scaleImg = this.scaleImg - 0.1
      },
      setAddedDetails(list, details) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].Id == details.Id) list[i].FromPartId = this.activeDetailId
        }
        this.getInfoAboutWork = list
      },
      delTypicalList(index) {
        this.listTypicalLabors.splice(index, 1)
      },
      addNewDetailAndLabor() {
        this.$parent.$emit('addDeAndLa', { detail: this.infoAboutDetail, labor: this.getInfoAboutWork, typical: this.listTypicalLabors })
        this.infoAboutDetail = []
        this.getInfoAboutWor = []
        this.listTypicalLabors = []
        $("#addPartOrLaborModal").modal('hide')
      },
      delWorkInfo(index) {
        this.getInfoAboutWork.splice(index, 1)
      },
      delOneDetailInfo(index) {
        this.infoAboutDetail.splice(index, 1)
      },
      backLight(pic) {
        if(document.getElementById('coord_'+pic) == null) return toastr.info('Детали нет в списке деталей')
        let details = []
        for(let i=0;i<this.allDetail.length;i++) {
          if(this.allDetail[i].CoordIndex == pic) details.push(this.allDetail[i])
        }
        this.activeDetailId = details[0].Id
        document.getElementById('details_block').scrollTop = document.getElementById('coord_'+pic).offsetTop-20
      },
      getTypicalLabors() {
        this.typicalTreeLoader = true
        this.$http.get(`${host.host}/Catalog/GetTypicalTree`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          this.typicalTreeLoader = false
          let data = JSON.parse(response.body.model)
          this.typicalTree = data

          console.log('POPUPPAL DATA')
          console.log(data)
          console.log(this)
        }, response => {
          this.typicalTreeLoader = false
          return toastr.error('Ошибка сервера')
        })
      },
      newDetailType(id) {
        if (id == 4) this.checkLoadFavorite()
        this.deType = id
      },
      checkLoadFavorite() {
        if (this.favoriteList == '') {
          this.favoriteLoader = true
          this.$http.get(`${host.host}/Trader/Favorite/`, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json'
            }
          }).then(response => {
            this.favoriteLoader = false
            if(response.body.error) return toastr.error('Ошибка сервера')
            let data = JSON.parse(response.body.model)
            let list = []
            for(let i=0;i<data.length;i++) {
              list.push({
                Oem: data[i].OEM,
                Text: data[i].Text
              })
            }
            this.favoriteList = list
          }, response => {
            this.favoriteLoader = false
          })
        }
      },
      decodeURI(url) {
        return url.replace(/%20/g, '')
      },
      getWorkForDetail(id, LaborIds, oem, HasLabors) {
        this.activeDetailId = ''
        this.activeDetailId = id
        this.workDetailLoader = true
        let parseOem = oem.replace(/ /g,'')
        let parseModel = this.carInfo.Model.replace(/ /g,'')
        this.selectedOem = parseOem
        this.hasLabors = HasLabors
        this.$http.put(`${host.host}/Vehicle/${this.vehid}/Labors?oem=${parseOem}&model=${parseModel}`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
          }
        }).then(response => {
          if(response.body.error == true) {
            toastr.error('Ошибка сервера')
            return this.workDetailLoader = false
          }
          let data = JSON.parse(response.data.model)
          this.workForDetail = data
          this.workDetailLoader = false
        }, response => {
          toastr.error('Ошибка сервера')
          return this.workDetailLoader = false
        })
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
        this.workForDetail = []
      }),
      this.$on('picLoader', function(data) {
        this.pictureLoader = data
      }),
      this.$on('getPicImage', function(data) {
        if(data == null) return this.detailImage = null
        this.detailImage = JSON.parse(data.data.model)
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
      this.$on('getAssignedCarModels', function(data) {
        this.getAssignedCarModels(data)
        console.log('asdfasdfpweorpqwekrl')
      })


      console.log("POPUPPAL")
      console.log(this)
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
</style> -->