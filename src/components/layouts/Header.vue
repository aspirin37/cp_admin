<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
    <a class="navbar-brand" href="#">CarPort: {{ userTypes[userType] }}</a>

    <div class="navbar_clock">
      <i class="fa fa-clock-o" aria-hidden="true"></i>
      <Clock :blink="true" />
      <small style="margin-left: 20px">Сессия истекает: {{ sessionExpires | formatDate }}</small>
    </div>

    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav sidenav-toggler">
        <li class="nav-item">
          <a class="nav-link text-center" id="sidenavToggler" @click="toggleBodyState">
            <i class="fa fa-fw fa-angle-left"></i>
          </a>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
        <span v-if="host.host == host.devhost" style="color:yellow;margin-right:30px;margin-top:8px;left:0" class="pull-right"> dev version</span>

        <li class="nav-item">
          <a class="nav-link" onclick="localStorage.clear();window.location='/';">
            <i class="fa fa-fw fa-sign-out"></i>Выход
          </a>
        </li>
  
      </ul>
      <ul class="navbar-nav navbar-sidenav">
        <router-link v-if="(IsChief && li.forChief) || (IsChief && !li.forChief) || (!IsChief && !li.forChief)" tag="li" :to="{ path: li.path }" v-for="(li,index) in menu[userType]" :key="index" class="nav-item" data-placement="right" title="" exaxt active-class="active">
          <a class="nav-link">
            <i class="fa fa-fw" :class='li.icon'></i>
            <span class="nav-link-text">{{ li.name }}</span>
            <span class="badge badge-pill badge-danger" style="margin-left:25px" v-if="li.path === '/notifications' && notifications !== 0">{{ notifications }}</span>
            <span class="badge badge-pill badge-danger" style="margin-left:25px" v-if="li.path === '/client-orders' && clientSupportNotifications !== 0">{{ clientSupportNotifications }}</span>
          </a>
        </router-link>
      </ul>
    </div>
  </nav>
</template>

