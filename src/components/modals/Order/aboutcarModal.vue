<template>
	<div class="modal fade" id="aboutcarModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	        <h4 class="modal-title">Об автомобиле</h4>
	      </div>
	      <div class="modal-body">
	        <span>Марка: <b>{{ carInfo.UserCarModel.Make }}</b></span><br>
	        <span>Модель: <b>{{ carInfo.UserCarModel.Model }}</b></span><br>
	        <span>Двигатель
	          <b v-if="carInfo.UserCarModel.Engine != null && carInfo.UserCarModel.Engine != ''">{{ carInfo.UserCarModel.Engine }}</b>
	          <b v-else>Не указано</b>
	        </span><br>
	        <span>Коробка передач:
	          <b v-if="carInfo.UserCarModel.GearBox != null && carInfo.UserCarModel.GearBox != ''">{{ carInfo.UserCarModel.GearBox }}</b>
	          <b v-else>Не указано</b>
	        </span><br>
	        <span>Пробег: <b>{{ carInfo.Mileage }} км</b></span><br>
	        <span>Цвет: <b>{{ carInfo.CarColor }}</b></span><br>
	        <span>Гос. номер: <b>{{ carInfo.GosNum }}</b></span><br>
	        <span>VIN-номер:
	          <b v-if="carInfo.VIN != null">{{ carInfo.VIN }}</b>
	          <b v-else>Не указано</b>
	        </span>
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
	name: 'aboutcarModal',
	props: ['carInfo']
}
</script>