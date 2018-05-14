<template>
  <div class="Clients">
    <div class="fixed-nav" id="page-top">
      <headers></headers>
  
      <div class="content-wrapper py-3">
        <div class="container-fluid">
          <Breadcrumb :title="'Взаиморасчеты / Клиенты'" :icon="'fa fa-fw fa-comments'"></Breadcrumb>
          <div class="loader">
            <img src="../assets/load.svg" alt="" width="40" v-if="loader">
          </div>
          <div class="card mb-3" v-if="!loader">
            <div class="card-header">
              <i class="fa fa-table"></i> Изменения баланса
            </div>
            <div class="">
              <div class="table-responsive">
                <div id="dataTable_wrapper" class="dataTables_wrapper container-fluid dt-bootstrap4">
                  
                  <div class="row">
                    <div class="col-sm-12">
                      <table class="table table-bordered table-sm" width="100%" id="dataTable" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
                        <thead class="thead-default">
                          <tr role="row">
                            <th class="text-center" tabindex="0" rowspan="1" colspan="1" style="width: 100px;">Дата</th>
                            <th class="text-center" tabindex="0" rowspan="1" colspan="1" style="width: 200px;">Операция</th>
                            <th class="text-center" tabindex="0" rowspan="1" colspan="1" style="width: 100px;">Поставка</th>
                            <th class="text-center" tabindex="0" rowspan="1" colspan="1" style="width: 90px;">Оплата</th>
                            <th class="text-center" tabindex="0" rowspan="1" colspan="1">Примечания</th>
                          </tr>
                        </thead>
                        
                        
                        <tbody>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-danger">На начало задолженность:</td>
                            <td colspan="2" class="table-danger text-center">6724.74 руб.</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td rowspan="3" class="text-center align-middle">02.09.17</td>
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">1323.15</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №364121 Экспресс-заказ 13-50...15-30 КомДост</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">1221.80</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №364171 Экспресс-заказ 15-30 КомДост</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">307.56</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №364221 Экспресс-заказ 18-00 Серебристый</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-warning sm-text">Промежуточный итог</td>
                            <td colspan="2" class="table-warning text-center sm-text">9577.25</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td rowspan="2" class="text-center align-middle">03.09.17</td>
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">2443.60</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №364219 Экспресс-заказ 9-30...11-30 КомДост</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">1616.63</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №364348 Экспресс-заказ 17-30 Серебристый</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-warning sm-text">Промежуточный итог</td>
                            <td colspan="2" class="table-warning text-center sm-text">13637.48</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="text-center align-middle">04.09.17</td>
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">2081.58</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №364388 Экспресс-заказ 13-30 Серебристый</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-warning sm-text">Промежуточный итог</td>
                            <td colspan="2" class="table-warning text-center sm-text">15719.06</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="text-center align-middle">05.09.17</td>
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">12012.09</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №364784 Экспресс-заказ 11-30 Серебристый</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-warning sm-text">Промежуточный итог</td>
                            <td colspan="2" class="table-warning text-center sm-text">27731.15</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td rowspan="2" class="text-center align-middle">06.09.17</td>
                            <td class="">Продажа за безнал</td>
                            <td class="text-muted text-right">0</td>
                            <td class="text-right">25000.00</td>
                            <td>ПП №359 от 06.09.17 040917/189</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">5395.90</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №365627 Экспресс-заказ 17-15 Серебристый</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-warning sm-text">Промежуточный итог</td>
                            <td colspan="2" class="table-warning text-center sm-text">8127.05</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td rowspan="2" class="text-center align-middle">07.09.17</td>
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">8709.20</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №365564 Экспресс-заказ 11-30...13-30 КомДост</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">3565.10</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №365849 Экспресс-заказ 16-30...19-30 КомДост</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-warning sm-text">Промежуточный итог</td>
                            <td colspan="2" class="table-warning text-center sm-text">20401.35</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="text-center align-middle">09.09.17</td>
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">329.87</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №351784 от 08.09.17</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-warning sm-text">Промежуточный итог</td>
                            <td colspan="2" class="table-warning text-center sm-text">20731.22</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td rowspan="3" class="text-center align-middle">11.09.17</td>
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">354.76</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №351785 от 10.09.17</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="table-success">Возвратный счет</td>
                            <td class="text-muted text-right">0</td>
                            <td class="text-right">605.55</td>
                            <td>XZK-BK-4028/1 шт./614.77/1.5%/695.55 декл.663752</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td class="table-success">Поставка товара</td>
                            <td class="text-right">1492.85</td>
                            <td class="text-muted text-right">0</td>
                            <td>Накладная №366797 Экспресс-заказ 11-30 Серебристый</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2">Итого обороты</td>
                            <td class="text-center">40854.09</td>
                            <td class="text-center">25605.55</td>
                          </tr>
                          <tr role="row" class="odd">
                            <td colspan="2" class="table-danger">На конец задолженность:</td>
                            <td colspan="2" class="table-danger text-center">21973.28 руб.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
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
  import headers from './layouts/Header'
  import Breadcrumb from './layouts/Breadcrumb'
  import host from '../data/host.js'
  export default {
    name: 'Clients',
    components: {
      headers,
      Breadcrumb
    },
    data() {
      return {
        title: 'Клиенты'
      }
    },
    created() {
      if (!localStorage.getItem('token')) return this.$router.push('/')
      document.title = this.title
    }
  }
</script>

<style scoped src="../assets/admin.css">
  
</style>

<style scoped lang="sass">
  .container-fluid
    margin-top: 55px
  .tittle
    margin-top: 55px
  .loader
    width: 100%
    text-align: center
  .container-fluid.dt-bootstrap4
    padding-right: 0px
    padding-left: 0px
    margin-top: 0
  .table
    margin-bottom: 0
    table-layout: fixed
  .form-control
    padding: 0px 2px
    border: 0px
  .pagination
    margin-bottom: 0px
  .sm-text
    font-size: 13px
</style>