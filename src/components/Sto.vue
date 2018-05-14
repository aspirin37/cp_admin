<template>
  <div class="Sto">
    <div class="fixed-nav" id="page-top">
      <headers></headers>
  
      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb title="Список станций" icon="fa fa-fw fa-wrench"></Breadcrumb>
          <div class="row">
            <div class="col-lg-12">
              <button v-if="!loader && userType == 8"  class="btn btn-success floar-left" data-toggle="modal" data-target="#addStoModal">Зарегистрировать СТО</button>

              <div class="text-center" v-if="loader">
                <img src="../assets/load.svg" alt="load gif" width="40">
              </div>

              <vue-good-table v-if="!loader"
                :columns="columns"
                :rows="stoList"
                :globalSearch="true"
                :globalSearchPlaceholder="'Поиск по ключевому слову'"
                paginate="true"
                :styleClass="'table custom-table'">
                <template slot="table-row" slot-scope="props">
                  <td>{{ props.row.stoId }}</td>
                  <td>{{ props.row.nameSto }}</td>
                  <td>{{ props.row.address }}</td>
                  <td>{{ props.row.contactPhone | formatPhone }}</td>              
                  <td>{{ props.row.email }}</td>
                  <td>
                    {{ props.row.managerName ? formatName(props.row.managerName) : ' - ' }}
                    <a href="#" class="text-primary text-right" style="margin-left: 8px" data-toggle="modal" data-target="#edit-admin-user-modal" @click="editedUser = props.row.managerId" v-if="userType == 3">
                      <span class="fa fa-sm fa-info-circle"></span>
                    </a>
                  </td>
                  <td v-if="userType == 8"><a href="#" class="text-primary" data-toggle="modal" data-target="#editStoModal" @click="editedSto = props.row.stoId"><span class="fa fa-lg fa-pencil-square-o"></span></a></td>
                </template>
              </vue-good-table>

            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalRegSto></ModalRegSto>
    <ModalEditSto :stoId="editedSto" v-if="editedSto"></ModalEditSto>
    <EditStaff :userId="editedUser" :isEditingDisabled="true" />

  </div>
</template>

