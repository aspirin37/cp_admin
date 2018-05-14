<template>
  <div class="Credit">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Введение данных / Кредит'"  :icon="'fa fa-credit-card'"></Breadcrumb>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import host from '../data/host.js'
export default {
  name: 'Credit',
  components: {
    headers,
    Breadcrumb
  },
  data() {
      return {
          title: 'Кредит'
      }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style>
