<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="sass">
  .cursor-pointer 
    cursor: pointer

  .notification
    background-color: rgba(119,136,153, 0.1)

  .th-class
    padding: 8px !important
    font-size: 14px !important
    line-height: 1.42857143 !important
    background-color: white !important
    border-bottom: 1px solid #ddd !important
    padding-top: 18px !important
    padding-bottom: 20px !important

  .th-width-limit
    width: 150px !important

  td
    border-top: 0 !important
    border-bottom: 1px solid #ddd !important

  .table-footer
    background-color: white !important
    border: 0 !important
</style>