<script>
  import host from '../data/host.js'
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  import ModalRegSto from './modals/RegSto'
  import ModalEditSto from './modals/EditSto'
  import EditStaff from './modals/EditStaff'
  
  export default {
    name: 'Sto',
    components: {
      headers,
      Breadcrumb,
      ModalRegSto,
      ModalEditSto,
      EditStaff
    },
    data() {
      return {
        loader: false,
        title: 'СТО',
        stoList: [],
        // paginate: ['stoList'],
        editedSto: 0,
        editedUser: 0,
        editedStoModel: '',
        selectedSto: '',
        bgLight: 'bg-light text-secondary',
        bgWhite: 'bg-white',
        userType: localStorage.getItem('userType'),
        columns: [{
          label: 'ID',
          field: 'stoId',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number',
        }, {
          label: 'Название СТО',
          field: 'nameSto',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Адрес',
          field: 'address',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Телефон',
          field: 'contactPhone',
          thClass: 'th-class cursor-pointer text-left',
          type: 'number',
        }, {
          label: 'Email',
          field: 'email',
          thClass: 'th-class cursor-pointer',
        }, {
          label: 'Менеджер',
          field: 'managerName',
          thClass: 'th-class cursor-pointer',
        }, {
          label: '',
          field: '',
          thClass: 'th-class',
          sortable: false,
          hidden: localStorage.getItem('userType') == 3
        }]
      }
    },
    methods: {
      parsePhone(phone) {
        return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1($2)$3-$4-$5")
      },
      getAllSto() {
        this.loader = true
        this.$http.get(`${host.host}/Sto/Management`, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.loader = false
          let data = response.body.reverse()
          this.stoList = data.sort(function (min, max) {
            return max.StoId - min.StoId
          })
          this.editedSto = data[0].StoId
        }, response => {
          this.loader = false
          toastr.error('Ошибка сервера')
        })
      },
      createNewSto(stoModel) {
        this.loader = true

          let listLines = []
          for(let i=0;i<stoModel.selected.length;i++) {
            listLines.push(Number(stoModel.selected[i].value))
          }

          let plushki = []
          for(let i=0;i<stoModel.selectedPlushki.length;i++) {
            plushki.push(stoModel.selectedPlushki[i].value)
          }

          let listLinesC = []
          for(let i = 0; i < stoModel.linesModel.length; i++){
            if(stoModel.linesModel[i].lineType != 0) listLinesC.push(stoModel.linesModel[i].lineType)
          }

        this.$http.post(`${host.host}/Account/Sto`, {
          'password': stoModel.password,
          'confirmPassword': stoModel.password,
          'managerId': stoModel.selectedManager.value,
          'stoInformation' : {
            'name' : stoModel.name,
            'address': stoModel.address,
            'lat': stoModel.stoLat,
            'lng': stoModel.stoLng,
            "workStartTime": "2018-01-30T07:31:51.018Z",
            "workStopTime": "2018-01-30T07:31:51.018Z",
            'workDays': this.getWorkDays(stoModel),
            'listTypeLines': listLinesC,
            'stdCost': Number(stoModel.stdCost),
            'contactPhone': '7'+ stoModel.phoneNumber,
            'contactSpeaker': stoModel.speaker,
            'email': stoModel.email,
            'facModel':{'specialization':listLines,'facilities':plushki},
            'descriptionInfo': stoModel.comment,
            'percent': stoModel.percent,
            'managerId': stoModel.selectedManager.value,
            'newPassword': stoModel.password,
            'brandCostList': stoModel.BrandsCost
          },
          
        }, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if( response.status == 200) {
            if(response.message == 'This STO already exists!') {
              this.loader = false
              return toastr.error('СТО с таким номером телефона уже существует!')
            }
            if(response.error == true) {
              this.loader = false
              return toastr.error('Ошибка сервера')
            }
            localStorage.removeItem('CarPortStoToken')
            this.getAllSto()
            return toastr.success('СТО успешно создано!')
          }
        }, response => {
          toastr.error('Ошибка сервера')
          this.loader = false
        })
      },
      
      editSto(stoModel) {
        this.loader = true
        let listLines = []
        for(let i=0;i<stoModel.selected.length;i++) {
          listLines.push(Number(stoModel.selected[i].value))
        }

        let plushki = []
        for(let i=0;i<stoModel.selectedPlushki.length;i++) {
          plushki.push(stoModel.selectedPlushki[i].value)
        }
      
        let listLinesC = []
        for(let i = 0; i < stoModel.linesModel.length; i++){
          if(stoModel.linesModel[i].lineType != 0) listLinesC.push(stoModel.linesModel[i].lineType)
        }
        this.$http.put(`${host.host}/Sto/${this.editedSto}`, {
          'address': stoModel.address,
          'name' : stoModel.name,
          'lat': stoModel.stoLat,
          'lng': stoModel.stoLng,
          'workDays': this.getWorkDays(stoModel),
          'listTypeLines':listLinesC,
          'facModel':{'specialization':listLines,'facilities':plushki},
          'stdCost': Number(stoModel.stdCost),
          'contactPhone': stoModel.phoneNumber,
          'email': stoModel.email,
          'percent': Number(stoModel.percent),
          'contactSpeaker': stoModel.speaker,
          'DescriptionInfo': stoModel.comment,
          'password': stoModel.password,
          'managerId': stoModel.selectedManager.value,
          'brandCostList': stoModel.BrandsCost
        }, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => { 
          this.profileLoader = false
          if(response.body.error == true) return toastr.error('Ошибка сервера')
          this.getAllSto()
          return toastr.success('Успешно обновлено!')
          
        }, response => {
          this.profileLoader = false
          toastr.error('Ошибка сервера')
        })
      },
      regSto() {
        event.preventDefault();
        setTimeout(this.mapResize, 200);
      },
      mapResize() {
        this.$gmapDefaultResizeBus.$emit('resize');
      },
      formatName (fullName) {
        let n = fullName.split(' ')
        if (n.length < 3) {
          return fullName
        } else {
          return `${n[1]} ${n[0]} ${n[2]}`
        }
      },
      getWorkDays (data) {
        const workDays = []

        function WorkDay (data, day, i) {
          this.workDay = day,
          this.isWorking = data.myWorkDays.options[i].isWorking
          this.timeStart = '2017-01-01 ' + data.myWorkDays.options[i].start_time.HH + ':' + data.myWorkDays.options[i].start_time.mm + ':00.3798518+03:00'
          this.timeStop = '2017-01-01 ' + data.myWorkDays.options[i].end_time.HH + ':' + data.myWorkDays.options[i].end_time.mm + ':00.3798518+03:00'
        }

        workDays[0] = new WorkDay(data, 0, 0)
        workDays[1] = new WorkDay(data, 1, 0)
        workDays[2] = new WorkDay(data, 2, 0)
        workDays[3] = new WorkDay(data, 3, 0)
        workDays[4] = new WorkDay(data, 4, 0)
        workDays[5] = new WorkDay(data, 5, 1)
        workDays[6] = new WorkDay(data, 6, 2)

        return workDays
      }
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title
      this.getAllSto()
    },
    mounted() {
      this.$on('createNewSto', function(stoModel) {
        this.createNewSto(stoModel)
      })
      this.$on('editSto', function(stoModel) {
        this.editSto(stoModel)
      })
      this.$on('rowDeactivation', function() {
        let self = this;
        this.stoList.forEach(function (it, i) {
          if (self.editedSto === it.StoId) it.Deactivation = !it.Deactivation
        })
      })
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
</style>