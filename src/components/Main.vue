<template>
  <div class="fixed-nav " id="page-top">
   
     <headers></headers>

    <div class="content-wrapper py-3">


      <div class="container-fluid">
        <Breadcrumb :title="'Главная'" :icon="'fa fa-fw fa-comments'"></Breadcrumb>

        <!-- Icon Cards -->
        <div class="row">
          <div class="loader">
            <img src="../assets/load.svg" alt="" width="40" v-if="loader">
          </div>
          <Tickets :tickets="tickets" v-if="!loader"></Tickets>
          <div class="openTickLoader">
            <img src="../assets/load.svg" alt="" width="40" v-if="openTickLoader">
          </div>
          <Ticket :activeTickets="activeTickets" :sendMessLoader="sendMessLoader" v-if="!loader && !openTickLoader"></Ticket>
          
        </div>

        <div class="row">

          <div class="col-lg-12">
          </div>
        </div>

      </div>

    </div>
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fa fa-angle-up"></i>
    </a>
  </div>
</template>

<script>
import host from '../data/host.js'
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import Tickets from './layouts/tickets/tickets'
import Ticket from './layouts/tickets/ticket'
export default {
  name: 'main',
  components: {
    headers,
    Breadcrumb,
    Tickets,
    Ticket
  },
  data() {
      return {
          loader: false,
          openTickLoader: false,
          sendMessLoader: false,
          activeTickets: [],
          messageText: "",
          title: 'Главная',
          tickets:[],
          token: localStorage.getItem('token')
      }
  },
  methods: {
    getTickets() {
      this.loader = true
      this.$http.get(`${host.host}/Ticket`, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
        }).then(response => {
          this.loader = false
          let data = response.body
          if(response.status == 200) this.tickets = data.reverse()
          
        }, response => {

      })
    },
    openTickes(id) {
      this.openTickLoader = true
      this.$http.get(`${host.host}/Ticket/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
          this.openTickLoader = false
          let data = response.body
          if(response.status == 200) this.activeTickets = data
          
        }, response => {

      })
    },
    sendMessage(id, messageText) {
      this.sendMessLoader = true
      this.$http.put(`${host.host}/Ticket/${id}/Comment`, '"'+messageText+'"', {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
        }).then(response => {
          this.sendMessLoader = false
          let data = response.body
          if (response.status == 200) this.activeTickets = data
          
            }, response => {
            
            })
    },
    newTicket(partition, newMessageText) {
      $("#newTicket").modal('hide');
      this.loader = true
      this.$http.post(`${host.host}/Ticket?partition=${partition}&msg=${newMessageText}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
        }).then(response => {
          this.loader = false
          let data = response.body
          if(response.status == 200) this.activeTickets = data
          
        }, response => {
          
      })
    },
    closeTicket(id, closeText) {
      $("#closeTicket").modal('hide');
      this.$http.put(`${host.host}/Ticket/${id}/Close`, '"'+closeText+'"', {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
        }).then(response => {
          let data = response.body
          if(response.status == 200) this.activeTickets = data
          
        }, response => {

      })
    },
    deleteMessage(index, id, messageId) {
      this.$http.delete(`${host.host}/Ticket/${id}/Comment/${messageId}`, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
        }).then(response => {
          let data = response.body
          if(response.status == 200) this.activeTickets = data
        }, response => {

      })
    }
  },
  mounted() {
    this.$on('openTickes', function(id) {
      this.openTickes(id)
    }),
    this.$on('sendMessage', function(id, messageText) {
      this.sendMessage(id, messageText)
    }),
    this.$on('closeTicket', function(id, closeText) {
      this.closeTicket(id, closeText)
    }),
    this.$on('deleteMessage', function(index, id, messageId) {
      this.deleteMessage(index, id, messageId)
    }),
    this.$on('newTicket', function(partition, newMessageText) {
      this.newTicket(partition, newMessageText)
    })
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title,
    this.getTickets()
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px

  .chat
    overflow-y: auto
    max-height: 200px

  .loader
    width: 100%
    text-align: center

  .openTickLoader
    margin: auto
    margin-top: 15px
</style>