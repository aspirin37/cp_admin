<template>
  <div id="editCarTech" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Редактировать {{ carModel.Make }} {{ carModel.Model }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col-md-12"><b>Расход топлива</b></div>
              <div class="col-md-4">
                <div class="input-group">
                  <input v-model="inCity" type="text" class="form-control" placeholder="В городе">
                  <span class="input-group-addon" id="basic-addon2">л/100км</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <input v-model="inRoute" type="text" class="form-control" placeholder="На трассе">
                  <span class="input-group-addon" id="basic-addon2">л/100км</span>
                </div>
              </div>
              <div class="col-md-2"><button @click="editFuel" class="btn btn-success" type="button">Сохранить</button></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../../data/host.js'

export default {
  name: 'editCarTech',
  props: ['carModel'],
  data() {
    return {
      inCity: '',
      inRoute: '',
      loader: false
    }
  },
  methods: {
    editFuel() {
      this.loader = true
      this.$http.get(`${host.host}/TehSup/EditFuel?UserCarId=${this.carModel.Id}&FuelCity=${this.inCity}&FuelRoute=${this.inRoute}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.body.error) return toastr.error('Ошибка сервера!')
        this.loader = false
        this.inCity = ''
        this.inroute = ''
        let data = JSON.parse(response.body.model)
        this.cars = data
        toastr.success('Успешно изменено')
      }, response => {
        toastr.error('Ошибка сервера!')
      })
    }
  },
  created() {
    
  }
}
</script>

<style scoped>
  
</style>