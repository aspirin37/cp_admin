<template>
  <div>
    <div class="text-center" v-if="loader">
      <img src="../../assets/load.svg" alt="load gif" width="40">
    </div>
    <ul class="list-group col-lg-4">
      <li class="list-group-item d-flex justify-content-end" v-for="(it, i) in items" :id="item + i">
        <span :class="item + '-text col-lg-8'" :id="item + '-text' + i">{{ it.name }}</span>
        <input :class="item + '-input form-control mr-auto col-lg-8 d-none'" :id="item + '-input' + i" v-model="it.name" @keyup.enter="editItem(it.id, it.name)">

        <div class="col-lg-4 text-right">
          <a href="#" class="text-secondary" style="position: relative; top: 2px" @click.prevent>
            <span class="fa fa-fw fa-pencil-square-o" @click="toggleEditing(i)"></span>
          </a>
          <a href="#" class="text-secondary" @click.prevent>
            <span class="fa fa-fw fa-trash" @click="deleteItem(it.id, i)"></span>
          </a>
        </div>
      </li>

      <li class="list-group-item">
        <form class=" d-flex justify-content-end" @submit.prevent="addItem">
          <input class="form-control mr-auto col-lg-7" type="text" v-model="newItemName" :placeholder="placeholder">
          <button class="btn btn-primary col-lg-4" type="submit">Добавить</button>
        </form>
      </li>
    </ul>
  </div>
</template>

<script>
import host from '../../data/host.js'

export default {
  name: 'editableList',
  props: ['item'],
  data() {
    return {
      loader: false,
      items: [],
      newItemName: '',
      placeholder: ''
    }
  },
  methods: {
    onOutsideListClickHandler() {
      // let self = this
      $(document).mouseup((e) => { 
        let list = $(".list-group")
        if (!list.is(e.target) && list.has(e.target).length === 0) {
          this.refreshLists()
        }
      });
    },
    refreshLists() {
      $(`.${this.item}-text`).each(function() {
        $(this).removeClass('d-none')
      })
      $(`.${this.item}-input`).each(function() {
        $(this).addClass('d-none')
      })
    },
    getItems() {
      let URL
      switch (this.item) {
        case 'brand':
          URL = `${host.host}/Catalog/CarLogoImages/Brands`
          this.placeholder = 'Название бренда'
        break
        case 'scheme':
          URL = `${host.host}/Catalog/CarLogoImages/ColorSchemes`
          this.placeholder = 'Название схемы'
        break
      }

      this.loader = true
      this.$http.get(URL, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.loader = false
        this.items = response.body.sort((a, b) => a.id - b.id)
      }, response => {
        this.loader = false
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    editItem(id, text) {
      if (!text.length || text.length > 64) return toastr.error('Название должно содержать от 1 до 64 символов')

      let URL
      let message

      switch (this.item) {
        case 'brand':
          URL = `${host.host}/Catalog/CarLogoImages/Brands`
          message = 'Бренд успешно переименован!'
          break
        case 'scheme':
          URL = `${host.host}/Catalog/CarLogoImages/ColorSchemes`
          message = 'Схема успешно переименована!'
          break
      }

      this.$http.put(URL, {
        id: id ,
        name: text
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        $(`.${this.item}-text`).each(function() {
          $(this).removeClass('d-none')
        })
        $(`.${this.item}-input`).each(function() {
          $(this).addClass('d-none')
        })
        return toastr.success(message)
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
    toggleEditing(i) {
      this.refreshLists()
      $(`#${this.item}-text${i}`).toggleClass('d-none')
      $(`#${this.item}-input${i}`).toggleClass('d-none').focus()
    },
    addItem() {
      if (!this.newItemName.length || this.newItemName.length > 64) return toastr.error('Название должно содержать от 1 до 64 символов')

      let URL
      let message

      switch (this.item) {
        case 'brand':
          URL = `${host.host}/Catalog/CarLogoImages/Brands`
          message = 'Бренд успешно добавлен!'
          break
        case 'scheme':
          URL = `${host.host}/Catalog/CarLogoImages/ColorSchemes`
          message = 'Схема успешно добавлена!'
          break
      }

      this.$http.post(URL, {
        id: 0,
        name: this.newItemName
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        this.items.push({
          id: response.body.id,
          name: this.newItemName
        })
        this.newItemName = ''
        return toastr.success(message)
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      }) 
    },
    deleteItem(id, i) {
      let URL
      let message
      let confirmationMessage

      switch (this.item) {
        case 'brand':
          URL = `${host.host}/Catalog/CarLogoImages/Brands?brandId=${id}`
          confirmationMessage = 'Вы действительно хотите удалить этот бренд?'
          message = 'Бренд успешно удален!'
          break
        case 'scheme':
          URL = `${host.host}/Catalog/CarLogoImages/ColorSchemes?colorSchemeId=${id}`
          confirmationMessage = 'Вы действительно хотите удалить эту схему?'
          message = 'Схема успешно удалена!'
          break
      }

      let confirmation = confirm(confirmationMessage)
      if (!confirmation) return

      this.$http.delete(URL, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        $('#' + this.item + i).remove()
        return toastr.success(message)
      }, response => {
        return response.body.message ? toastr.error(response.body.message) : toastr.error('Ошибка сервера')
      })
    },
  },
  created() {
    this.getItems()
    this.onOutsideListClickHandler()
  }
}
</script>

<style scoped lang="sass">
  .input-group 
    margin-top: 5px

  .list-group
    padding-right: 0 !important

  .list-group-item
    padding: px 1.25rem 

  .form-control
    padding: 5px 1.25rem 

</style>