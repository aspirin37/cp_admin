<template>
  <div class="Credit">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <div class="alert alert-danger">
              <span class="fa fa-exclamation-circle"></span>
              <span>Страница не найдена!</span>
          </div>
          <router-link :to="{ path: '/' }">Перейти на главную</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../data/host.js'
import headers from './layouts/Header'

export default {
  name: 'NotFound',
  components: {
    headers
  },
  data() {
      return {
          title: '404 NotFound'
      }
  },
  created () {
      document.title = this.title
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style>
