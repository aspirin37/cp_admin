<template>
	<div class="panel panel-default">
    <div class="panel-heading" data-toggle="collapse" href="#aboutCar">
      <a class="pull-right">
        <i class="fa fa-bars"></i>
      </a>
      <h4 class="panel-title">Автомобиль</h4>
    </div>
    <div id="aboutCar" class="panel-collapse collapse">
      <div class="panel-body" style="line-height: 24px;">
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
    </div>
  </div>
</template>

<script>
export default {
	name: 'about-car',
	props: ['carInfo']
}
</script>

<style scoped>
	i {
		color: #333;
	}
</style>