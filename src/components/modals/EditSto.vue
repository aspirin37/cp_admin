<template>
  <div class="modal fade" id="editStoModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Редактировать СТО</h5>
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="container-fluid">

          <div class="text-center" style="margin-bottom: 20px;" v-if="getSpecStoLoader">
            <img src="../../assets/load.svg" alt="load gif" width="40">
          </div>

          <div class="alert alert-danger" v-if="!getSpecStoLoader && errorGetSepc">
            <span class="fa fa-exclamation-circle"></span>
            <span>Ошибка при получении специализаций СТО</span>
          </div>

          <div class="row" v-if="!getSpecStoLoader && !errorGetSepc">
            <div class="col-md-4">
              <ul class="list-group">
                <li class="list-group-item" @click="changeStep(1)" :class="{ active: newSto.step == 1 }">
                  Шаг 1: Данные
                </li>
                <li class="list-group-item" @click="changeStep(2)" :class="{ active: newSto.step == 2 }">
                  Шаг 2: Информация
                </li>
                <li class="list-group-item" @click="changeStep(3)" :class="{ active: newSto.step == 3 }">
                  Шаг 3: Линии
                </li>
                <li class="list-group-item" @click="changeStep(4)" :class="{ active: newSto.step == 4 }">
                  Шаг 4: Бренды
                </li>
              </ul>
            </div>
            <div class="col-md-8 col-md-offset-4" v-if="newSto.step == 1">
              <h4>Шаг 1: Данные СТО</h4>
              <hr />
              <form onsubmit="return false">

                <div class="form-group">
                  <label class="form-control-label">Номер телефона:</label>
                  <div class="input-group">
                    <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
                    <input class="form-control" name="phoneNumber" v-validate="{ rules: { regex: validateText} }" v-model="newSto.phoneNumber" placeholder="Номер телефона СТО">
                  </div>
                  <span v-show="errors.has('phoneNumber')">{{ errors.first('phoneNumber') }}</span>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Пароль:</label>
                  <div class="input-group">
                    <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
                    <input class="form-control" name="pass" v-validate="{ rules: { regex: validateText} }" v-model="newSto.password" placeholder="Пароль">
                  </div>
                  <span v-show="errors.has('pass')">{{ errors.first('pass') }}</span>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Контактное лицо:</label>
                  <div class="input-group">
                    <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
                    <input class="form-control" name="speaker" v-validate="{ rules: { regex: validateText} }" v-model="newSto.speaker" placeholder="Контактное лицо">
                  </div>
                  <span v-show="errors.has('speaker')">{{ errors.first('speaker') }}</span>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Email СТО:</label>
                  <div class="input-group">
                    <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
                    <input class="form-control" name="email" v-validate="'required|email'" v-model="newSto.email" placeholder="Email Вашего СТО">
                  </div>
                  <span v-show="errors.has('email')">{{ errors.first('email') }}</span>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Стоимость нормо-часа:</label>
                  <div class="input-group">
                    <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
                    <input class="form-control" v-validate="{ rules: { regex: NUM} }" name="stdcost" v-model.trim="newSto.stdCost" placeholder="Стоимость нормо-часа">
                    <div class="input-group-addon">руб.</div>
                  </div>
                  <span v-show="errors.has('stdcost')">{{ errors.first('stdcost') }}</span>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Процент дохода:</label>
                  <div class="input-group">
                    <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
                    <input class="form-control" type="number" min="0" max="100" name="profit" v-model="newSto.percent" placeholder="Процент дохода">
                    <div class="input-group-addon">%</div>
                  </div>
                  <!-- <span v-show="errors.has('profit')">{{ errors.first('profit') }}</span> -->
                  <!-- <vue-slider v-model="newSto.profit.value"></vue-slider>   -->
                </div>

                <div class="form-group" v-if="isChief">
                  <label class="form-control-label">Менеджер:</label>
                  <div class="input-group">
                    <div class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></div>
                    <v-select style="width:100%" v-model="newSto.selectedManager" :options="newSto.managers" placeholder="Выберите из списка"></v-select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Доп. информация:</label>
                  <textarea class="form-control" rows="4" name="comment" v-model="newSto.comment"></textarea>
                  <span v-show="errors.has('comment')">{{ errors.first('comment') }}</span>
                </div>

              </form>
            </div>

            <div v-if="newSto.step == 2" class="col-md-8 col-md-offset-4">
              <h4>Шаг 2: Информация об СТО</h4>
              <hr />

              <form onsubmit="return false">
  
                <div class="form-group">
                  <label class="form-control-label">Название СТО:</label>
                  <input v-show="0" class="form-control" name="namesto" v-validate="{ rules: { regex: validateText} }" v-model="newSto.name" placeholder="Название СТО">
                  <input class="form-control" name="namesto" v-validate="{ rules: { regex: validateText} }" v-model="newSto.name" placeholder="Название СТО">
                  <span v-show="errors.has('namesto')">{{ errors.first('namesto') }}</span>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Адрес СТО:</label>
                  <input class="form-control" name="addres" v-validate="{ rules: { regex: validateText} }" v-model="newSto.address" placeholder="Адрес Вашего СТО">
                  <span v-show="errors.has('addres')">{{ errors.first('addres') }}</span>
                </div>

                <label class="form-control-label">Время работы СТО:</label>
                <div class="form-row">
                  <div class="col-md-12">
                    <b-form-group>
                      <b-form-radio-group v-model="newSto.myWorkDays.selected" 
                                          id="myWorkDays" 
                                          name="myWorkDays" 
                                          :options="newSto.myWorkDays.options">
                      </b-form-radio-group>
                    </b-form-group>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col-md-12">
                      <p v-for="(day, index) in newSto.myWorkDays.options" :key="index" v-show="newSto.myWorkDays.selected === index">
                        <span style="width:110px" class="badge badge-info" v-bind:class="{ 'badge-danger': !day.isWorking }">{{ day.text }}</span>
                        <vue-timepicker v-model="day.start_time" :minute-interval="30" v-if="day.isWorking"></vue-timepicker>
                        <span v-if="day.isWorking"> до </span>
                        <vue-timepicker v-model="day.end_time" :minute-interval="30" v-if="day.isWorking"></vue-timepicker>
                        <span style="padding-left:5px">
                          <b-form-checkbox id="myWorkDaysStatus"
                            v-model="day.isWorking">
                              <span>Рабочий день</span>
                        </b-form-checkbox></span>
                      </p>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Местоположение СТО</label>
                  <gmap-map :center="newSto.mapDefault" :zoom="13" style="max-width: 800px; height: 300px" @click="mapRclicked">
                    <gmap-marker v-for="m in newSto.markers" :position="m.position" :clickable="true" :draggable="true" :key="m.id"></gmap-marker>
                  </gmap-map>
                </div>

                <div class="form-group">
                  <label class="form-control-label">Услуги для посетителей</label>
                  <v-select v-model="newSto.selectedPlushki" :options="newSto.plushki" multiple placeholder="Выберите из списка"></v-select>
                </div>

              </form>
            </div>

            <div v-if="newSto.step == 3" class="col-md-8 col-md-offset-4">
              <h4>Шаг 3: Линии СТО</h4>
              <hr />

              <form>
                <div class="form-group">
                  <label class="form-control-label">Выберите специализации</label>
                  <v-select v-model="newSto.selected" :options="newSto.spec" multiple placeholder="Выберите из списка"></v-select>
                </div>
              </form>

              <div class="alert alert-info" v-if="newSto.selected == ''">
                <span class="fa fa-exclamation-circle"></span>
                <span>Специализации не выбраны</span>
              </div>

              <div class="form-group row" v-else v-for="(lines, lineIndex) in newSto.linesModel" :key="lineIndex">
                <label class="col-sm-2 col-form-label">Линия {{ lineIndex+1 }}</label>
                <div class="col-sm-10 input-group">
                  <select class="form-control" v-model="lines.lineType">
                    <option value="" selected disabled>Выберите тип</option>
                    <option v-for="(spec, specIndex) in newSto.selected" :value="spec.value" :key="specIndex">{{ spec.label }}</option>
                  </select>
                  <div class="input-group-btn">
                    <button type="button" class="btn btn-danger" @click="removeLine(index)">
                      <i class="fa fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <button class="btn btn-secondary" @click="addNewLines">
                  <i class="fa fa-plus-circle"></i>
                  Добавить линию
                </button>
              </div>
            </div>

            <div v-if="newSto.step == 4" class="col-md-8 col-md-offset-4">
              <h4>Шаг 4: Бренды</h4>
              <hr />

              <div class="form-group">
                <label class="form-control-label">Стоимость нормо-часа:</label>
                <div class="input-group">
                  <input class="form-control" v-validate="{ rules: { regex: NUM} }" name="stdcost" v-model.trim="newSto.stdCost" placeholder="Стоимость нормо-часа">
                  <div class="input-group-addon">руб.</div>
                </div>
                <span v-show="errors.has('stdcost')">{{ errors.first('stdcost') }}</span>
              </div>

              <div class="form-group">
                <button class="btn btn-success changePriceBtn" :disabled="!newSto.stdCost || stdLoader" @click="changeRegStd(false)">Применить для всех</button>
                <button type="button" class="btn btn-secondary" @click="changeRegStd(true)">Обнулить все</button>
                <img src="../../assets/load.svg" alt="load gif" width="40" v-if="stdLoader">
              </div>

              <h5 style="margin-bottom: 20px">Бренды и стоимость</h5>
              <div class="input-group" style="margin-bottom: 8px" v-for="(car, index) in newSto.BrandsCost">
                <div class="input-group-addon" style="width: 150px">{{car.CarBrandName}} </div>
                <input class="form-control" type="text" v-model="car.StdCost">
                <div class="input-group-addon">руб.</div>
              </div>
            </div>

          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger float-right" data-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-success float-right" @click="editSTO">Применить изменения</button>
          <button type="button" class="btn btn-secondary" v-if="!newSto.isDeactivated" @click="stoActivation">Деактивировать СТО</button>
          <button type="button" class="btn btn-success" v-if="newSto.isDeactivated" @click="stoActivation">Активировать СТО</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {TheMask} from 'vue-the-mask'
