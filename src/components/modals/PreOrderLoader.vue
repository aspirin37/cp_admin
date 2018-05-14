<template>
  <div id="createPreOrderLoader" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="loader text-center">
            <img src="../../assets/load.svg" alt="" width="40">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../../data/host.js'

export default {
  name: 'createPreOrderLoader',
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  created() {
    
  }
}
</script>

<style scoped>
  .input-group {
    margin-top: 5px
  }
</style>