<script>
  import host from '../../data/host.js'
  import Clock from 'vue-digital-clock'
  // import leftMenu from './Menu'
  export default {
    name: 'Header',
    components: {
      // leftMenu,
      Clock
    },
    data() {
      return {
        userTypes: ['', '', '', 'Администратор', 'Логист', 'Экспедитор', 'Бухгалтер', 'Снабжение', 'Менеджер', 'Тех. поддержка', 'Клиент. поддержка', '', 'Разработчик'],
        userType: localStorage.getItem('userType'),
        IsChief: localStorage.getItem('IsChief')=='true'?true:false,
        sessionExpires: localStorage.getItem('expires'),
        host: host,
        title: '',
        menu: ['', '', '', 

          // Администратор 3

          [{
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Пользователи',
            path: '/users',
            icon: 'fa-users',
            forChief: false
          }, {
            name: 'Сотрудники',
            path: '/staff',
            icon: 'fa-users',
            forChief: false
          }, {
            name: 'Регистрация',
            path: '/reg',
            icon: 'fa-user-plus',
            forChief: false
          }, {
            name: 'Логи',
            path: '/system-logs',
            icon: 'fa-list',
            forChief: false
          }, {
            name: 'Станции',
            path: '/sto',
            icon: 'fa-wrench',
            forChief: false
          }, {
            name: 'Статистика',
            path: '/statistics',
            icon: 'fa-bar-chart',
            forChief: false
          }, {
            name: 'Конфигурация',
            path: '/configuration',
            icon: 'fa-cog',
            forChief: false
          }, {
            name: 'Логотипы',
            path: '/logos',
            icon: 'fa-image',
            forChief: false
          }, {
            name: 'Балансы',
            path: '/balances',
            icon: 'fa-money',
            forChief: false
          }], 

          // Логист 4

          [{
            name: 'Статистика',
            path: '/stats',
            icon: 'fa-bar-chart',
            forChief: false
          },{
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Какие-то еще',
            path: '/kakie',
            icon: 'fa-question',
            forChief: false
          }, {
            name: 'Ссылки',
            path: '/ssilki',
            icon: 'fa-question',
            forChief: false
          }],

          // Экспедитор 5

          [{
            name: 'Статистика',
            path: '/stat',
            icon: 'fa-bar-chart',
            forChief: false
          },{
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Какие-то еще',
            path: '/kakie',
            icon: 'fa-question',
            forChief: false
          }, {
            name: 'Ссылки',
            path: '/ssilki',
            icon: 'fa-question',
            forChief: false
          }],

          // Бухгалтер 6

          [{
            name: 'Балансы',
            path: '/balances',
            icon: 'fa-money',
            forChief: false
          },{
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Статистика',
            path: '/stats',
            icon: 'fa-bar-chart',
            forChief: false
          }],

          // Снабжение 7

          [{
            name: 'Закупка',
            path: '/purchase',
            icon: 'fa-money',
            forChief: false
          }, {
            name: 'Бренды запчастей',
            path: '/brand',
            icon: 'fa-cog',
            forChief: false
          }, {
            name: 'Поставщики',
            path: '/traders',
            icon: 'fa-truck',
            forChief: false
          }, {
            name: 'Регистрация',
            path: '/reg',
            icon: 'fa-registered',
            forChief: true
          }, {
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Балансы',
            path: '/balances',
            icon: 'fa-money',
            forChief: false
          }],

          // Менеджер 8

          [{
            name: 'Ордера',
            path: '/notifications',
            icon: 'fa-list',
            forChief: false
          }, {
            name: 'Заявки',
            path: '/requests',
            icon: 'fa-envelope',
            forChief: true
          }, {
            name: 'СТО',
            path: '/sto',
            icon: 'fa-wrench',
            forChief: false
          }, {
            name: 'Сотрудники',
            path: '/staff',
            icon: 'fa-users',
            forChief: true
          }, {
            name: 'Регистрация',
            path: '/reg',
            icon: 'fa-user-plus',
            forChief: true
          }, {
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Статистика',
            path: '/statistics',
            icon: 'fa-bar-chart',
            forChief: true
          }],

          // Тех. поддержка 9

          [{
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Статистика',
            path: '/stats',
            icon: 'fa-bar-chart',
            forChief: false
          }, {
            name: 'Автомобили',
            path: '/cars',
            icon: 'fa-car',
            forChief: false
          }, {
            name: 'Каталог',
            path: '/support-catalog',
            icon: 'fa-table',
            forChief: false
          }, {
            name: 'Каталог расходов топлива',
            path: '/fuel',
            icon: 'fa-fire',
            forChief: false
          }, {
            name: 'VIN каталоги',
            path: '/vin-catalogs',
            icon: 'fa-list',
            forChief: false
          }],

          // Клиент. поддержка 10

          [{
            name: 'Ордера',
            path: '/client-orders',
            icon: 'fa-list',
            forChief: false
          }, {
            name: 'Чат',
            path: '/chat',
            icon: 'fa-comments',
            forChief: false
          }, {
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Регистрация',
            path: '/reg',
            icon: 'fa-user-plus',
            forChief: false
          }, {
            name: 'Статистика',
            path: '/stats',
            icon: 'fa-bar-chart',
            forChief: false
          }, {
            name: 'Быстрые заказы',
            path: '/fastorders',
            icon: 'fa-money',
            forChief: false
          }],

          // 11

          [{
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Статистика',
            path: '/stats',
            icon: 'fa-bar-chart',
            forChief: false
          }],

          // Разработчик 12

          [{
            name: 'Логи',
            path: '/system-logs',
            icon: 'fa-list',
            forChief: false
          }, {
            name: 'Профиль',
            path: '/user-profile',
            icon: 'fa-user',
            forChief: false
          }, {
            name: 'Сотрудники',
            path: '/staff',
            icon: 'fa-users',
            forChief: true
          }, {
            name: 'Регистрация',
            path: '/reg',
            icon: 'fa-user-plus',
            forChief: true
          }, {
            name: 'Статистика',
            path: '/statistics',
            icon: 'fa-bar-chart',
            forChief: false
          }]
        ]
      }
    },
    computed: {
      notifications () {
        return this.$store.state.notifications.notificationsNumber
      },
      clientSupportNotifications () {
        return this.$store.state.notifications.clientSupportNotificationsNumber
      }
    },
    watch: {
      notifications: function () {
        if (this.userType == 8) {
          this.$store.commit('updateNotificationsNumber', this.notifications)
          this.notifications ? 
          document.querySelector("link[rel='shortcut icon']").href = "/static/faviconotif.png" : 
          document.querySelector("link[rel='shortcut icon']").href = "/static/favicon.png"
        }
      },
      clientSupportNotifications: function () {
        if (this.userType == 10) {
          this.$store.commit('updateClientSupportNotificationsNumber', this.clientSupportNotifications)
          this.clientSupportNotifications ? 
          document.querySelector("link[rel='shortcut icon']").href = "/static/faviconotif.png" : 
          document.querySelector("link[rel='shortcut icon']").href = "/static/favicon.png"
        }
      }
    },
    methods: {
      updateNotifications () {

        let updateNotificationsUrl
        let updateNotificationsCommit

        switch (this.userType) {
          case 3:
            updateNotificationsUrl = `${host.host}/Admin/ClientSupport/Orders`
            updateNotificationsCommit = 'updateClientSupportNotificationsNumber'
            break
          default: 
            updateNotificationsUrl = `${host.host}/Sto/Orders`
            updateNotificationsCommit = 'updateNotificationsNumber'
            break
        }

        this.$http.get(updateNotificationsUrl, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.loader = false
          if(response.body.error == true) return toastr.error('Ошибка сервера')
          let data = JSON.parse(response.body.model).reverse()
          let notifications = 0
          data.forEach( function (it) {
            if (!it.IsRead) notifications++
          })
          this.$store.commit(updateNotificationsCommit, notifications)
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      toggleBodyState () {
        $("body").toggleClass("sidenav-toggled")
      }
    },
    created() {
      if (this.userType == 8 || this.userType == 10) this.updateNotifications()
    }
  }
</script>

<style scoped src="../../assets/admin.css">
  
</style>

<style scoped>
  .container-fluid {
    margin-top: 55px;
  }

  .navbar_clock { 
    color: #fff; 
    font-size: 20px; 
    margin-left: 20px; 
    white-space: nowrap;
    font-family: Arial, sans-serif;
  }
</style>

