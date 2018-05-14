<template>
	<div class="modal fade" id="selectCarForPreOrder">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          
          <h4 class="modal-title">Создание предзаказа</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">

          <div class="text-center" v-if="loader">
            <img src="../../assets/load.svg" alt="load gif" width="40">
          </div>

          <label v-if="!loader && carList.length != ''">Выберите машину для создания предзаказа</label>
          <div class="list-group" style="margin-top: 10px;margin-bottom: 0px;" v-if="!loader && carList.length != ''">
            <a class="list-group-item" v-for="car in carList"
              @click="selPreOrderCarId(car)"
              :class="{ active: selectCar == car }">
              <b>{{ car.Make }} {{ car.Model }}</b> <i>{{ car.GosNum }}</i>
            </a>
          </div>
          <div class="alert alert-info" v-if="!loader && carList.length == ''">
            <span class="fa fa-exclamation-circle"></span>
            <span>В вашем гараже отсутствуют автомобили</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger pull-left" data-dismiss="modal" :disabled="loader">Отмена</button>
          <button type="button" class="btn btn-success" :disabled="selectCar == '' || loader" @click="createPreOrder">Создать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'new-preorder',
	props: ['loader', 'carList', 'selectCar'],
	methods: {
		createPreOrder() {
			this.$parent.$emit('createPreOrder')
		},
		selPreOrderCarId(car) {
			this.$parent.$emit('selPreOrderCarId', car)
		}
	},
  watch: {
    carList: function(val) {
      console.log('vaaaal', val)
    }
  },
  created() {
    console.log('cl', this.carList)
  }
}
</script>