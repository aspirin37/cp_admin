<template>
  <div class="Cars">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Управление автомобилями'" :icon="'fa fa-car'"></Breadcrumb>
          <div class="row">
            <div class="col-lg-6">
              <div class="input-group">
                <input type="text" @keyup.enter="getCars" class="form-control" v-model="userId" placeholder="id пользователя" aria-label="id пользователя">
                <span class="input-group-btn">
                  <button class="btn btn-primary" :disabled="!userId" type="button" @click="getCars">Запросить автомобили</button>
                </span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6" v-for="(car, indexCar) in cars" :key="indexCar">
              <div class="card mt-3">
                <div class="card-header">
                  {{ car.Make }} {{ car.Model }}
                  <button class="btn btn-secondary btn-sm pull-right" type="button" @click="carModel=car" data-toggle="modal" data-target="#editCarTech">Редактировать</button>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-5 col-xs-7">
                      <span class="block text-muted">VIN:</span>
                    </div>
                    <div class="col-md-7 col-xs-5">
                      <span class="block">{{ car.Vin }}</span>
                    </div>
                    <div class="col-md-5 col-xs-5">
                      <span class="block text-muted">Гос. номер:</span>
                    </div>
                    <div class="col-md-7 col-xs-5">
                      <span class="block">{{ car.GosNum }}</span>
                    </div>
                    <div class="col-md-5 col-xs-7">
                      <span class="block text-muted">Цвет:</span>
                    </div>
                    <div class="col-md-7 col-xs-5">
                      <span class="block">{{ car.CarColor }}</span>
                    </div>
                    <div class="col-md-5 col-xs-7">
                      <span class="block text-muted">Год выпуска:</span>
                    </div>
                    <div class="col-md-7 col-xs-5">
                      <span class="block">{{ car.Year }}</span>
                    </div>
                    <div class="col-md-5 col-xs-7">
                      <span class="block text-muted">Пробег:</span>
                    </div>
                    <div class="col-md-7 col-xs-5">
                      <span class="block">{{ car.Mileage }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <pre>{{cars}}</pre>
        </div>
      </div>
    </div>
    <editModal :carModel='carModel'></editModal>
  </div>
</template>

<script>
import headers from './layouts/Header'
import Breadcrumb from './layouts/Breadcrumb'
import host from '../data/host.js'
import editModal from '@/components/modals/EditCarTech'
export default {
  name: 'Cars',
  components: {
    headers,
    Breadcrumb,
    editModal
  },
  data() {
    return {
      title: 'Управление автомобилями',
      token: localStorage.getItem('token'),
      loader: false,
      userId: '',
      cars: '',
      edit: 0,
      carModel: {}
    }
  },
  methods: {
    getCars() {
      if (!this.userId) return toastr.error('Введите Id пользователя!')
      this.loader = true
      this.$http.get(`${host.host}/Garage/${this.userId}/AllCarsUser`, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        this.loader = false
        let data = JSON.parse(response.body.model)
        this.cars = data
      }, response => {
        toastr.error('Ошибка сервера!')
      })
    }
  },
  created () {
    if (!localStorage.getItem('token')) return this.$router.push('/')
    document.title = this.title
  }
}
</script>

<style scoped src="../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
  .block
    display: block
</style>
