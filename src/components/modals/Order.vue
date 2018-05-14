<template>
<div>
  <div id="Order" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header" v-if="!loader && !serverError && orderInfo != ''">
          <h5>Заказ №{{orderId}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-12" v-if="loader">
              <div class="text-center" style="margin-top: 20px;">
                <img src="../../assets/load.svg" alt="load gif" width="40">
              </div>
            </div>

            <div class="col-lg-12" v-if="!loader && !serverError && orderInfo != ''">
              <client-panel
                :userModel="userModel"
                :carModel="carModel">

              </client-panel>

              <detail-panel
                :updateWork="updateWork"
                :updateDetail="updateDetail"
                :preOrderActionLoader="preOrderActionLoader"
                :list="orderInfo.OrderPartModel"
                :favList="orderInfo.OrderFavoriteParts"
                :canFiz="orderInfo.UserModel.CanFizRealisation"
              ></detail-panel>

              <work-panel
                :updateWork="updateWork"
                :updateDetail="updateDetail"
                :preOrderActionLoader="preOrderActionLoader"
                :list="orderInfo.OrderLaborModel"
                :typical="orderInfo.OrderTypicalLabors"
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

              <order-history-panel
                :orderId="orderId"
              >
            </order-history-panel>
            </div>
          </div>
          
        </div>
        <!-- <div class="modal-footer">
          <button class="btn btn-success pull-right" @click="addOrderToMessage(orderId)">Сохранить</button>
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
import detailPanel from './Order/detailPanel'
import workPanel from './Order/workPanel'
import aboutPreorder from './Order/about'
import aboutCar from './Order/aboutCar'
import orderinfoModal from './Order/orderinfoModal'
import aboutcarModal from './Order/aboutcarModal'
import confirmModal from './Order/confirmPreorder'
import physicalModal from './physical'
import orderHistoryPanel from './Order/orderHistory'
import clientPanel from './Order/clientPanel'

export default {
  name: 'Order',
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
    physicalModal,
    orderHistoryPanel,
    clientPanel
	},
  props: ['orderId'],
  data() {
    return {
      userModel: [],
      carModel: [],
      errorPrivUser: false,
      pageLoader: false,
      typicalList: [],
      addedTypical: [],
      loader: false,
      serverError: false,
      orderInfo: [],
      preOrderInfo: [],
      trees: [],
      allDetail: [],
      addedDetail: [],
      detailLoader: false,
      workForDetail: [],
      workDetailLoader: false,
      addedLabor: [],
      updateWork: false,
      laborId: 0,
      updateDetail: false,
      partId: 0,
      updateWork: false,
      preOrderActionLoader: false,
      detailType: 1,
      popupCloseStatus: 0,
      isNewFavoriteDetail: false,
      newFavoriteDetails: '',
      headerStep: '2',
      addedFav: [],
      selectedPart: '',
      selectDetail: '',
      selectedTypical: '',
      newGetWorkForDetail: [],
      setActiveWorkForDetail: ''
    }
  },
  methods: {


    getAllDetail(){
      $('#Order').modal('hide')
    },

    addOrderToMessage (orderId) {
      $('#Order').modal('hide')

      this.$parent.$emit('addOrderToMessage', orderId)
    },
    // getNodeParts(partId) {
    //   console.log('parts')
    //   this.selectDetail = partId
    //   let parseModel = this.orderInfo.UserCarModel.Model.replace(/ /g,'')
    //   this.$http.get(`${host.host}/Vehicle/${this.orderInfo.UserCarModel.VehicleRecordId}/NodeParts?partId=${partId}&model=${parseModel}`, {
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

    delAllTypical(id) { // удалить работу крестиком
      let idArr = []
      idArr.push(id)
      this.updateWork = true
      this.$http.put(`${host.host}/Order/${this.orderId}/Labors`, {
        'lpIds': [],
        'listTypicalLabors': idArr
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateWork = false
        let data = JSON.parse(response.data.model)
        this.orderInfo = data

        return toastr.success('Работа успешно удалена!')
      }, response => {
        this.updateWork = false
        return toastr.error('Ошибка сервера')
      })
    },

    delLabot(laborId) {
      let laborsId = []
      laborsId.push(laborId)
      this.updateWork = true
      this.$http.put(`${host.host}/Order/${this.orderId}/Labors`, {
        lpIds: laborsId,
        listTypicalLabors: []
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateWork = false
        let data = JSON.parse(response.body.model)
        this.orderInfo = data

        return toastr.success('Работа успешно удалена!')
      }, response => {
        this.updateWork = false
      })
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
      this.$http.post(`${host.host}/Order/${this.orderId}/Labors/Update?ucId=${this.orderInfo.UserCarModel.Id}`, {
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
        this.orderInfo = data
        // return toastr.success('Работы успешно обновлены!')
      }, response => {
        this.updateWork = false
        return toastr.error('Ошибка сервера')
      })
    },

    delDetail(detailId) {
      let partsId = []
      partsId.push(detailId)
      this.updateDetail = true
      this.$http.put(`${host.host}/Order/${this.orderId}/Parts`, partsId, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateDetail = false
        let data = JSON.parse(response.body.model)
        this.orderInfo = data

        return toastr.success('Деталь успешно удалена!')
      }, response => {
        this.updateDetail = false
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
      this.$http.post(`${host.host}/Order/${this.orderId}/Parts/Update?ucId=${this.orderInfo.UserCarModel.Id}`, detailsList, {
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
        this.orderInfo = data
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
      this.$http.put(`${host.host}/Order/${this.orderId}/FavPart`, favList, {
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
        this.orderInfo = data
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
      this.$http.put(`${host.host}/Order/${this.orderId}/FavPart/Delete`, favId, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateDetail = false
        let data = JSON.parse(response.body.model)
        this.orderInfo = data
        return toastr.success('Деталь успешно удалена!')
      }, response => {
        this.updateDetail = false
      })
    },

    getOrderInfo() {
      this.pageLoader = true
      this.loader = true
      this.$http.get(`${host.host}/Order/${this.orderId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.pageLoader = false
        this.loader = false
        this.serverError = false
        if(response.body.message == "Order not found") return this.serverError = true
        this.loader = false
        let data = JSON.parse(response.data.model)
        this.orderInfo = data
        this.userModel = data.UserModel
        this.carModel = data.UserCarModel
    
      }, response => {
        this.pageLoader = false
        this.loader = false
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
    updateDetails() {
      this.updateDetail = true
      this.$http.get(`${host.host}/Order/${this.orderId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.body.message == "Order not found") return this.serverError = true
        let data = JSON.parse(response.data.model)
        this.orderInfo = data
        this.updateDetail = false
      }, response => {
        this.updateDetail = false
        return toastr.error('Ошибка сервера')
      })
    },
    selPhyDetail(detail) {
      let isFavPart = localStorage.getItem('detailInFavList') || false // смотрим есть ли деталька в избранном ( определяется в physicalDetail())

  	  this.$store.state.selorder.updateDetail = true
	    this.$http.put(`${host.host}/Order/${this.orderId}/Part/${this.$store.state.selorder.selectReadlDetail}/${this.$store.state.selorder.selnumCusPart}?isFavPart=`+isFavPart, Number(detail.Id), {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
      	this.$store.state.selorder.updateDetail = false
      	let data = JSON.parse(response.data.model)
      	this.$store.state.selorder.vehid = this.orderInfo.UserCarModel.VehicleRecordId
	      this.$store.state.selorder.orders = data
        this.updateDetails()
        return toastr.success('Данные успешно изменены')
      }, response => {
      	this.$store.state.selorder.updateDetail = false
      	return toastr.error('Ошибка сервера')
      })
  	}
  },
  computed: {
    
  },
  created() {
    this.popupCloseStatus = 0
    this.getOrderInfo()

    this.$parent.orderPreorder = 0

    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    })
  },
  mounted() {
    this.$on('physicalDetailOrder', function(oem, catalogId, index, num, isFav, preorderOem) {
    	this.physicalDetail(oem, catalogId, index, num, isFav, preorderOem)
    })
    this.$on('delAllTypical', function(id) {
      this.delAllTypical(id)
    })
    this.$on('delLabotOrder', function(id) {
      this.delLabot(id)
    })
    this.$on('uploadWorks', function(newWorks) {
      this.uploadWorks(newWorks.labors, newWorks.typicals)
    })
    this.$on('delDetailOrder', function(id) {
      this.delDetail(id)
    })
    this.$on('uploadDetailsCounts', function(list) {
      this.uploadDetails(list.parts, list.favs)
    })
    this.$on('getAllDetail', function() {
      this.getAllDetail()
    })
    this.$on('delFavDetail', function(id) {
      this.delFavDetail(id)
    })
    this.$on('selPhyDetail', function(detail) {
      this.selPhyDetail(detail)
    })
  }
}
</script>

<style>
.table-responsive { overflow-x: auto;}
</style>


<style lang="sass">

.modal-lg 
  max-width: 95%

.order-table
  margin-bottom: 0

</style>