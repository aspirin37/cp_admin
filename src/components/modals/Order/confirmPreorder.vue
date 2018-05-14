<template>
	<div class="modal fade" id="confirmDelPreOrderModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Подтверждение</h4>
        </div>
        <div class="modal-body">
          Вы уверены, что хотите удалить предзаказ?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-success pull-left" data-dismiss="modal" @click="delPreOrder">Подтвердить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'confirmModal',
	methods: {
		delPreOrder() {
			this.$parent.$emit('delPreOrder')
		}
	}
}
</script>

<style scoped>
	.modal-dialog {
		width: 400px;
	}
</style>