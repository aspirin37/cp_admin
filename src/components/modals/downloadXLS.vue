<template>
  <div class="modal fade" id="downloadXLS" role="dialog">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">Выберите необходимые поля</h4>
          <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
        </div>
        <div class="modal-body">
          <form class="container " @submit.prevent="formatXLSfile">
            <div class="row">
              <div class="col-lg-6" style="margin-bottom: 20px">
                <div v-for="(field, i) in XLSfields" v-if="isShownField(i, 'left')">
                  <bFormCheckbox 
                    class="xls-checkbox"
                    v-model="field.isChecked" 
                    v-if="tableType == 1 && !field.isHidden || tableType == 2">
                    <span>{{ field.text }}</span>
                  </bFormCheckbox>
                </div>
              </div>
              <div class="col-lg-6">
                <div v-for="(field, i) in XLSfields"  v-if="isShownField(i, 'right')">
                  <bFormCheckbox 
                    class="xls-checkbox"
                    v-model="field.isChecked" 
                    v-if="tableType == 1 && !field.isHidden || tableType == 2">
                    <span>{{ field.text }}</span>
                  </bFormCheckbox>
                </div>
              </div>
            </div>
            <div class="row" style="margin-bottom: 20px">
              <div class="col-lg-8">
                <label for="fileName">Имя файла:</label>
                <input class="form-control" id="fileName" type="text" placeholder="Введите имя файла" v-model="fileName" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Скачать</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../../data/host.js'
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'

export default {
  name: 'downloadXLS',
  components: {
    bFormCheckbox
  },
  props: ['tableType'], // users: 1; staff: 2
  data() {
    return {
      XLSdata: [],
      json_fields: {},
      fileName: '',
      hiddenFileds: 0,
      XLSfields: [{
        text: 'accountId',
        isChecked: false,
        isHidden: false,
      }, {
        text: 'userId',
        isChecked: false,
        isHidden: false,
      }, {
        text: 'Имя',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Логин',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Дата регистрации',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Телефон',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Активен',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Последний вход',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Всего посещений',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Баланс',
        isChecked: true,
        isHidden: false,
      }, {
        text: 'Отдел',
        isChecked: true,
        isHidden: true,
      }, {
        text: 'Начальник',
        isChecked: true,
        isHidden: true,
      }]
    }
  },
  methods: {
    setFileName() {
      switch (this.tableType) {
        case 1:
          this.fileName = 'Пользователи'
          this.hiddenFields = 2
          break
        case 2:
          this.fileName = 'Сотрудники' 
          this.hiddenFields = 0
          break
      }
    },
    isShownField(i, dir) {
      if (dir == 'left') return (i + 1) <= (this.XLSfields.length - this.hiddenFields) / 2
      if (dir == 'right') return (i + 1) > (this.XLSfields.length - this.hiddenFields) / 2
    },
    formatXLSfile() {

      // выводим в нужном порядке для отображения полей в excel-файле
      // json_fields - обязательное поле для плагина JsonExcel

      this.XLSfields[0].isChecked ? this.json_fields['accountId'] = 'accountId'                        : delete this.json_fields['accountId']
      this.XLSfields[1].isChecked ? this.json_fields['userId'] = 'userId'                              : delete this.json_fields['userId']
      this.XLSfields[2].isChecked ? this.json_fields['Имя'] = 'fullName'                               : delete this.json_fields['Имя']
      this.XLSfields[3].isChecked ? this.json_fields['Логин'] = 'loginNumber'                          : delete this.json_fields['Логин']
      this.XLSfields[4].isChecked ? this.json_fields['Дата регистрации'] = 'formattedRegistrationDate' : delete this.json_fields['Дата регистрации']
      this.XLSfields[5].isChecked ? this.json_fields['Телефон'] = 'formattedContactPhone'              : delete this.json_fields['Телефон']
      this.XLSfields[6].isChecked ? this.json_fields['Активен'] = 'formattedIsActive'                  : delete this.json_fields['Активен']
      this.XLSfields[7].isChecked ? this.json_fields['Посл. вход'] = 'formattedLastLoginDate'          : delete this.json_fields['Посл. вход']
      this.XLSfields[8].isChecked ? this.json_fields['Всего посещений'] = 'countOfLogin'               : delete this.json_fields['Всего посещений']
      this.XLSfields[9].isChecked ? this.json_fields['Баланс'] = 'balance'                             : delete this.json_fields['Баланс']

      if (this.tableType == 2) {
        this.XLSfields[10].isChecked ? this.json_fields['Отдел'] = 'subdivisionDescription'            : delete this.json_fields['Отдел']
        this.XLSfields[11].isChecked ? this.json_fields['Начальник'] = 'formattedIsChief'              : delete this.json_fields['Начальник']
      }

      this.$parent.$emit('downloadXLS', this.json_fields, this.fileName)
      $('#downloadXLS').modal('hide')
    }
  },
  created() {
    this.setFileName()
  },
}
</script>

<style scoped lang="sass">

</style>