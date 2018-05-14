<template>
<div>
  <div id="PreOrder" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header" v-if="!loader && !serverError && preOrderInfo != ''">
          <h5>Предзаказ №{{preOrderInfo.Id}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="col-lg-12" v-if="loader">
            <div class="text-center" style="margin-top: 20px;">
              <img src="../../assets/load.svg" alt="load gif" width="40">
            </div>
          </div>

          <div class="col-lg-12" v-if="!loader && !serverError && preOrderInfo != ''">

              <client-panel
                :userModel="userInfo"
                :carModel="preOrderInfo.UserCarModel">

              </client-panel>

            <detail-panel
              :updateWork="updateWork"
              :updateDetail="updateDetail"
              :preOrderActionLoader="preOrderActionLoader"
              :list="preOrderInfo.listParts"
              :favList="preOrderInfo.listFavoriteParts">
            </detail-panel>

            <work-panel
              :updateWork="updateWork"
              :updateDetail="updateDetail"
              :preOrderActionLoader="preOrderActionLoader"
              :list="preOrderInfo.listLabors"
              :typical="preOrderInfo.listTypicalLabors"
            ></work-panel>

            <orderinfo-modal
              v-if="!loader && !serverError && preOrderInfo != ''"
              :id="preOrderInfo.Id"
              :createDate="preOrderInfo.CreationTime"
              :preOrderInfo="preOrderInfo">
            </orderinfo-modal>

            <aboutcar-modal
              :carInfo="preOrderInfo"
              v-if="!loader && !serverError && preOrderInfo != ''">
            </aboutcar-modal>

            <physical-modal
              :detailsList="$store.state.selorder.phyDetail"
              :loader="$store.state.selorder.phyDetailLoader"
              :notFound="$store.state.selorder.phyDetailNotFound"
              :selected="$store.state.selorder.selectPhyDetailItem"
              :filter="$store.state.selorder.selectPhydetail"
              :phyDetailList="phyDetailList">
            </physical-modal>
          </div>
        </div>
        <!-- <div class="modal-footer">
          <button class="btn btn-success pull-right" @click="addPreorderToMessage(preOrderId)"><i class="fa fa-send"></i> Прикрепить</button>
        </div> -->
      </div>
    </div>
  </div>
  <!-- <popuppal v-if="orderContent"
    :showInModalTypical="showInModalTypical"
    :detailType="detailType"
    :data="searchTrees"
    
    :vehid="orderContent.UserCarModel.VehicleRecordId"
    :parent="0"
    :wload="$store.state.selorder.workDetailLoader"
    :dload="$store.state.selorder.detailLoader"
    :carInfo="orderContent.UserCarModel">
  </popuppal> -->
</div>
</template>

<script>
import host from '../../data/host.js'
import Tree from './Tree'
// import popuppal from './popuppal'
import detailPanel from './preOrder/detailPanel'
import workPanel from './preOrder/workPanel'
import aboutPreorder from './preOrder/about'
import aboutCar from './preOrder/aboutCar'
import orderinfoModal from './preOrder/orderinfoModal'
import aboutcarModal from './preOrder/aboutcarModal'
import confirmModal from './preOrder/confirmPreorder'
import clientPanel from './Order/clientPanel'
import physicalModal from './physical'

export default {
  name: 'PreOrder',
  components: {
		Tree,
    // popuppal,
    detailPanel,
    workPanel,
    aboutPreorder,
    aboutCar,
    orderinfoModal,
    aboutcarModal,
    confirmModal,
    clientPanel,
    physicalModal
	},
  props: ['preOrderId'],
  data() {
    return {
      addedDetail: [],
      addedFav: [],
      addedLabor: [],
      addedTypical: [],
      allDetail: [],
      detailLoader: false,
      detailType: 1,
      errorPrivUser: false,
      headerStep: '2',
      isNewFavoriteDetail: false,
      laborId: 0,
      loader: false,
      newFavoriteDetails: '',
      newGetWorkForDetail: [],
      orderInfo: [],
      pageLoader: false,
      partId: 0,
      popupCloseStatus: 0,
      preOrderActionLoader: false,
      preOrderInfo: [],
      selectDetail: '',
      selectedPart: '',
      selectedTypical: '',
      serverError: false,
      setActiveWorkForDetail: '',
      trees: [],
      typicalList: [],
      updateDetail: false,
      updateWork: false,
      updateWork: false,
      workDetailLoader: false,
      workForDetail: [],
      userInfo: []
    }
  },
  methods: {
    // getPartInModal(id) {
    //   this.selectedPart = id
    //   this.detailType = 2
    //   if(this.trees == '') this.getAllDetail()
    // },
    // getTypicalLaborInModal(node) {
    //   this.selectedTypical = node
    //   this.detailType = 1
    //   if(this.trees == '') this.getAllDetail()
    // },
    // getLaborInModal(partId) {
    //   this.getNodeParts(partId)
    //   this.detailType = 2
    //   if(this.trees == '') this.getAllDetail()
    // },
    addPreorderToMessage(preOrderId) {
      $('#PreOrder').modal('hide')
      this.$parent.$emit('addPreorderToMessage', preOrderId)
    },
    // getNodeParts(partId) {
    //   this.selectDetail = partId
    //   let parseModel = this.preOrderInfo.UserCarModel.Model.replace(/ /g,'')
    //   this.$http.get(`${host.host}/Vehicle/${this.preOrderInfo.VehicleRecordId}/NodeParts?partId=${partId}&model=${parseModel}`, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token'),
    //       'Content-Type' : 'application/json; charset=UTF-8',
    //       'Accept' : 'application/json'
    //     }
    //   }).then(response => {
    //     let data = JSON.parse(response.body.model)
    //     for(let i=0;i<data.length;i++) {
    //       if(data[i].HasLabors == true && data[i].Id == partId) {
    //         this.newGetWorkForDetail = data[i]
    //         this.selectedPart = data[i].TreeNodeId
    //       }
    //     }
    //   }, response => {
    //     return toastr.error('Ошибка сервера')
    //   })
    // },
    delSelectedLabors(labors, typicals) { // удалить выбранные работы (нету чекбоксов)
      let laborsId = []
      let typicalsId = []
      for(let i=0;i<labors.length;i++) {
        laborsId.push(labors[i].Id) 
      }
      for(let i=0;i<typicals.length;i++) {
        typicalsId.push(typicals[i].Id) 
      }
      this.updateWork = true
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/Labors`, {
        'lpIds': laborsId,
        'listTypical': typicalsId
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)
        this.updateWork = false
        this.preOrderInfo = data

        return toastr.success('Работы успешно удалены!')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    delSelected(parts, favs) {
      if(parts.length == 0) return this.delSelectedFav(favs)
      let delParts = []
      for(let i=0;i<parts.length;i++) {
        delParts.push(parts[i].Id)
      }
      this.updateDetail = true
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/Parts`, delParts, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.body.error == true) {
          this.updateDetail = false
          return toastr.error('Ошибка сервера')
        }
        if(favs.length != 0) return this.delSelectedFav(favs)
        let data = JSON.parse(response.data.model)
        this.updateDetail = false
        this.preOrderInfo = data
        if(this.preOrderInfo.listParts == '' && this.preOrderInfo.listLabors == '' && this.preOrderInfo.listTypicalLabors == '' && this.preOrderInfo.listFavoriteParts == '') {
          this.headerStep = '2'
        } else this.headerStep = '3'
        return toastr.success('Детали успешно удалены!')
      }, response => {
        this.updateDetail = false
        return toastr.error('Ошибка сервера')
      })
    },
    phyDetailList() {
      if(this.$store.state.selorder.selectPhydetail == 0) return this.$store.state.selorder.phyDetail
      if(this.$store.state.selorder.selectPhydetail == 1) {
        this.$store.state.selorder.phyDetailNotFound = false
        return this.$store.state.selorder.phyDetail.filter((item) => {
          if(!item.isOriginal) return !item.isOriginal
            else this.$store.state.selorder.phyDetailNotFound = true
          })
      }
      if(this.$store.state.selorder.selectPhydetail == 2) {
        this.$store.state.selorder.phyDetailNotFound = false
        return this.$store.state.selorder.phyDetail.filter((item) => {
          if(item.isOriginal) return item.isOriginal
            else this.$store.state.selorder.phyDetailNotFound = true
          })
      }
    },
    uploadWorks(labors, typicals) {
      let addedLabors = []
      let addedTypicals = []
      for(let i=0;i<labors.length;i++) {
        addedLabors.push({
          'id': Number(labors[i].Id),
          'newCount': Number(labors[i].NumberCustomLabors)
        })
      }
      for(let i=0;i<typicals.length;i++) {
        addedTypicals.push({
          'id': Number(typicals[i].Id),
          'newCount': Number(typicals[i].Amount)
        })
      }
      this.updateWork = true
      this.$http.post(`${host.host}/PreOrder/${this.preOrderId}/Labors/Update?ucId=${this.preOrderInfo.UserCarId}`, {
        'newLabors': addedLabors,
        'newLaborsTypical': addedTypicals
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateWork = false
        if(response.body.error == true) {
          return toastr.error('Ошибка сервера')
        }
        let data = JSON.parse(response.data.model)
        this.preOrderInfo = data
        // return toastr.success('Работы успешно обновлены!')
      }, response => {
        this.updateWork = false
        return toastr.error('Ошибка сервера')
      })
    },
    uploadDetails(parts, favs) {
      if(parts.length == 0) return this.uploadFavs(favs)
      let detailsList = []
      for(let i=0;i<parts.length;i++) {
        detailsList.push({
          'id': Number(parts[i].Id),
          'newCount': Number(parts[i].NumberCustomParts)
        })
      }
      this.updateDetail = true
      this.$http.post(`${host.host}/PreOrder/${this.preOrderId}/Parts/Update?ucId=${this.preOrderInfo.UserCarId}`, detailsList, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateDetail = false
        if(response.body.error == true) {
          return toastr.error('Ошибка сервера')
        }
        if(favs.length != 0) return this.uploadFavs(favs)
        let data = JSON.parse(response.data.model)
        this.preOrderInfo = data
        // return toastr.success('Детали успешно обновлены!')
      }, response => {
        this.updateDetail = false
        return toastr.error('Ошибка сервера')
      })
    },

    uploadFavs(favs) {
      let favList = []
      for(let i=0;i<favs.length;i++) {
        favList.push({
          pId: favs[i].Id,
          newCount: Number(favs[i].Count)
        })
      }
      this.updateDetail = true
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/FavPart`, favList, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateDetail = false
        if(response.body.error == true) {
          return toastr.error('Ошибка сервера')
        }
        let data = JSON.parse(response.data.model)
        this.preOrderInfo = data
        // return toastr.success('Детали успешно обновлены!')
      }, response => {
        this.updateDetail = false
        return toastr.error('Ошибка сервера')
      })
    },

    delFavDetail(id) {
      let favId = []
      favId.push(id)
      this.updateDetail = true
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/FavPart/Delete`, favId, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateDetail = false
        let data = JSON.parse(response.body.model)
        this.preOrderInfo = data
        return toastr.success('Деталь успешно удалена!')
      }, response => {
        this.updateDetail = false
      })
    },

    delDetail(detailId) {
      let partsId = []
      partsId.push(detailId)
      this.updateDetail = true
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/Parts`, partsId, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateDetail = false
        let data = JSON.parse(response.body.model)
        this.preOrderInfo = data
        if(this.preOrderInfo.listParts == '' && this.preOrderInfo.listLabors == '' && this.preOrderInfo.listTypicalLabors == '' && this.preOrderInfo.listFavoriteParts == '') {
          this.headerStep = '2'
        } else this.headerStep = '3'
        return toastr.success('Деталь успешно удалена!')
      }, response => {
        this.updateDetail = false
      })
    },
    delLabot(laborId) {
      let laborsId = []
      laborsId.push(laborId)
      this.updateWork = true
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/Labors`, {
        "lpIds": laborsId,
        "listTypicalLabors": [0]
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateWork = false
        if(response.body.error == true) return toastr.error('Ошибка сервера')
        let data = JSON.parse(response.body.model)
        this.preOrderInfo = data
  
        return toastr.success('Работа успешно удалена!')
      }, response => {
        this.updateWork = false
      })
    },
    delAllTypical(id) {
      let idArr = []
      idArr.push(id)
      this.updateWork = true
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/Labors`, {
        "lpIds": [],
        "listTypicalLabors": idArr
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'), 
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateWork = false
        let data = JSON.parse(response.data.model)
        this.preOrderInfo = data
        if(this.preOrderInfo.listParts == '' && this.preOrderInfo.listLabors == '' && this.preOrderInfo.listTypicalLabors == '' && this.preOrderInfo.listFavoriteParts == '') {
          this.headerStep = '2'
        } else this.headerStep = '3'
        return toastr.success('Работа успешно удалена!')
      }, response => {
        this.updateWork = false
        return toastr.error('Ошибка сервера')
      })
    },
    addAllDetailsAndLabors() {
      $("#addPartOrLaborModal").modal('hide')
      if(this.addedLabor.length != 0 || this.addedTypical.length != 0) this.updateWork = true
      if(this.addedDetail.length != 0 || this.addedFav.length != 0) this.updateDetail = true
      this.sendNewDetail()
    },
    sendNewDetail() {
      if(this.addedDetail.length == 0) return this.sendNewLabor()
      let arrays = []
      for(let i=0;i<this.addedDetail.length;i++) {
        arrays.push({"catalogPart": Object.assign({}, this.addedDetail[i])})
        arrays[i].amount = this.addedDetail[i].Amount
      }
      if(this.addedDetail.length == 0) return this.updateDetail = false
      this.updateDetail = true
      this.$http.post(`${host.host}/PreOrder/${this.preOrderId}/Parts?ucId=${this.preOrderInfo.UserCarId}`, arrays, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.data.error) {
          if(response.body.message == "Logistic part for current car not found") toastr.info('В данный момент детали нет в продаже')
          else toastr.error('Ошибка при добавлении детали') 
          return this.updateDetail = false
        }
        let data = JSON.parse(response.data.model)
        if(this.addedFav.length == 0) this.updateDetail = false
        this.preOrderInfo = data
        this.addedDetail = []
        this.headerStep = '3'
        this.sendNewLabor();
        return toastr.success('Выбранные детали успешно добавлены!')
      }, response => {
        toastr.error('Ошибка при добавлении детали')
        return this.updateDetail = false
      })
    },
    sendNewLabor() {
      if(this.addedLabor.length == 0) return this.sendNewTypical()

      let addedLabors = []
      for(let i=0;i<this.addedLabor.length;i++) {
        addedLabors.push({
          laborId: this.addedLabor[i].Id,
          amount: 1,
          fromPartId: this.addedLabor[i].FromPartId,
          fromPartCatalogType: this.addedLabor[i].fromPartCatalogType
        })
      }
      this.updateWork = true
      this.$http.post(`${host.host}/PreOrder/${this.preOrderId}/Labors?ucId=${this.preOrderInfo.UserCarId}`, addedLabors, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.data.error) {
          this.updateWork = false
          return toastr.error('Ошибка при добавлении работы')
        }
        let data = JSON.parse(response.data.model)
        if(this.addedTypical.length == 0) this.updateWork = false
        this.preOrderInfo = data
        this.addedLabor = []
        this.headerStep = '3'
        this.sendNewTypical()
        return toastr.success('Выбранные работы успешно добавлены!')
      }, response => {
        this.updateWork = false
        return toastr.error('Ошибка при добавлении детали')
      })
    },
    sendNewTypical() {
      let typicalArr = []
      this.updateWork = true
      for(let i=0;i<this.addedTypical.length;i++) {
        typicalArr.push({
          laborId: this.addedTypical[i].Id,
          amount: 1,
          fromPartId: 0
        })
      }
      this.$http.post(`${host.host}/PreOrder/${this.preOrderId}/TypicalLabors/${this.preOrderInfo.UserCarModel.Id}?IsDiagnostics=false`, typicalArr, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)
        this.updateWork = false
        this.preOrderInfo = data
        this.addedTypical = []
        this.headerStep = '3'
        return toastr.success('Выбранные общие работы успешно добавлены!')
      }, response => {
        this.updateWork = false
        return toastr.error('Ошибка сервера')
      })
    },
    delWorkInfo(index) {
      addedLabor.splice(index, 1)
    },
    delOneDetailInfo(index) {
      this.addedDetail.splice(index, 1)
    },
    // getWorkForDetail(id, LaborIds, oem) {
    //   if(this.workForDetail != '' && this.workForDetail[0].ppId == id) return false
    //   this.workDetailLoader = true
    //   this.$http.put(`${host.host}/Vehicle/${this.preOrderInfo.VehicleRecordId}/Labors?oem=${oem}&model=${this.preOrderInfo.userCarModel.Model}`, LaborIds, {
    //     headers: {
    //       'Authorization': 'Bearer ' + this.$store.state.selorder.token,
    //       'Content-Type' : 'application/json; charset=UTF-8',
    //       'Accept' : 'application/json'
    //     }
    //   }).then(response => {
    //     if(response.body.error == true) {
    //       this.workDetailLoader = false
    //       return toastr.error('Ошибка сервера')
    //     }
    //     let data = JSON.parse(response.data.model)
    //     this.workForDetail = data
    //     this.workDetailLoader = false
    //   }, response => {
    //     this.workDetailLoader = false
    //     return toastr.error('Ошибка сервера')
    //   })
    // },
    getPreOrderInfo() {
      this.pageLoader = true
      this.loader = true
      this.$http.get(`${host.host}/PreOrder/${this.preOrderId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.pageLoader = false
        this.loader = false
        this.serverError = false
        if(response.body.message == "Pre-Order with this id don't find") return this.serverError = true
        this.loader = false
        let data = JSON.parse(response.data.model)
        this.preOrderInfo = data
        this.getUserInfo()
        if(this.preOrderInfo.listParts == '' && this.preOrderInfo.listLabors == '' && this.preOrderInfo.listTypicalLabors == '' && this.preOrderInfo.listFavoriteParts == '') {
          this.headerStep = '2'
        } else this.headerStep = '3'
      }, response => {
        this.pageLoader = false
        this.loader = false
        return toastr.error('Ошибка сервера')
      })
    },
    // getAllDetail() { // грузим модалку деталей и работ
    //   if(this.trees != '') return false
    //   this.$http.get(`${host.host}/Garage/${this.orderInfo.UserCarId}/Tree`, {
    //     headers: {
    //       'Authorization': 'Bearer ' + this.$store.state.selorder.token,
    //       'Content-Type' : 'application/json; charset=UTF-8',
    //       'Accept' : 'application/json'
    //     }
    //   }).then(response => {
    //     if(response.body.error == true) return toastr.error('Ошибка сервера')
    //     let data = JSON.parse(response.data.model)
    //     if(data == '' && this.popupCloseStatus == 0) setTimeout(this.getAllDetail, 1000)

    //     let nodes = []
    //     nodes.push({ "id" : "root", "parent" : "#", "text" : "Каталог"})
    //     for(let i=0;i<data.length;i++) {
    //       if(data[i].ParentId == 0) data[i].ParentId = "root"
    //       nodes.push({
    //         id: data[i].Id,
    //         parent: data[i].ParentId,
    //         text: data[i].Title,
    //         PictureId: data[i].PictureId
    //       })
    //     }

    //     this.trees = nodes
    //   }, response => {
    //     return toastr.error('Ошибка сервера')
    //   })
    // },
    delAllLabor() {
      this.updateWork = true
      let laborsId = []
      let typicalsId = []
      jQuery.each(this.preOrderInfo.listLabors, function(index, value) {
        laborsId.push(value.Id)
      })
      jQuery.each(this.preOrderInfo.listTypicalLabors, function(index, value) {
        typicalsId.push(value.Id)
      })
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}${this.$route.params.id}/Labors`, {
        'lpIds': laborsId,
        'listTypical': typicalsId
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)
        this.updateWork = false
        this.preOrderInfo = data
        if(this.preOrderInfo.listParts == '' && this.preOrderInfo.listLabors == '' && this.preOrderInfo.listTypicalLabors == '' && this.preOrderInfo.listFavoriteParts == '') {
          this.headerStep = '2'
        } else this.headerStep = '3'
        return toastr.success('Все работы успешно удалены!')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    physicalDetail(oem, id, index, num, isFav, preorderOEM) {
      localStorage.setItem('detailInFavList', isFav) // isFav - булево есть ли деталь в избранном

      this.$store.state.selorder.selectedDetails = []
      this.$store.state.selorder.selectPhyDetailItem = 0
      this.$store.state.selorder.selectReadlDetail = ''
      this.$store.state.selorder.selectReadlDetail = id
      this.$store.state.selorder.selnumCusPart = num
      this.$store.state.selorder.phyDetailLoader = true
      // `${host.host}/Trader/Offers/Download/?orderpartOEM=${oem}&make=${this.$store.state.selorder.orders.UserCarModel.Make}&preorderOEM=${preorderOEM}`
      this.$http.get(`${host.host}/Trader/Offers/Download/?orderpartOEM=${oem}&make=${this.orderInfo.UserCarModel.Make}&preorderOEM=${preorderOEM}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.$store.state.selorder.phyDetailLoader = false
        if(response.body.error == true) {
          this.$store.state.selorder.phyDetail = ''
          return toastr.error('Ошибка сервера')
        }
        let data = JSON.parse(response.data.model)

        this.$store.state.selorder.phyDetail = data
      }, response => {
        this.$store.state.selorder.phyDetailLoader = false
      })
    },
    getUserInfo() {
      this.$http.get(`${host.host}/User/?userId=${this.preOrderInfo.UserId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)
        this.userInfo = data
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    delAllDetails() {
      this.updateDetail = true
      let detailsId = []
      jQuery.each(this.preOrderInfo.listParts, function(index, value) {
        detailsId.push(value.Id)
      })
      this.$http.put(`${host.host}/PreOrder/${this.preOrderId}/Parts`, detailsId, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.data.model)
        this.updateDetail = false
        this.preOrderInfo = data
        if(this.preOrderInfo.listParts == '' && this.preOrderInfo.listLabors == '' && this.preOrderInfo.listTypicalLabors == '' && this.preOrderInfo.listFavoriteParts == '') {
          this.headerStep = '2'
        } else this.headerStep = '3'
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    }
  },
  computed: {
    carInfoParse() {
      return this.preOrderInfo.UserCarModel.Model.replace(/ /g,'')
    }
  },
  created() {
    this.popupCloseStatus = 0
    this.getPreOrderInfo()
    this.$parent.orderPreorder = 1 
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    })
  },
  mounted() {
    this.$on('delAllLabor', function() {
      this.delAllLabor()
    }),
    this.$on('delLabotPreOrder', function(id) {
      this.delLabot(id)
    }),
    this.$on('delDetailPreOrder', function(id) {
      this.delDetail(id)
    }),
    this.$on('getAllDetail', function() {
      //this.popupCloseStatus = 0 
      console.log('preOrder1')
      $('#PreOrder').modal('hide')
      $('#Order').modal('hide')
    }),
    this.$on('getTreeData', function(data) {
      this.allDetail = data
      this.detailLoader = false
    }),
    this.$on('detailLoader', function(data) {
     this.detailLoader = data
     this.workForDetail = []
    }),
    this.$on('addDeAndLa', function(data) {
     this.addedLabor = data.labor
     this.addedDetail = data.detail
     this.addedTypical = data.typical
     this.addedFav = data.fav
     this.addAllDetailsAndLabors()
    }),
    this.$on('delAllDetails', function() {
      this.delAllDetails()
    }),
    this.$on('delAllTypical', function(id) {
      this.delAllTypical(id)
    }),
    this.$on('uploadDetailsCounts', function(list) {
      this.uploadDetails(list.parts, list.favs)
    }),
    this.$on('uploadWorks', function(newWorks) {
      this.uploadWorks(newWorks.labors, newWorks.typicals)
    }),
    this.$on('preOrderConvertToOrder', function() {
      this.goToRealOrder()
    }),
    this.$on('delSelected', function(list) {
      this.delSelected(list.parts, list.fav)
    }),
    this.$on('delSelectedLabors', function(selected) {
      this.delSelectedLabors(selected.labors, selected.typicals)
    }),
    this.$on('getTypicalLaborInModal', function(node) {
      this.getTypicalLaborInModal(node)
    }),
    this.$on('getLaborInModal', function(data) {
      this.getLaborInModal(data.part)
      this.setActiveWorkForDetail = data.labor
    }),
    this.$on('delPreOrder', function() {
      this.delPreOrder()
    }),
    this.$on('getPartInModal', function(data) {
      this.getPartInModal(data.tree)
      this.selectDetail = data.catalog
    }),
    this.$on('closePopup', function() {
      this.popupCloseStatus = 1
    }),
    this.$on('addNewFavoriteDetails', function(data) {
      this.addNewFavoriteDetails(data)
    }),
    this.$on('delFavDetail', function(id) {
      this.delFavDetail(id)
    }),
    this.$on('physicalDetailOrder', function(oem, catalogId, index, num, isFav, preorderOem) {
      this.physicalDetail(oem, catalogId, index, num, isFav, preorderOem)
    })
  }
}
</script>

<style scoped>
  .input-group {
    margin-top: 5px
  }

  .modal-lg {
    max-width: 95%;
}
</style>

<style scoped>
	
	i, .activeItem {
  	cursor: pointer;
  	color: #333;
  }

  .newMilageForm {
		padding-bottom: 10px;
	}

	input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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

	.newMilageForm {
		padding-bottom: 10px;
	}

	input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

	.table tbody+tbody {
    border-top: 1px solid #ddd;
	}

	#ordercomment {
    max-height: 260px;
    overflow: auto;
	}

	#yourComment {
		resize: none;
	}

	.commRight {
		text-align: right;
	}

	.commRight span {
		position: relative;
    top: -7px;
	}

	.commRight b {
		position: relative;
		top: -7px;
	}

	.commLeft span {
		position: relative;
		top: -5px;
	}

	.commLeft b {
		position: relative;
		top: -5px;
	}

	.middleModal {
		max-height: 500px;
		overflow: auto;
	}
	
	.panel-heading h4 {
    cursor: pointer;
  }

  .thumbnail {
    overflow: auto;
    max-height: 175px;
    min-height: 175px;
    border-radius: 0px;
  }

  .detail-panel {
    text-align: left;
    border: 1px solid #9E9E9E;
    padding: 10px;
  }

  .detail-panel input[type='checkbox'] {
    margin-left: 0px;
  }

  .infoPanel {
    text-align: left;
    border: 1px solid #9E9E9E;
    padding: 5px;
    margin-bottom: 5px;
  }

  i, .activeItem {
  	cursor: pointer;
  }

  .removeTable {
  	width: 31px;
  }

  .panel-heading h3 {
		white-space: nowrap;
		overflow: hidden;
    text-overflow: ellipsis;
    line-height: normal;
    width: 45%;
    padding-top: 8px;
  }

  .modalTitle {
    position: relative;
    top: -5px;
  }

  .panel-heading .fa-bars {
  	position: relative;
    top: -2px;
  }

  .panel-heading {
    margin-bottom: -1px;
  }

  .noresize {
    resize: vertical;
  }

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
}

.panel-default {
    border-color: #ddd;
}

.panel-default>.panel-heading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
}
.panel-heading {
    cursor: pointer;
}
.panel-heading {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}
.detailPanel .panel-title, .workPanel .panel-title {
    margin-top: 8px;
}
.panel-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 16px;
    color: inherit;
}
</style>