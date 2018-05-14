<template>
  <div class="modal fade" id="fisDetailModal">
    <div class="modal-dialog modal-lg" style="max-width: 90%">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel">Замена детали</h4>
          <button type="button" class="close" @click="cancelSelectitemPhyDetail"><span>&times;</span></button>
        </div>
        <div class="modal-body middleModal" v-if="detailsList != null && !notFound">
          <div v-if="loader" class="text-center">
                <img src="../../assets/load.svg" alt="load gif" width="40">
          </div>

          <!-- <template v-if="detailsList.OEM_OffersByMan != null && detailsList.OEM_OffersByMan != [] && detailsList.OEM_AllTradeOffers != null && detailsList.OEM_AllTradeOffers != [] && detailsList.Analog_OffersByMan != null && detailsList.Analog_OffersByMan != [] &&detailsList.Analog_AllTradeOffers != null && detailsList.Analog_AllTradeOffers != []  "> -->
          <template>
            <slick ref="slick" :options="slickOptions"  v-if="!loader && detailsList != ''" class="garage__car_tabs">
              <a href="#" @click="selectTab(index)" v-for="(table, index) in detailsList" :class="{active: index == activeTab}" v-if="table != null" :key="index">
                {{ tabNames[index] }}
              </a>
            </slick>

      
            <div class="physicalTab"  v-if="!loader && physicalDetailList != '' && index == activeTab" v-for="(table, index) in detailsList" :key="index">
              <div class="input-group" v-if=" table != '' && table != null">
                
                <button type="button" class="btn btn-success btn-round dropdown-toggle noup" data-toggle="dropdown">
                  Сортировать по
                  <span class="caret mgl5"></span>
                </button>
                <ul class="dropdown-menu">
                  <li :class="{ active: selectedFilterBy == 1 }" @click="filterBy(1)"><a href="#">Сроку доставки</a></li>
                  <li :class="{ active: selectedFilterBy == 2 }" @click="filterBy(2)"><a href="#">Дешевле</a></li>
                  <li :class="{ active: selectedFilterBy == 3 }" @click="filterBy(3)"><a href="#">Дороже</a></li>
                </ul>
                
              </div>
              <hr>


              <table class="table table-bordered" v-if="table != '' && table != null">
                <thead>
                  <tr>
                    <th></th>
                    <th style="white-space: pre;">№ производителя</th>
                    <th>Производитель</th>
                    <th class="nowrap">Цена <i class="fa fa-rub"></i></th>
                    <th>Наименование</th>
                    <th>Доступно</th>
                    <th>Срок доставки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(phy, index) in table" v-if="phy != null" :class="{ active: $store.state.selorder.selectedDetails.Id == phy.Id }" :key="index">
                    <th>
                      <input type="radio" v-model="$store.state.selorder.selectedDetails" :value="phy" />
                    </th>
                    <th style="font-weight: 400;">{{ phy.OEM }}</th>
                    <td>
                      <b>{{ phy.Manufacturer }}</b>
                    </td>
                    <td>{{ convertPrice(phy.Price) }}</td>
                    <td>
                      <span v-if="phy.Text == ''">Не указано</span>
                      <span v-else>{{ phy.Text }}</span>
                    </td>
                    <td>{{ phy.Count }}</td>
                    <td>
                      <span v-if="phy.DaysDelivery == 0">На складе</span>
                      <span v-else>
                        {{ phy.DaysDelivery }} {{ deliDayParse(phy.DaysDelivery) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <template v-else>
                <div class="alert alert-info" v-if="!loader">
                  <span class="fa fa-exclamation-circle"></span>
                  <span>Ничего не найдено</span>
                </div>
              </template>
            </div>
          </template>
            
          <!-- <template v-else>
            <div class="alert alert-info" v-if="!loader">
              <span class="fa fa-exclamation-circle"></span>
              <span>Ничего не найдено</span>
            </div>
          </template> -->

        </div>
        <div class="modal-body middleModal notFoundBlock" v-if="!notFound && !loader && physicalDetailList == ''">
          <div class="alert alert-danger">
            <p>Детали не были найдены ни в одном из магазинов</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger pull-left" @click="cancelSelectitemPhyDetail">Отмена</button>
          <button type="button" class="btn btn-success" :disabled="$store.state.selorder.selectedDetails.length == 0" @click="selPhyDetail"><i class="fa fa-check mgr5" aria-hidden="true"></i> Выбрать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import Slick from 'vue-slick';

export default {
  name: 'Physical',
  props: ['detailsList', 'loader', 'notFound', 'selected', 'filter', 'phyDetailList'],
  data() {
    return {
      activeTab: 'OEM_OffersByMan',
      tabNames: {
        'OEM_OffersByMan': 'По ориг. номеру (лучшие)',
        'OEM_AllTradeOffers': 'По ориг. номеру (все)',
        'Analog_OffersByMan': 'По номеру производителя (лучшие)',
        'Analog_AllTradeOffers': 'По номеру производителя (все)',
      },
      selectedFilterBy: 1,
      slickOptions: {
        slidesToScroll: 1,
        arrows: false,
        infinite: false,
        swipeToSlide: true,
        touchThreshold: 10,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              variableWidth: false,
              slidesToShow: 2.5
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              variableWidth: false,
              slidesToShow: 1.5
            }
          }
        ]
      }
    }
  },
  components: {
    Slick
  },
  computed: {
  physicalDetailList() {
      if(this.selectedFilterBy == 1 ){
        if (this.detailsList.OEM_OffersByMan != null){
          this.detailsList.OEM_OffersByMan.sort(function(min, max) {
            return min.DaysDelivery - max.DaysDelivery
          })
        }
        if (this.detailsList.OEM_AllTradeOffers != null){
          this.detailsList.OEM_AllTradeOffers.sort(function(min, max) {
            return min.DaysDelivery - max.DaysDelivery
          })
        }
        if (this.detailsList.Analog_OffersByMan != null){
          this.detailsList.Analog_OffersByMan.sort(function(min, max) {
            return min.DaysDelivery - max.DaysDelivery
          })
        }
        if (this.detailsList.Analog_AllTradeOffers != null){
          this.detailsList.Analog_AllTradeOffers.sort(function(min, max) {
            return min.DaysDelivery - max.DaysDelivery
          })
        }

        return this.detailsList
      } 
      
      if(this.selectedFilterBy == 2 ){
        if (this.detailsList.OEM_OffersByMan != null){
          this.detailsList.OEM_OffersByMan.sort(function(min, max) {
            return min.Price - max.Price
          })
        }
        if (this.detailsList.OEM_AllTradeOffers != null){
          this.detailsList.OEM_AllTradeOffers.sort(function(min, max) {
            return min.Price - max.Price
          })
        }
        if (this.detailsList.Analog_OffersByMan != null){
          this.detailsList.Analog_OffersByMan.sort(function(min, max) {
            return min.Price - max.Price
          })
        }
        if (this.detailsList.Analog_AllTradeOffers != null){
          this.detailsList.Analog_AllTradeOffers.sort(function(min, max) {
            return min.Price - max.Price
          })
        }
        
        return this.detailsList
      } 

      if(this.selectedFilterBy == 3 ){
        if (this.detailsList.OEM_OffersByMan != null){
          this.detailsList.OEM_OffersByMan.sort(function(min, max) {
            return max.Price - min.Price
          })
        }
        if (this.detailsList.OEM_AllTradeOffers != null){
          this.detailsList.OEM_AllTradeOffers.sort(function(min, max) {
            return max.Price - min.Price
          })
        }
        if (this.detailsList.Analog_OffersByMan != null){
          this.detailsList.Analog_OffersByMan.sort(function(min, max) {
            return max.Price - min.Price
          })
        }
        if (this.detailsList.Analog_AllTradeOffers != null){
          this.detailsList.Analog_AllTradeOffers.sort(function(min, max) {
            return max.Price - min.Price
          })
        }
    
        return this.detailsList
      } 



      // if(this.selectedFilterBy == 1 && this.detailsList.OEM_OffersByMan != null ) return this.detailsList.OEM_OffersByMan.sort(function(min, max) {
      //   return min.DaysDelivery - max.DaysDelivery
      // })
          
      // if(this.selectedFilterBy == 2 && this.detailsList.OEM_OffersByMan != null) return this.detailsList.OEM_OffersByMan.sort(function(min, max) {
      //   return min.Price - max.Price
      // })
          
      // if(this.selectedFilterBy == 3 && this.detailsList.OEM_OffersByMan != null)  return this.detailsList.OEM_OffersByMan.sort(function(min, max) {
      //   return max.Price - min.Price
      // })
    }
  },
  methods: {
    selectTab(name){
      this.activeTab = name
    },
    deliDayParse(day) {
      day = '"'+day+'"'
      if(day.slice(0, -1) == '1') return 'день'
      else if(day.slice(0, -1) == '2' || day.slice(0, -1) == '3' || day.slice(0, -1) == '4') return 'дня'
      else return 'дней'
    },
    filterBy(id) {
      this.selectedFilterBy = id
    },
    convertPrice(price) {
      return numeral(price).format('0,0')
    },
    selectItemPhyDetail(id, phy) {
      this.$parent.$emit('selectItemPhyDetail', id, phy)
    },
    cancelSelectitemPhyDetail() {
      $("#fisDetailModal").modal("hide")
      this.$parent.$emit('cancelSelectitemPhyDetail')
    },
    selPhyDetail() {
      $("#fisDetailModal").modal("hide")
      this.$parent.$emit('selPhyDetail', this.$store.state.selorder.selectedDetails)
    }
  },
  watch: {
    loader: function(val) {
      if(val == true) this.selectedFilterBy = 1
    }
  },
}
</script>

<style scoped>
  #fisDetailModal.modal .modal-dialog.modal-lg { max-width: 1400px;}
  .middleModal {
    max-height: 500px;
    overflow: auto;
  }

  .notFoundBlock {
    margin-top: -30px;
    margin-bottom: -20px;
  }

  .garage__car_tabs { overflow: hidden; margin-bottom: 25px;}
  .garage__car_tabs .slick-track { overflow: hidden;}
  .garage__car_tabs .slick-slide { float: left; margin-right: 30px;}
  .garage__car_tabs .slick-slide a { text-decoration: none; display: block; padding: 0 15px 7px; color: #242424; position: relative; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
  .garage__car_tabs .slick-slide a.active { color: #5387B6;}
  .garage__car_tabs .slick-slide a.active:after { content: ''; display: block; position: absolute; margin: auto; left: 0; right: 0; bottom: 0; height: 3px; background-color: #5387B6; border-radius: 4px;}

  @media(max-width:768px) {
    .garage__car_tabs .slick-slide a { text-align: center;}
  }
</style>