import VueTimepicker from 'vue2-timepicker'
import VueSlider from 'vue-slider-component'
import bFormRadioGroup from 'bootstrap-vue/es/components/form-radio/form-radio-group'
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
import host from '../../data/host.js'

export default {
  name: 'editStoModal',
  props: ['stoId'],
  data() {
    return {
      getSpecStoLoader: true,
      errorGetSepc: false,
      validateText: /^[а-яА-ЯёЁa-zA-Z0-9\-\(\)\s\"\'\,\.]+$/,
      NUM: /^[0-9]+$/,
      stdLoader: false,
      isChief: localStorage.getItem('IsChief'),
      newSto: {},
      defaultSto: {
        Id: '',
        isDeactivated: false,
        speaker: '',
        comment: '',
        percent: 0,
        step: 1,
        phoneNumber: '',
        email: '',
        password: '',
        address: '',
        myWorkDays: {
          selected: 0,
          options: [
            {text: 'Будние дни', value: 0, status: 'Рабочий день', start_time: {HH: '09', mm: '00'},end_time: {HH: '23', mm: '00'},isWorking:true },
            {text: 'Суббота', value: 1, status: 'Рабочий день', start_time: {HH: '10', mm: '00'}, end_time: {HH: '21', mm: '00'}, isWorking:false},
            {text: 'Воскресенье', value: 2, status: 'Рабочий день', start_time: {HH: '10', mm: '00'}, end_time: {HH: '21', mm: '00'}, isWorking:false}
          ]
        },
        days: [{label: 'Понедельник',value: 1},
              {label: 'Вторник',value: 2},
              {label: 'Среда',value: 3},
              {label: 'Четверг',value: 4},
              {label: 'Пятница',value: 5},
              {label: 'Суббота',value: 6},
              {label: 'Воскресенье',value: 0}],
        mapDefault: {
          lat: '',
          lng: ''
        },
        BrandsCost: [],
        profit: {
          formatter: "%{value}",
          width: '100%',
          height: 8,
          dotSize: 16,
          min: 0,
          max: 500,
          disabled: false,
          show: true,
          tooltip: 'always',
          value: 0
        },
        workTime: {
          startHours: '',
          startMinute: '',
          endHours: '',
          endMinute: ''
        },
        markers: [{
          position: {
            lat: 1,
            lng: 1
          }
        }],
        stoLat: '',
        stoLng: '',
        name: '',
        linesModel: [{
          lineType: 0
        }],
        stdCost: 0,
        selected: [],
        selectedManager: {
          label: '',
          value: 0
        },
        spec: [],
        selectedPlushki: [],
        plushki: []
      }
    }
  },
  components: {
    TheMask,
    VueTimepicker,
    VueSlider,
    bFormRadioGroup,
    bFormCheckbox
  },
  methods: {
    getManagersList() {
      this.getSpecStoLoader = true
      this.$http.get(`${host.host}/Employee`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if (response.status == 200) {
          this.getSpecStoLoader = false
          let data = response.body
          let managers = []
          for(let i=0;i<data.length;i++) {
            managers.push({
              value: data[i].accountId,
              label: data[i].lastName + ' ' + data[i].firstName
            })
          }
          this.newSto.managers = managers
        }
      }, response => {
        this.getSpecStoLoader = false
        return toastr.error('Ошибка при получении списка менеджеров СТО')
      })
    },
    changeRegStd(toZero) {
      console.log(1)
      if (toZero) {
        this.newSto.stdCost = 0
      } else if (this.newSto.stdCost < 100) {
        return toastr.error('Стоимость нормо-часа должна быть минимум 100 рублей!');
      } 
      this.newSto.BrandsCost.forEach((it) => {
        it.StdCost = this.newSto.stdCost
      })
    },
    getSto () {
      this.getSpecStoLoader = true
      this.$http.get(`${host.host}/Sto/${this.stoId}`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if (response.body.error) return toastr.error('Ошибка при получении СТО')
        this.getSpecStoLoader = false
        let data = JSON.parse(response.body.model)
        console.log(data, data)
        this.newSto.Id = data.Id
        this.newSto.name = data.Name
        this.newSto.address = data.Address
        this.newSto.mapDefault.lat = data.PositionModel.Lat
        this.newSto.mapDefault.lng = data.PositionModel.Lng
        this.newSto.stoLat = data.PositionModel.Lat
        this.newSto.stoLng = data.PositionModel.Lng
        this.newSto.stdCost = data.StdCost
        this.newSto.phoneNumber = data.ContactPhone
        this.newSto.email = data.Email
        this.newSto.markers[0].position.lat = data.PositionModel.Lat
        this.newSto.markers[0].position.lng = data.PositionModel.Lng
        this.newSto.linesModel = []
        this.newSto.selected = []
        this.newSto.workDays = data.WorkDays.sort((a, b) => a.WorkDay - b.WorkDay)
        this.newSto.isDeactivated = data.Deactivation
        this.newSto.speaker = data.ContactSpeaker
        this.newSto.comment = data.DescriptionInfo
        this.newSto.percent = data.Percent
        this.newSto.selectedManager.label = data.ManagerName
        this.newSto.selectedManager.value = data.ManagerId
        this.newSto.BrandsCost = data.BrandsCost

        //Будний день
        this.newSto.myWorkDays.options[0].start_time.HH = data.WorkDays[0].TimeStart.split('T')[1].split(':')[0]
        this.newSto.myWorkDays.options[0].start_time.mm = data.WorkDays[0].TimeStart.split('T')[1].split(':')[1]
        this.newSto.myWorkDays.options[0].end_time.HH = data.WorkDays[0].TimeStop.split('T')[1].split(':')[0]
        this.newSto.myWorkDays.options[0].end_time.mm = data.WorkDays[0].TimeStop.split('T')[1].split(':')[1]
        this.newSto.myWorkDays.options[0].isWorking = data.WorkDays[0].IsWorking
        //Суббота
        this.newSto.myWorkDays.options[1].start_time.HH = data.WorkDays[5].TimeStart.split('T')[1].split(':')[0]
        this.newSto.myWorkDays.options[1].start_time.mm = data.WorkDays[5].TimeStart.split('T')[1].split(':')[1]
        this.newSto.myWorkDays.options[1].end_time.HH = data.WorkDays[5].TimeStop.split('T')[1].split(':')[0]
        this.newSto.myWorkDays.options[1].end_time.mm = data.WorkDays[5].TimeStop.split('T')[1].split(':')[1]
        this.newSto.myWorkDays.options[1].isWorking = data.WorkDays[5].IsWorking
        //Воскресенье
        this.newSto.myWorkDays.options[2].start_time.HH = data.WorkDays[6].TimeStart.split('T')[1].split(':')[0]
        this.newSto.myWorkDays.options[2].start_time.mm = data.WorkDays[6].TimeStart.split('T')[1].split(':')[1]
        this.newSto.myWorkDays.options[2].end_time.HH = data.WorkDays[6].TimeStop.split('T')[1].split(':')[0]
        this.newSto.myWorkDays.options[2].end_time.mm = data.WorkDays[6].TimeStop.split('T')[1].split(':')[1]
        this.newSto.myWorkDays.options[2].isWorking = data.WorkDays[6].IsWorking



        for (let i = 0; i < data.Facilities.length; i++) {
          this.newSto.selectedPlushki[i] = {
            label: data.Facilities[i].Name,
            value: data.Facilities[i].Id
          }
        }
      
        for (let i = 0; i < data.Specialization.length; i++) {
          this.newSto.selected[i] = {
            label: data.Specialization[i].Name,
            value: data.Specialization[i].Id
          }
        }

        for (let i = 0; i < data.LinesModel.length; i++) {
          this.newSto.linesModel[i] = {
            lineType: data.LinesModel[i].LineType
          }
        }
      }, response => {
        this.getSpecStoLoader = false
        return toastr.error('Ошибка при получении СТО')
      })
    },
    getSpecSto() {
      this.getSpecStoLoader = true
      this.$http.get(`${host.host}/Sto/GetSpecAndFac`, {
        headers : {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        
        if(response.body.errro == true) {
          this.errorGetSepc = true;
          return toastr.error('Ошибка при получении специализаций СТО');
        }
        this.getSto()
        let data = JSON.parse(response.body.model)
        let spec = []
        let plushki = []
        for(let i=0;i<data.Item1.length;i++) {
          spec.push({
            value: data.Item1[i].Id,
            label: data.Item1[i].Name
          })
        }
        for(let i=0;i<data.Item2.length;i++) {
          plushki.push({
            value: data.Item2[i].Id,
            label: data.Item2[i].Name
          })
        }
        this.newSto.spec = spec
        this.newSto.plushki = plushki
      }, response => {
        this.getSpecStoLoader = false
        return toastr.error('Ошибка при получении специализаций СТО')
      })
    },
    removeLine(index) {
      if(this.newSto.linesModel.length == 1) return toastr.info('Должна быть минимум 1 линия!')
      this.newSto.linesModel.splice(index, 1)
    },
    addNewLines() {
      this.newSto.linesModel.push({
        lineType: 0
      })
    },
    mapRclicked(mouseArgs) {
      const createdMarker = this.addMarker();
      createdMarker.position.lat = ''
      createdMarker.position.lng = ''
      createdMarker.position.lat = mouseArgs.latLng.lat()
      createdMarker.position.lng = mouseArgs.latLng.lng()
      this.newSto.stoLat = createdMarker.position.lat
      this.newSto.stoLng = createdMarker.position.lng
    },
    addMarker: function addMarker() {
      this.newSto.markers = [{}]
      this.newSto.markers.push({
        position: { lat: '', lng: '' }
      })
      return this.newSto.markers[this.newSto.markers.length - 1];
    },
    editSTO() {
      if (this.newSto.myWorkDays.options[0].status != 'Выходной день') {
        if (this.newSto.myWorkDays.options[0].start_time.HH > this.newSto.myWorkDays.options[0].end_time.HH) return toastr.error('Время начала работ в будние дни меньше времени окончания работ!');
      }
      if (this.newSto.myWorkDays.options[1].status != 'Выходной день') {
        if (this.newSto.myWorkDays.options[1].start_time.HH > this.newSto.myWorkDays.options[1].end_time.HH) return toastr.error('Время начала работ в субботу меньше времени окончания работ!');
      }
      if (this.newSto.myWorkDays.options[2].status != 'Выходной день') { 
        if (this.newSto.myWorkDays.options[2].start_time.HH > this.newSto.myWorkDays.options[2].end_time.HH) return toastr.error('Время начала работ в воскресенье меньше времени окончания работ!');
      }

      if(this.newSto.address == '') return toastr.error('Не указан адрес СТО!');
      if(this.newSto.stoLat == '' || this.newSto.stoLng == '') return toastr.error('Не указано местоположение на карте!');
      if(this.newSto.name == '') return toastr.error('Не указано название СТО!');
      if(!this.newSto.selected) return toastr.error('Добавьте хотя-бы одну линию!') 
      if(this.newSto.stdCost < 100 && this.newSto.stdCost != 0) return toastr.error('Стоимость нормо-часа должна быть минимум 100 рублей!') 

      $("#editStoModal").modal('hide');
      this.$parent.$emit('editSto', this.newSto)
    },
    changeStep(step) {
      this.newSto.step = step
    },
    stoActivation() {
      this.newSto.activationFlag = 'Deactivation'
      this.newSto.activationMessage = 'СТО успешно деактивировано!'
      this.newSto.isDeactivated ? this.newSto.activationFlag = 'Activation' : this.newSto.activationFlag = 'Deactivation'
      this.newSto.isDeactivated ? this.newSto.activationMessage = 'СТО успешно активировано!' : this.newSto.activationMessage = 'СТО успешно деактивировано!'
      this.$http.put(`${host.host}/Sto/${this.newSto.Id}/${this.newSto.activationFlag}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.updateWork = false
        let data = JSON.parse(response.data.model)
        this.newSto.isDeactivated = !this.newSto.isDeactivated
        this.$parent.$emit('rowDeactivation')

        return toastr.success(`${this.newSto.activationMessage}`)
      }, response => {
        this.updateWork = false
        return toastr.error('Ошибка сервера')
      })
    },
    refreshNewSto () {
      this.newSto = Object.assign({}, this.defaultSto)
    }
  },
  created() {
    let self = this;
    $(document).ready(function() {
      $('#editStoModal').on('show.bs.modal', function (e) {
        self.getSpecStoLoader = true
      })
      $('#editStoModal').on('shown.bs.modal', function (e) {
        self.refreshNewSto();
        self.getSpecSto();
        self.getManagersList();
      })
    })
  }
}
</script>

<style scoped>
  #imgTest img {
    height: auto;
    max-width: 90%;
  }
  .modal-footer {
    display: block;
  }
  @media (min-width: 992px) {
    .modal-lg {
      max-width: 1000px;
    }
  }
  .list-group-item:hover {
    cursor: pointer;
  }
  .container-fluid {
    margin-top: 20px;
  }
</style>