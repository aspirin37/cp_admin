<template>
  <div class="MutualProviders">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Взаиморасчеты / Поставщики'" :icon="'fa fa-fw fa-truck'"></Breadcrumb>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../data/host.js'
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
export default {
  name: 'MutualProviders',
  components: {
    headers,
    Breadcrumb
  },
  data() {
      return {
          title: 'Поставщики'
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