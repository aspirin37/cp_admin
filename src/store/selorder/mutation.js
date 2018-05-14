import state from './state'
import Vue from 'vue'
import router from '../../router'
import host from '../../data/host.js'

export default {
  ordersDelAllDetails: (state, payload) => {
    state.updateDetail = true
    let partsId = []
    jQuery.each(state.orders.OrderPartModel, function(index, value) {
      partsId.push(value.Id)
    })
    Vue.http.put(`${host.host}/Order/${payload.id}/Parts`, partsId,  {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      state.updateDetail = false
      let data = JSON.parse(response.data.model)
      state.orders = data
    }, response => {
      state.updateDetail = false
      return toastr.error('Ошибка сервера')
    })
  },
	selorderGetOrder: (state) => {
		state.loader = true
    state.isPageLoader = true
    Vue.http.get(`${host.host}/Server/Time`, {
      headers: {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.body.error == true) {
        state.isPageLoader = false
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
      Vue.http.get(`${host.host}/Order/${state.selectedOrderId}`, {
        headers : {
          'Authorization': 'Bearer ' + state.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        state.errorGetOrder = false
        if(response.body.message == 'Sequence contains no elements') {
          state.isPageLoader = false
          state.loader = false
          return state.errorPage = true
        }
        if(response.body.error == true) {
          state.isPageLoader = false
          state.loader = false
          state.errorGetOrder = true
          return toastr.error('Ошибка сервера')
        }
        state.isPageLoader = false
        let data = JSON.parse(response.data.model)
        state.orders = data
        console.log('huy', data)
        state.vehid = data.UserCarModel.VehicleRecordId
        checkPaymentOrder()
      }, response => {
        state.isPageLoader = false
        state.loader = false
        return toastr.error('Ошибка сервера')
      })
    }, response => {
      state.isPageLoader = false
      state.loader = true
      return toastr.error('Ошибка сервера')
    })
	},
	selorderGetOrderById: (state) => {

    state.popupCloseStatus = 0
		Vue.http.get(`${host.host}/Garage/${state.orders.UserCarModel.Id}/Tree`, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
    	if(response.body.error == true) return toastr.error('Ошибка сервера')
      let data = JSON.parse(response.data.model)
      if(data == '' && state.popupCloseStatus == 0) setTimeout(selorderGetOrderById, 1000)
      this.$store.state.selorder.trees = data
    }, response => {
    	return toastr.error('Ошибка сервера')
    })
	},
	selorderGetWorkForDetail: (state, payload) => {
		if(state.workForDetail != '' && state.workForDetail[0].ppId == payload.id) return false
  	state.workDetailLoader = true
    Vue.http.put(`${host.host}/Vehicle/${state.orders.UserCarModel.VehicleRecordId}/Labors?oem=${payload.oem}&model=${state.orders.UserCarModel.Model}`, payload.LaborIds, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
    	if(response.body.error == true) {
        state.workDetailLoader = false
        return toastr.error('Ошибка сервера')
      }
      let data = JSON.parse(response.data.model)
      state.workForDetail = data
      state.workDetailLoader = false
    }, response => {
    	state.workDetailLoader = false
      return toastr.error('Ошибка сервера')
    })
	},
	selorderDelOneDetailInfo: (state, payload) => {
    state.infoAboutDetail.splice(payload.index, 1)
	},
	selorderDelWorkInfo: (state, payload) => {
		state.getInfoAboutWork.splice(payload.index, 1)
	},
	selorderSendNewPart: (state, payload) => {
		if(state.infoAboutDetail.length != 0) {
	    let partsId = []
	    state.updateDetail = true
	    jQuery.each(state.infoAboutDetail, function(index, value) {
	      partsId.push(value.Id)
	    })
	    Vue.http.post(`${host.host}/Order/${state.selectedOrderId}/Part`, partsId[payload.id], {
	    	headers: {
	    		'Authorization': 'Bearer ' + state.token,
	    		'Content-Type' : 'application/json; charset=UTF-8',
	    		'Accept' : 'application/json'
	    	}
	    }).then(response => {
	    	if(response.data.error) {
	    		if(response.body.message == "Logistic part for current car not found") toastr.info('В данный момент детали нет в продаже')
	    		else toastr.error('Ошибка при добавлении детали') 
	    		return state.updateDetail = false
	      }
	    	if(state.partId == partsId.length-1) {
	    		let data = JSON.parse(response.data.model)
	    		state.updateDetail = false
			  	state.vehid = data.UserCarModel.VehicleId
	        state.orders = []
	        state.orders = data
	        state.allDetail = []
	        state.workForDetail = []
	        state.infoAboutDetail = []
	        state.getInfoAboutWork = []
	        state.partId = 0
	        return toastr.success('Выбранные детали успешно добавлены!')
	    	} 
	    	state.partId++
	    	selorderSendNewPart(state.partId)
	    }, response => {
	    	toastr.error('Ошибка при добавлении детали')
	    	return state.updateDetail = false
	    })
    } else state.updateDetail = false
	},
  selorderSendYourComment: (state, payload) => {
    state.commentLoader = true
    let comment = '"'+payload.comment+'"'
    Vue.http.put(`${host.host}/Order/${state.selectedOrderId}/Comment/`, comment, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.body.error == true) {
        state.commentLoader = false
        return toastr.error('Ошибка сервера')
      }
      state.commentLoader = false
      let data = JSON.parse(response.data.model)
      state.vehid = data.UserCarModel.VehicleId
      state.orders = data
      state.yourcomment = ''
      return toastr.success('Комментарий успешно отправлен!')
    }, response => {
      state.commentLoader = false
      return toastr.error('Ошибка сервера')
    })
  },
  selorderSelectSto: (state) => {
    state.stoLoader = true
    Vue.http.get(`${host.host}/Sto/`, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.body.error == true) {
        state.stoLoader = false
        return toastr.error('Ошибка сервера')
      }
      state.stoLoader = false
      state.stoSelList = []
      let data = JSON.parse(response.data.model)
      if(data.length != 0) {
        for(let i=0;i<data.length;i++) {
          if(data[i].PositionModel != null && data[i].Address != null && data[i].Name != null) {
            state.stoSelList.push({
              position: {
                lat: data[i].PositionModel.Lat,
                lng: data[i].PositionModel.Lng
              },
              stoModel: data[i]
            })
          }
        }
      }
      return state.stoList = data
    }, response => {
      state.stoLoader = false
      return toastr.error('Ошибка сервера')
    })
  },
  selorderStoSelect: (state, payload) => {
    state.selSto = payload.id
  },
  selorderNewStoSelect: (state, payload) => {
    state.orderAction = true
    Vue.http.put(`${host.host}/Order/${state.selectedOrderId}/Station/${payload.id}`, { }, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.body.error == true) {
        state.orderAction = false
        return toastr.error('Ошибка сервера')
      }
      state.orderAction = false
      let data = JSON.parse(response.data.model)
      state.vehid = data.UserCarModel.VehicleId
      state.orders = []
      state.orders = data
      state.selSto = ''
      return toastr.success('СТО успешно выбрана!')
    }, response => {
      state.orderAction = false
      return toastr.error('Ошибка сервера')
    })
  },
  selorderGoRawOrder: (state) => {
    state.orderAction = true
    Vue.http.put(`${host.host}/Order/${state.selectedOrderId}/ToRaw/`, { }, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.body.error == true) {
        state.orderAction = false
        return toastr.error('Ошибка сервера')
      }
      state.orderAction = false
      let data = JSON.parse(response.data.model)
      state.vehid = data.UserCarModel.VehicleId
      state.orders = []
      state.orders = data
      state.loader = false
      return toastr.success('Заказ перенесен в черновик!')
    }, response => {
      state.orderAction = false
      return toastr.error('Ошибка сервера')
    })
  },
  selorderShowNewMilage: (state) => {
    state.millage = ''
    state.changeMilage = !state.changeMilage
  },
  selorderСhangeMillage: (state, payload) => {
    state.millageLoader = true
    let userCarId = state.orders.UserCarModel.Id
    let newMillage = payload.newMileage
    if(state.orders.UserCarModel.Mileage == newMillage) {
      state.millageLoader = false
      return toastr.error('Введите новое значение')
    }
    if(newMillage < 0) {
      state.millageLoader = false
      return toastr.error('Введите положительное значение')
    }
    Vue.http.put(`${host.host}/Garage/${userCarId}/Millage`, newMillage, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      let data = JSON.parse(response.data.model)
      if(response.body.error == true) {
        state.millageLoader = false
        return toastr.error('Ошибка сервера')
      }
      if(data == null) {
        state.orders.UserCarModel.Mileage = newMillage
        state.millageLoader = false
        state.changeMilage = false
        state.millage =  ''
        return toastr.success('Данные о пробеге обновлены!')
      }
    }, response => {
      return toastr.error('Ошибка сервера')
    })
  },
  selorderSendNewLabor: (state, payload) => {
    if(state.infoAboutDetail.length != 0 && state.getInfoAboutWork.length == 0) return sendNewPart(0)
    if(state.infoAboutDetail.length != 0) state.updateDetail = true
    if(state.getInfoAboutWork.length != 0) {
      let laborsId = []
      state.updateWork = true
      jQuery.each(state.getInfoAboutWork, function(index, value) {
        laborsId.push(value.Id)
      })
      Vue.http.post(`${host.host}/Order/${state.selectedOrderId}/Labors/${state.orders.UserCarModel.Id}`, laborsId, {
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.data.error) {
          state.updateWork = false
          return toastr.error('Ошибка при добавлении работы')
        }
        let data = JSON.parse(response.data.model)
          state.updateWork = false
          state.vehid = data.UserCarModel.VehicleId
          state.orders = []
          state.orders = data
          state.allDetail = []
          state.workForDetail = []
          state.infoAboutDetail = []
          state.getInfoAboutWork = []
          state.laborId = ''
          sendNewPart()
          return toastr.success('Работы добавлены!')
      }, response => {
        state.updateWork = false
        return toastr.error('Ошибка при добавлении детали (#C1)')
      })
    }
  },
  selorderDelWork: (state, payload) => {
    let laborsId = []
    laborsId.push(payload.id)
    state.updateWork = true
    Vue.http.put(`${host.host}/Order/${state.selectedOrderId}/Labors`, {
      'lpIds': laborsId,
      'listTypicalLabors': []
    }, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.body.error == true) {
        state.updateWork = false
        return toastr.error('Ошибка сервера')
      }
      state.updateWork = false
      state.orders.OrderLaborModel.splice(payload.index, 1)
      let data = JSON.parse(response.data.model)
      state.vehid = data.UserCarModel.VehicleId
      state.orders = []
      state.orders = data
      return toastr.success('Работа удалена!')
    }, response => {
      state.updateWork = false
      return toastr.error('Ошибка сервера')
    })
  }
}

