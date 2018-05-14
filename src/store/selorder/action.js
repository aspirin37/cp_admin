export default {
	selorderGetOrder: ({commit}) => {
    commit('selorderGetOrder')
	},
	selorderGetOrderById: ({commit}) => {
    commit('selorderGetOrderById')
	},
	selorderGetWorkForDetail: ({commit}, payload) => {
    commit('selorderGetWorkForDetail', payload)
	},
	selorderDelOneDetailInfo: ({commit}, payload) => {
    commit('selorderDelOneDetailInfo', payload)
	},
	selorderDelWorkInfo: ({commit}, payload) => {
    commit('selorderDelOneDetailInfo', payload)
	},
	selorderSendNewPart: ({commit}, payload) => {
    commit('selorderSendNewPart', payload)
	},
  selorderSendYourComment: ({commit}, payload) => {
    commit('selorderSendYourComment', payload)
  },
  selorderSelectSto: ({commit}) => {
    commit('selorderSelectSto')
  },
  selorderStoSelect: ({commit}, payload) => {
    commit('selorderStoSelect', payload)
  },
  selorderNewStoSelect: ({commit}, payload) => {
    commit('selorderNewStoSelect', payload)
  },
  selorderGoRawOrder: ({commit}) => {
    commit('selorderGoRawOrder')
  },
  selorderPasteCurTime: ({commit}) => {
    commit('selorderPasteCurTime')
  },
  selorderShowNewMilage: ({commit}) => {
    commit('selorderShowNewMilage')
  },
  selorderСhangeMillage: ({commit}, payload) => {
    commit('selorderСhangeMillage', payload)
  },
  selorderSendNewLabor: ({commit}, payload) => {
    commit('selorderSendNewLabor', payload)
  },
  selorderDelWork: ({commit}, payload) => {
    commit('selorderDelWork', payload)
  },
  selorderSelectTimeAndLine: ({commit}, payload) => {
    commit('selorderSelectTimeAndLine', payload)
  },
  ordersDelAllDetails: ({commit}, payload) => {
    commit('ordersDelAllDetails', payload)
  }
}