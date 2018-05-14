import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//Selected order module
import selorderState from './selorder/state'
import selorderMutation from './selorder/mutation'
import selorderAction from './selorder/action'

//Orders module
import ordersState from './orders/state'
import ordersGetters from './orders/getters'
import ordersMutation from './orders/mutation'
import ordersAction from './orders/action'

// import sortingState from './sorting/state'
// import sortingGetters from './sorting/getters'
// import sortingMutation from './sorting/mutation'
// import sortingAction from './sorting/action'

const selorderModule = {
  state: selorderState,
  mutations: selorderMutation,
  actions: selorderAction
}

const ordersModule = {
  state: ordersState,
  getters: ordersGetters,
  mutations: ordersMutation,
  actions: ordersAction
}

const notificationsModule = {
  state: {
    notificationsNumber: 0,
    clientSupportNotificationsNumber: 0
  },
  mutations: {
    updateNotificationsNumber (state, payload) {
      state.notificationsNumber = payload
    },
    updateClientSupportNotificationsNumber (state, payload) {
      state.clientSupportNotificationsNumber = payload
    }
  },
  // actions: {
  //   updateNotificationsNumber ({commit}, payload) {
  //     commit('updateNotificationsNumber', payload)
  //   }
  // }
}

export const store = new Vuex.Store({
  modules: {
    orders: ordersModule,
    selorder: selorderModule,
    notifications: notificationsModule
  }
})
