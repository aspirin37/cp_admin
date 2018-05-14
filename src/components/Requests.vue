<template>
  <div class="Staff">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb title="Заявки" :icon="'fa fa-fw fa-envelope'"></Breadcrumb>
          <div class="row">
            <div class="col-lg-12">

              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>

              <div class="alert alert-info" role="alert" v-if="!loader && !requests.length">
               <span class="fa fa-exclamation-circle"></span>
               <span>Нет данных!</span>
              </div>

              <label class="custom-control custom-checkbox cursor-pointer float-right" v-if="!loader && requests.length">
                <input type="checkbox" class="custom-control-input" v-model="isOpenedFilter">
                <span aria-hidden="true" class="custom-control-indicator"></span>
                Только открытые
              </label>

              <vue-good-table v-if="!loader && requests.length"
                :columns="columns"
                :rows="isOpenedFilter ? openedRequests : requests"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                :rowStyleClass="rowStyles"
                paginate="true"
                :styleClass="'table custom-table'">
                <template slot="table-row" slot-scope="props">
                  <td><a href="#" class="text-primary" @click.prevent="openRequest(props.row)">{{ props.row.id }}</a></td>
                  <td>{{ props.row.typeDesc }}</td>
                  <td>{{ props.row.date | formatDate }} </td>
                  <td>{{ props.row.name }}</td>
                  <td>{{ props.row.phone | formatPhone }}</td>
                  <td>{{ props.row.message | truncate(60) }}</td>
                  <td style="padding: 0; width: 50px">
                    <label class="custom-control custom-checkbox cursor-pointer" style="margin: 0 8px">
                      <input type="checkbox" class="custom-control-input" v-model="props.row.closed" @change="closeRequest(props.row.id, '')" :disabled="props.row.closed">
                      <span aria-hidden="true" class="custom-control-indicator"></span>
                    </label>
                  </td>
                </template>
              </vue-good-table>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="request-proposal" v-if="currentRequest">
      <div class="modal-dialog">
        <form class="modal-content" @submit.prevent="closeRequest(currentRequest.id, currentRequest.comment)">
          <div class="modal-body">
            <div class="list-group">
              <div class="list-group-item"><span class="text-primary">ID:</span> {{ currentRequest.id }}</div>
              <div class="list-group-item"><span class="text-primary">IP:</span> {{ currentRequest.ip }}</div>
              <div class="list-group-item"><span class="text-primary">Тип заявки:</span> {{ currentRequest.typeDesc }}</div>
              <div class="list-group-item"><span class="text-primary">Дата создания:</span> {{ currentRequest.date | formatDate }}</div>
              <div class="list-group-item"><span class="text-primary">Контактное лицо:</span> {{ currentRequest.name }}</div>
              <div class="list-group-item"><span class="text-primary">Номер телефона:</span> {{ currentRequest.phone | formatPhone }}</div>
              <div class="list-group-item"><span class="text-primary">Статус:</span> {{ currentRequest.closed ? 'Закрыта' : 'Открыта'}}</div>
              <div class="list-group-item" v-if="currentRequest.closed"><span class="text-primary">Когда:</span> {{ currentRequest.closeDate | formatDate }}</div>
              <div class="list-group-item" v-if="currentRequest.closed"><span class="text-primary">Кем:</span> {{ currentRequest.whoProcessed }}</div>
              <div class="list-group-item"><span class="text-primary">Сообщение:</span> {{ currentRequest.message }}</div>
              <div class="list-group-item" v-if="currentRequest.closed && currentRequest.comment"><span class="text-primary">Комментарий:</span> {{ currentRequest.comment }}</div>
              <textarea class="form-control" rows="4" style="resize: none;" placeholder="Оставить комментарий" v-model.trim="currentRequest.comment" v-if="!currentRequest.closed"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-if="currentRequest.closed">Закрыть</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-if="!currentRequest.closed">Отмена</button>
            <button type="submit" class="btn btn-success" v-if="!currentRequest.closed">Закрыть заявку</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../data/host.js'
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'

export default {
  name: 'Requests',
  components: {
    headers,
    Breadcrumb,
  },
  data() {
    return {
      title: 'Заявки',
      loader: false,
      isOpenedFilter: false,
      requests: [],
      currentRequest: '',
      columns: [{
        label: 'ID',
        field: 'id',
        thClass: 'th-class cursor-pointer text-left',
        type: 'number',
      }, {
        label: 'Тип заявки',
        field: 'typeDesc',
        thClass: 'th-class cursor-pointer',
        type: 'text',
      }, {
        label: 'Дата',
        field: 'date',
        thClass: 'th-class cursor-pointer text-left',
        type: 'date'
      }, {
        label: 'Контактное лицо',
        field: 'name',
        thClass: 'th-class cursor-pointer',
      }, {
        label: 'Номер телефона',
        field: 'phone',
        thClass: 'th-class'
      }, {
        label: 'Сообщение',
        field: 'message',
        thClass: 'th-class',
        sortable: false
      }, {
        label: '',
        field: '',
        thClass: 'th-class',
        sortable: false
      }]
    }
  },
  computed: {
    openedRequests () {
      return this.requests.filter((it) => !it.closed)
    }
  },
  methods: {
    getRequests () {
      this.loader = true
      this.$http.get(`${host.host}/Request/Proposal`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        this.requests = response.body
        this.requests.map((it) => {
          it.date = it.date.split('T')[0] + 'T' + it.time
          if (it.message == null) it.message = ''
        })
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    closeRequest (id, comment) {
      if (comment.length > 200) return toastr.error('Недопустимая длина комментария! (Макс. 200 символов)')
      this.$http.put(`${host.host}/Request/Proposal/Close?id=${id}&comment=${comment}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.requests.forEach((it) => {
          if (it.id == id) {
            it.closed = true
            it.comment = comment
          }
        })
        $('#request-proposal').modal('hide')
        toastr.success('Заявка закрыта!')
      }, response => {
        response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    openRequest (request) {
      this.currentRequest = request
      setTimeout(() => {
        $('#request-proposal').modal('show')
      }, 100)
    },
    rowStyles (row){ 
      return (!row.closed) ? 'bg-light' : ''
    },
  },
  created() {
    document.title = this.title
    this.getRequests()
  }
}
</script>

<style scoped src="../assets/admin.css">
  
</style>
