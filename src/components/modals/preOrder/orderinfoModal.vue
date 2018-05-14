<template>
	<div class="modal fade" id="orderinfoModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	        <h4 class="modal-title" id="myModalLabel">О предзаказе</h4>
	      </div>
	      <div class="modal-body">
	        <span v-if="preOrderInfo.PreOrderIsDiagnostics"><b>Диагностический предзаказ</b></span>
	        <br v-if="preOrderInfo.PreOrderIsDiagnostics"/>
	        <span>Номер предзаказа: <b>{{ id }}</b></span><br>
	        <span>Дата создания: <b>{{ createDate | formatDate}}</b></span>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-danger" data-dismiss="modal">Закрыть</button>
	      </div>
	    </div>
	  </div>
	</div>
</template>

<script>
export default {
	name: 'orderinfoModal',
	props: ['id', 'createDate', 'preOrderInfo']
}
</script>