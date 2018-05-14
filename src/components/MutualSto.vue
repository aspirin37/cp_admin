<template>
  <div class="MutualSto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Взаиморасчеты / СТО'" :icon="'fa fa-fw fa-wrench'"></Breadcrumb>
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
  name: 'MutualSto',
  components: {
    headers,
    Breadcrumb
  },
  data() {
      return {
          title: 'СТО'
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