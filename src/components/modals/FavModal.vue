<template>
	<div class="modal fade" id="newFavoriteModal">
	  <div class="modal-dialog" style="width: 95%">
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title" id="myModalLabel">Добавить новую деталь</h4>
	      	<button type="button" class="close" data-dismiss="modal">
	      		<span aria-hidden="true">&times;</span>
	      	</button>
	      </div>
	      <div class="modal-body">
	        <div class="form-group">
	        	<label>Название детали</label>
	        	<input type="text" placeholder="Введите название детали" class="form-control" v-model="newDetail.name">
	        </div>
	        <div class="form-group">
	        	<label>ОЕМ детали</label>
	        	<input type="text" placeholder="Введите ОЕМ детали" class="form-control" v-model="newDetail.oem">
	        </div>
	      </div>
	      <div class="modal-footer d-flex justify-content-between">
	      	<button type="button" class="btn btn-danger" data-dismiss="modal">Отмена</button>
	      	<button type="button" class="btn btn-success" @click="addNewDetail">
	      		<i class="fa fa-plus-circle"></i> Добавить
	      	</button>
	      </div>
	    </div>
	  </div>
	</div>
</template>

<script>
export default {
	name: 'FavModal',
	data() {
		return {
			newDetail: {
				name: '',
				oem: ''
			}
		}
	},
	methods: {
		addNewDetail() {
			if(this.newDetail.name == '' || this.newDetail.oem == '') {
				return toastr.error('Введите ОЕМ и название детали!');
			}
			$("#newFavoriteModal").modal('hide')
			this.$parent.$emit('addNewFavoriteDetails', {
				name: this.newDetail.name,
				oem: this.newDetail.oem
			})
			this.newDetail.name = ''
			this.newDetail.oem = ''
		}
	}
}
</script>