<template>
  <div>
    <div class="order-log-panel">
      <div class="panel">
        <div class="panel-heading">
          <h3 class="panel-title pull-left">История изменения заказа</h3>
          <button 
            type="button"
            class="btn btn-sm btn-secondary float-right" 
            style="cursor: pointer" 
            @click="isShownOrderHistory = !isShownOrderHistory">
              {{ !isShownOrderHistory ? 'Показать' : 'Скрыть'}}
          </button>
          <div class="clearfix"></div>
        </div>
        <div v-if="isShownOrderHistory">
          <table class="table" v-if="orderHistory.length > 0">
            <thead>
              <tr>
                <th>Изменил</th>
                <th>Дата</th>
                <th>Изменение</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="change in orderHistory">
                <td width="297px">{{ change.Initiator == 0?change.UserFullName:change.Initiator == 1?'СТО':'-' }}</td>
                <td width="203px">{{ change.CreationTime | formatDate }}</td>
                <td>{{ change.MessageText }}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-center" style="margin-top: 10px;margin-bottom: 10px;" v-if="orderHistory.length === 0">
            <span>Нет записей</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-log-panel">
      <div class="panel panel-default">
        <div class="panel-heading alert-info">
          <h3 class="panel-title pull-left">Диалог с клиентской службой</h3>
          <button 
            type="button"
            class="btn btn-sm  btn-secondary float-right" 
            style="cursor: pointer" 
            @click="isShownClientDialog = !isShownClientDialog">
              {{ !isShownClientDialog ? 'Показать' : 'Скрыть'}}
          </button>
          <div class="clearfix"></div>
        </div>
        <div v-if="isShownClientDialog">
          <table class="table" v-if="orderClientDialogs.length > 0">
            <thead>
              <tr>
                <th>От кого</th>
                <th>Кому</th>
                <th>Дата</th>
                <th>Текст сообщения</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="change in orderClientDialogs">
                <td>{{ change.FromName }}<small>{{ ' (' + change.FromUserPrefix + ')' }}</small></td>
                <td>{{ change.ToName }} <small>{{ ' (' + change.ToUserPrefix + ')' }}</small></td>
                <td>{{ change.TimeSend }}</td>
                <td cols="4">{{ change.Message }}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-center" style="margin-top: 10px;margin-bottom: 10px;" v-if="orderClientDialogs.length === 0">
            <span>Нет сообщений</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-log-panel">
      <div class="panel panel-default">
        <div class="panel-heading alert-info">
          <h3 class="panel-title pull-left">Диалог с СТО</h3>
          <button 
            type="button"
            class="btn btn-sm btn-secondary float-right" 
            style="cursor: pointer" 
            @click="isShownStoDialog = !isShownStoDialog">
              {{ !isShownStoDialog ? 'Показать' : 'Скрыть'}}
          </button>
          <div class="clearfix"></div>
        </div>
        <div v-if="isShownStoDialog">
          <table class="table" v-if="orderStoDialogs.length > 0">
            <thead>
              <tr>
                <th>От кого</th>
                <th>Кому</th>
                <th>Дата</th>
                <th>Текст сообщения</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="change in orderStoDialogs">
                <td>{{ change.FromName }} <small>{{ ' (' + change.FromUserPrefix + ')' }}</small></td>
                <td>{{ change.ToName }} <small>{{ ' (' + change.ToUserPrefix + ')' }}</small></td>
                <td>{{ change.TimeSend }}</td>
                <td>{{ change.Message }}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-center" style="margin-top: 10px;margin-bottom: 10px;" v-if="orderStoDialogs.length === 0">
            <span>Нет сообщений</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- GET /Order/{oId}/History -->

<script>
import host from '../../../data/host.js'

export default {
  name: 'orderHistory',
  props: ['orderId'],
  data() {
    return {
      orderHistory: [],
      orderStoDialogs: [],
      orderClientDialogs: [],
      isShownOrderHistory: false,
      isShownStoDialog: false,
      isShownClientDialog: false
    }
  },
  methods: {
    getOrderHistory () {
      this.$http.get(`${host.host}/Order/${this.orderId}/History/Manager`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        function formatDateTime(date) {
          let formattedDate =  date.slice(5,7) + '.' + date.slice(8,10) + '.' + date.slice(2,4)
          let formattedTime = date.slice(11,13) + ':' + date.slice(14,16)
          let formattedDateTime = formattedDate + '\n в\u00A0' + formattedTime
          return formattedDateTime
        }

        let data = JSON.parse(response.body.model)
        this.orderHistory = data.Item1
        this.orderStoDialogs = data.Item2.sort((min, max) =>  (max.TimeSend < min.TimeSend ? -1 : ( max.TimeSend > min.TimeSend ? 1 : 0)))
        this.orderStoDialogs.forEach( function (it) {
          it.TimeSend = formatDateTime(it.TimeSend)
        })
        this.orderClientDialogs = data.Item3.sort((min, max) =>  (max.TimeSend < min.TimeSend ? -1 : ( max.TimeSend > min.TimeSend ? 1 : 0)))
        this.orderClientDialogs.forEach( function (it) {
          it.TimeSend = formatDateTime(it.TimeSend)
        })
      }, response => {
        return toastr.error('Не удалось получить историю изменений заказа')
      })
    },
  },
  created() {
    this.getOrderHistory()
  },
}
</script>

<style scoped>
  .panel-footer-delete {
    padding: 0;
    height: 60px;
  }
  .panel-footer-delete .btn-group {
    margin-top: 12px;
    margin-left: 15px;
  }
   .modalLink {
    cursor: pointer;
  }
  .modalLink:hover {
    background-color: #f5f5f5;
  }
</style>

<style lang="sass" scoped>
.panel 
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
  box-shadow: 0 1px 1px rgba(0,0,0,.05);

.panel-heading 
  color: #333;
  background-color: #f5f5f5;
  border-color: #ddd;
  padding: 0 15px;
  padding-right: 0
  padding-bottom: 7px
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;

.panel-heading h3 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: normal;
  width: 45%;
  padding-top: 8px;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 16px;
  color: inherit;
  
</style>