function checkPaymentOrder() {
  if(state.sberId == undefined) {
    return state.loader = false
  }
  Vue.http.put(`${host.host}/Payments/Check`, {
    'orderIdSberbank': state.sberId
  }, {
    headers: {
      'Authorization': 'Bearer ' + state.token,
      'Content-Type' : 'application/json; charset=UTF-8',
      'Accept' : 'application/json'
    }
  }).then(response => {
    state.loader = false
    let data = JSON.parse(response.data.model)
    if(data == 'Success!') {
      state.orders.IsPay = true
      $(document).ready(function() {
        $('#successPayment').modal('show');
    })
    }
  }, response => {
    state.loader = false
  })
}

function checkTime(i) {
  if (i < 10) i = "0" + i
  return i
}

function getTheDate(getDate) {
  let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  let theCDate = new Date(getDate)
  return theCDate.getFullYear()+'-'+months[theCDate.getMonth()]+'-'+checkTime(theCDate.getDate())
}

function sendNewLabor(id) {
  if(state.infoAboutDetail.length != 0 && state.getInfoAboutWork.length == 0) return sendNewPart()
    if(state.infoAboutDetail.length != 0) state.updateDetail = true
    if(state.getInfoAboutWork.length != 0) {
      let laborsId = []
      state.updateWork = true
      jQuery.each(state.getInfoAboutWork, function(index, value) {
        laborsId.push(value.Id)
      })
      Vue.http.post(`${host.host}/Order/${state.selectedOrderId}/Labor/${state.orders.UserCarModel.Id}`, state.getInfoAboutWork[state.laborId].Id, {
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.data.error) {
          state.updateWork = false
          return toastr.error('Ошибка при добавлении работы')
        }
        let data = JSON.parse(response.data.model)
        if(state.laborId == laborsId.length-1) {
          state.updateWork = false
          state.vehid = data.UserCarModel.VehicleId
          state.orders = []
          state.orders = data
          state.allDetail = []
          state.workForDetail = []
          state.infoAboutDetail = []
          state.getInfoAboutWork = []
          state.laborId = ''
          sendNewPart()
          return toastr.success('Работы добавлены!')
        } 
        state.laborId++
        sendNewLabor(state.laborId)
      }, response => {
        state.updateWork = false
        return toastr.error('Ошибка при добавлении детали')
      })
    }
}

