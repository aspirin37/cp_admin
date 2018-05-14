<template>
  <div class="modal" id="Redirect" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ошибка авторизации</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Пожалуйста, введите логин и пароль повторно</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary ml-auto mr-auto">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../../data/host.js'

export default {
  name: 'Redirect',
  data() {
    return {
      
    }
  }
}
</script>

<style scoped src="../../assets/admin.css">
  
</style>

<style scoped lang="sass">
  
</style>