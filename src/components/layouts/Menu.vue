<template>
  <div class="collapse navbar-collapse" id="navbarResponsive">
    <ul class="navbar-nav navbar-sidenav" v-if="0">
      <router-link tag="li" :to="{ path: '/stats' }" class="nav-item" data-placement="right" title="" data-original-title="Статистика" exaxt active-class="active">
        <a class="nav-link">
          <i class="fa fa-fw fa-dashboard"></i>
          <span class="nav-link-text">
                      Статистика</span>
        </a>
      </router-link>
      <router-link tag="li" :to="{ path: '/transactions' }" class="nav-item" data-placement="right" title="" data-original-title="Транзакции" exaxt active-class="active">
        <a class="nav-link">
          <i class="fa fa-fw fa-bar-chart"></i>
          <span class="nav-link-text">
                      Транзакции</span>
        </a>
      </router-link>
      <li class="nav-item" data-placement="right" title="" data-original-title="Управление">
        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#manageMenu">
          <i class="fa fa-fw fa-wrench"></i>
          <span class="nav-link-text">
                      Управление</span>
        </a>
        <ul class="sidenav-second-level collapse" id="manageMenu">
          <router-link tag="li" :to="{ path: '/manage/payments' }" exaxt active-class="active"><a href="#">Платежи</a></router-link>
          <router-link tag="li" :to="{ path: '/manage/providers' }" exaxt active-class="active"><a href="#">Поставщики</a></router-link>
          <router-link tag="li" :to="{ path: '/manage/sto' }" exaxt active-class="active"><a href="#">СТО</a></router-link>
        </ul>
      </li>
      <li class="nav-item" data-placement="right" title="" data-original-title="Взаиморасчеты">
        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#paymentsMenu">
          <i class="fa fa-fw fa-money"></i>
          <span class="nav-link-text">Взаиморасчеты</span>
        </a>
        <ul class="sidenav-second-level collapse" id="paymentsMenu">
          <router-link tag="li" :to="{ path: '/clients' }" exaxt active-class="active"><a href="#">Клиенты</a></router-link>
          <router-link tag="li" :to="{ path: '/mutual_providers' }" exaxt active-class="active"><a href="#">Поставщики</a></router-link>
          <router-link tag="li" :to="{ path: '/mutual_sto' }" exaxt active-class="active"><a href="#">СТО</a></router-link>
        </ul>
      </li>
      <li class="nav-item" data-placement="right" title="" data-original-title="Введение данных">
        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#dataMenu">
          <i class="fa fa-fw fa-database"></i>
          <span class="nav-link-text">Введение данных</span>
        </a>
        <ul class="sidenav-second-level collapse" id="dataMenu">
          <router-link tag="li" :to="{ path: '/debet' }" exaxt active-class="active"><a href="#">Дебет</a></router-link>
          <router-link tag="li" :to="{ path: '/credit' }" exaxt active-class="active"><a href="#">Кредит</a></router-link>
        </ul>
      </li>
      <router-link tag="li" :to="{ path: '/tickets' }" class="nav-item" data-placement="right" title="" data-original-title="Диалоги" exaxt active-class="active">
        <a class="nav-link">
          <i class="fa fa-fw fa-comments"></i>
          <span class="nav-link-text">
                      Тикеты</span>
        </a>
      </router-link>
      <router-link tag="li" :to="{ path: '/chat' }" class="nav-item" data-placement="right" title="" data-original-title="Чат" exaxt active-class="active">
        <a class="nav-link">
          <i class="fa fa-fw fa-comments"></i>
          <span class="nav-link-text">
                      Чат</span>
        </a>
      </router-link>
    </ul>
    <ul class="navbar-nav sidenav-toggler">
      <li class="nav-item">
        <a class="nav-link text-center" id="sidenavToggler">
          <i class="fa fa-fw fa-angle-left"></i>
        </a>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
  
      <li class="nav-item">
        <a class="nav-link" onclick="localStorage.clear();window.location='/';">
          <i class="fa fa-fw fa-sign-out"></i>Выход
        </a>
      </li>
  
    </ul>
    <!-- <ul class="navbar-nav navbar-sidenav">
      <li v-for="li in menu" class="nav-item" data-placement="right" title="" exaxt active-class="active">
        <router-link class="nav-link" :to="{ path: li.path }" >
          <i class="fa fa-fw fa-bar-chart"></i>
          <span class="nav-link-text">{{ li.name }}</span>
        </router-link>
      </li>
    </ul> -->
    qwe {{ token }}
  </div>

</template>

<script>
import host from '../data/host.js'
  export default {
    name: 'leftMenu',
    props: ['menu'],
    data() {
      return {
        token: localStorage.getItem('token')
      }
    },
    methods: {
      logout() {
        return console.log(123)
        localStorage.removeItem('token')
        return this.$router.push('/')
      }
    },
    created() {
      console.log('qweqwe',this.menu)
    }
  }
</script>

<style scoped src="../../assets/admin.css">
  
</style>

<style scoped>
  .container-fluid {
    margin-top: 55px;
  }
</style>

<script src="../../assets/navbar.js">
  
</script>