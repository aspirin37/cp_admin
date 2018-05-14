<template>
  <div class="Cars">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Бренды запчастей'" :icon="'fa fa-cog'"></Breadcrumb>
          
          <div class="row">
            
          </div>
        </div>
      </div>
    </div>
    <editModal :carModel='carModel'></editModal>
  </div>
</template>

<script>
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import host from '../data/host.js'
export default {
  name: 'Cars',
  components: {
    headers,
    Breadcrumb
  },
  data() {
    return {
      title: 'Бренды запчастей',
      token: localStorage.getItem('token'),
      loader: false,
      userId: ''
    }
  },
  methods: {
    
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
  .block
    display: block
</style>
