<template>
  <div class="Logos">
    <div class="fixed-nav" id="page-top">
      <headers></headers>

      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb title="Логотипы" icon="fa fa-fw fa-image"></Breadcrumb>

          <div class="text-center" v-if="loader">
            <img src="../../assets/load.svg" alt="load gif" width="40">
          </div>

          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#brands">Бренды</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#scheme">Схемы</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#logos">Логотипы</a>
            </li>
          </ul>

          <div class="tab-content" style="padding-top: 40px">
            <div class="show active tab-pane fade" id="brands"> 
              <EditableList :item="'brand'" />
            </div>

            <div class="tab-pane fade" id="scheme">
              <EditableList :item="'scheme'" />
            </div>

            <div class="tab-pane fade" id="logos">

              <div class="row">
                <div class="col-4" style="margin-right: 40px">
                  <select class="form-control" style="margin-bottom: 20px" v-model="selectedScheme">
                    <option disabled="disabled" selected value='0'>Выберите тип схемы</option>
                    <option v-for="scheme in schemes" :value="scheme.id">{{ scheme.name }}</option>
                  </select>

                  <div class="text-center" v-if="logosLoader">
                    <img src="../../assets/load.svg" alt="load gif" width="40">
                  </div>

                  <ul class="list-group">
                    <li :class="[logo.isSelected ? 'bg-light' : 'cursor-pointer', 'list-group-item d-flex justify-content-between']"
                      v-for="(logo, i) in logos" 
                      @click="getSelectedLogoURL(logo.brandId, logo.hasImage, i, logo.image)"
                      v-if="!logosLoader">
                        <span>{{ logo.brandName }}</span>
                        <span :class="[logo.hasImage ? 'text-primary fa-check' : 'text-secondary fa-ban', 'fa fa-sm']"></span>
                    </li>
                  </ul>
                </div>
                
                <div class="d-flex img-thumbnail logo-container" v-if="selectedScheme && selectedLogoUrl">
                  <span style="margin-left: 10px" v-if="!logoHasImage">Добавьте<br>изображение</span>
                  <img class="d-block align-self-center" width="170" height="auto" :src="selectedLogoUrl" v-if="logoHasImage">
                </div>

                <div class="col-2 d-flex flex-column" v-if="selectedScheme && selectedLogoUrl">
                  <label class="btn btn-primary" style="margin-bottom: 10px">
                    {{ logoHasImage ? 'Изменить' : 'Добавить' }} <input type="file" id="logo-upload" hidden @change="uploadLogo">
                  </label>
                  <button class="btn btn-secondary" type="button" v-if="logoHasImage" @click="deleteLogo">Удалить</button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import host from '../../data/host.js'
import headers from './../layouts/Header'
import Breadcrumb from './../layouts/Breadcrumb'
import EditableList from './EditableList'

export default {
  name: 'Logos',
  components: {
    headers,
    Breadcrumb,
    EditableList
  },
  data() {
    return {
      title: 'Логотипы',
      loader: false,
      logosLoader: false,
      selectedLogoLoader: false,
      schemes: [],
      logos: [],
      newItemName: '',
      selectedScheme: 0,
      selectedBrand: 0,
      selectedBrandIdx: 0,
      selectedLogoUrl: '',
      logoHasImage: true
    }
  },
  watch: {
    selectedScheme: function () {
      this.getLogos()
      this.selectedLogoUrl = ''
      this.logos.forEach((it) => {
        it.isSelected = false
      })
    }
  },
  methods: {
    getSchemes() {
      this.brandsLoader = true
      this.$http.get(`${host.host}/Catalog/CarLogoImages/ColorSchemes`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.schemesLoader = false
        this.schemes = response.body.sort((a, b) => a.id - b.id)
      }, response => {
        this.schemesLoader = false
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    getLogos() {
      this.logosLoader = true
      this.$http.get(`${host.host}/Catalog/CarLogoImages/PreviewBrands?schemeId=${this.selectedScheme}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.logosLoader = false
        this.logos = response.body.sort((a, b) => a.brandId - b.brandId)
        this.logos.forEach((it) => {
          it.isSelected = false
          it.image = ''
        })
      }, response => {
        this.logosLoader = false
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    getSelectedLogoURL(id, hasImage, i, uploadedImage) {
      this.logos.forEach((it) => {
        it.isSelected = false
      })

      if (uploadedImage) {
        this.selectedLogoUrl = uploadedImage
      } else {
        this.selectedLogoUrl = `${host.host}/Catalog/CarLogoImages/Logo?schemeId=${this.selectedScheme}&brandId=${id}`
      }

      this.logoHasImage = hasImage ? true : false

      this.logos[i].isSelected = true
      this.selectedBrand = id
      this.selectedBrandIdx = i
    },
    uploadLogo() {
      let uploadedLogo = document.getElementById('logo-upload').files[0]
      let reader  = new FileReader()
      let formData = new FormData()
      formData.append('FileToUpload', uploadedLogo);

      reader.onloadend = (evt) => {
        this.$http.put(`${host.host}/Catalog/CarLogoImages/Logo?brandId=${this.selectedBrand}&schemeId=${this.selectedScheme}`, formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'multipart/form-data',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.logoHasImage = true
          this.logos[this.selectedBrandIdx].hasImage = true
          this.logos[this.selectedBrandIdx].image = reader.result
          this.selectedLogoUrl = reader.result
          return toastr.success('Новое изображение успешно добавлено!')
        }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
        }) 
      }

      uploadedLogo ? reader.readAsDataURL(uploadedLogo) : this.selectedLogoUrl = ''
    },
    deleteLogo() {
      this.$http.delete(`${host.host}/Catalog/CarLogoImages/logo?brandId=${this.selectedBrand}&schemeId=${this.selectedScheme}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.logoHasImage = false
        this.logos[this.selectedBrandIdx].hasImage = false

        return toastr.success('Изображение успешно удалено!')
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
  },
  created () {
    this.getSchemes()
  }
}
</script>

<style scoped src="../../assets/admin.css"></style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px

  .list-group
    padding-right: 0 !important

  .cursor-pointer
    cursor: pointer

  .logo-picture
    display: block

  .logo-container
    min-width: 180px
    height: 170px
    margin-right: 30px

  .list-group-item
    padding: px 1.25rem 

  .form-control
    padding: 5px 1.25rem 
</style>