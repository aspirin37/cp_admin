import state from './state'
import Vue from 'vue'
import router from '../../router'
import host from '../../data/host.js'

export default {
	getAllActiveOrder: (state) => {
		state.loader = true
    Vue.http.get(`${host.host}/Server/Time`, {
      headers: {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.body.error == true) {
        state.serverError = true
        return toastr.error('Ошибка сервера')
      }
      let data = response.body
      let serverDate = parseUnixDateTime((Date.parse(data.ServerTime)/1000))
      let localDate = parseUnixDateTime(Date.parse(new Date)/1000)
      if((serverDate - localDate) > 900 || (localDate - serverDate) > 900) {
        localStorage.setItem('CarPortServerUserTime', data.ServerTime)
        return router.push('/ErrorTime')
      }
      localStorage.removeItem('CarPortServerUserTime')
      Vue.http.get(`${host.host}/Order`, {
        headers : {
          'Authorization': 'Bearer ' + state.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        state.loader = false
        if(response.body.error == true) {
          state.serverError = true
          return toastr.error('Ошибка сервера')
        }
        if(response.body.model == '[]') return state.orders = []
        let data = JSON.parse(response.data.model)
        state.orders = data.orders
        state.count.orders = data.CountOrders
        localStorage.setItem('CPcountOrders', data.CountOrders)
        state.count.preorders = data.CountPreOrders - data.CountOrders
        localStorage.setItem('CPcountPreOrders', data.CountPreOrders - data.CountOrders)
        state.count.archive = data.CountArchiveOrders
        return localStorage.setItem('CPcountArchive', data.CountArchiveOrders)
      }, response => {
        state.serverError = true
        state.loader = false
        toastr.error('Ошибка сервера')
      })
    }, response => {
      state.serverError = true
      state.loader = true
      return toastr.error('Ошибка сервера')
    })
	},
	ordersGetGarage: (state) => {
		state.carListLoader = true
    Vue.http.get(`${host.host}/Garage`, {
      headers : {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      state.carListLoader = false
      if(response.body.error == true) return toastr.error('Ошибка сервера')
      if(response.data.model == '[]') return state.cars = []
      let data = JSON.parse(response.data.model).reverse()
      state.cars = data
      state.selectedAuto = state.cars[0].Id
      state.VehicleRecordId = state.cars[0].VehicleRecordId
      state.vehid = state.cars[0].VehicleId
    }, response => {
      state.carListLoader = false
      return toastr.error('Ошибка сервера')
    })
	},
  ordersDelOneDetailInfo: (state, payload) => {
    state.infoAboutDetail.splice(payload.index, 1)
  },
  orderСlearFoundField: (state) => {
    state.allDetail = []
    state.workForDetail = []
  },
  ordersSelectActiveAuto: (state, payload) => {
    state.selectedAuto = payload.id
    state.vehid = payload.vehid
  }
}

function parseUnixDateTime(dt) {
  return String(dt).split('.')[0]
}