function sendNewPart() {
  if(state.infoAboutDetail.length != 0) {
    let partsId = []
    state.updateDetail = true
    jQuery.each(state.infoAboutDetail, function(index, value) {
      partsId.push(value.Id)
    })
    Vue.http.post(`${host.host}/Order/${state.selectedOrderId}/Parts`, partsId, {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type' : 'application/json; charset=UTF-8',
        'Accept' : 'application/json'
      }
    }).then(response => {
      if(response.data.error) {
        if(response.body.message == "Logistic part for current car not found") toastr.info('В данный момент детали нет в продаже')
        else toastr.error('Ошибка при добавлении детали') 
        return state.updateDetail = false
      }
        let data = JSON.parse(response.data.model)
        state.updateDetail = false
        state.vehid = data.UserCarModel.VehicleId
        state.orders = []
        state.orders = data
        state.allDetail = []
        state.workForDetail = []
        state.infoAboutDetail = []
        state.getInfoAboutWork = []
        state.partId = 0
        state.infoAboutDetail = []
        state.getInfoAboutWork = []
        return toastr.success('Выбранные детали успешно добавлены!')
    }, response => {
      toastr.error('Ошибка при добавлении детали')
      return state.updateDetail = false
    })
  } else state.updateDetail = false
}

function parseUnixDateTime(dt) {
  return String(dt).split('.')[0]
}

function selorderGetOrderById() {
  Vue.http.get(`${host.host}/Garage/${state.orders.UserCarModel.Id}/Tree`, {
    headers: {
      'Authorization': 'Bearer ' + state.token,
      'Content-Type' : 'application/json; charset=UTF-8',
      'Accept' : 'application/json'
    }
  }).then(response => {
    if(response.body.error == true) return toastr.error('Ошибка сервера')
    let data = JSON.parse(response.data.model)
    if(data == '' && state.popupCloseStatus == 0) setTimeout(selorderGetOrderById, 1000)
    state.trees = data
  }, response => {
    return toastr.error('Ошибка сервера')
  })
}