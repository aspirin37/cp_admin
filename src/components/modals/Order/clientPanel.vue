<template>
  <div class="order-log-panel">
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title pull-left" style="margin-bottom: 10px">Информация о клиенте</h3>
        <div class="clearfix"></div>
      </div>
      <table class="table table-bordered table-responsive order-table">
        <thead>
          <tr>
            <th class="panel-th">Клиент</th>
            <th class="panel-th">Телефон</th>
            <th class="panel-th">Автомобиль</th>
            <th class="panel-th">VIN-номер</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="panel-td">  {{ userModel.FirstName }}<span v-if="userModel.LastName"> {{userModel.LastName}}</span></td>
            <td class="panel-td"> +{{ userModel.PhoneNumber }} </td>
            <td class="panel-td">  {{ carModel.Make + ' ' + carModel.Model + ' (' + carModel.Year + ')' }} </td>
            <td class="panel-td">  {{ carModel.Vin}} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import host from '../../../data/host.js'

export default {
  name: 'clientPanel',
  props: ['userModel', 'carModel'],
  data() {
    return {
      
    }
  }
}
</script>

<style lang="sass" scoped>
.panel 
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
  box-shadow: 0 1px 1px rgba(0,0,0,.05);

.panel-heading 
  color: #333;
  background-color: #f5f5f5;
  border-color: #ddd;
  padding: 0 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;

.panel-heading h3 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: normal;
  width: 45%;
  padding-top: 8px;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 16px;
  color: inherit;

.panel-th,
.panel-td 
  padding: 0.4rem 0.75rem

.order-table
  margin-bottom: 0
  
</style>