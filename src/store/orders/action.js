export default {
	getAllActiveOrder: ({commit}) => {
    commit('getAllActiveOrder')
  },
  ordersGetGarage: ({commit}) => {
    commit('ordersGetGarage')
  },
  ordersDelOneDetailInfo: ({commit}, payload) => {
    commit('ordersDelOneDetailInfo', payload)
  },
  orderСlearFoundField: ({commit}) => {
    commit('orderСlearFoundField')
  },
  ordersSelectActiveAuto: ({commit}, payload) => {
    commit('ordersSelectActiveAuto', payload)
  }
}