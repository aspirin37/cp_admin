<template>
	<div class="panel panel-default">
    <div class="panel-heading" data-toggle="collapse" href="#moreorder">
      <a class="pull-right">
        <i class="fa fa-bars"></i>
      </a>
      <h4 class="panel-title">О предзаказе</h4>
    </div>
    <div id="moreorder" class="panel-collapse collapse in">
      <div class="panel-body" style="line-height: 24px;">
        <span v-if="preOrderInfo.PreOrderIsDiagnostics"><b>Диагностический предзаказ</b></span>
        <br v-if="preOrderInfo.PreOrderIsDiagnostics"/>
        <span>Номер предзаказа: <b>{{ id }}</b></span><br>
        <span>Дата создания: <b>{{ parseCreateData(createDate) }}</b></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'about',
	props: ['id', 'createDate', 'preOrderInfo'],
	methods: {
		parseCreateData(date) {
			return this.parseDate(date.split('T')[0])+' в '+date.split('T')[1].split('.')[0].substr(0, 5)
		},
		parseDate(date) {
      let newDate = new Date()
      if(date == newDate.getFullYear()+'-'+this.checkTime(newDate.getMonth()+1)+'-'+this.checkTime(newDate.getDate())) {
        return 'Сегодня'
      } else return this.checkLengthDay(date.split('-')[2])+' '+this.parseMonth(date.split('-')[1])+' '+date.split('-')[0]
    },
    checkTime(i) {
      if (i < 10) i = "0" + i
      return i
    },
    checkLengthDay(day) {
      if(day < 10) {
        return day = day.substr(1, 1)
      } else return day
    },
    parseMonth(month) {
      let curMonth = ''
      switch (month) {
        case '01': curMonth = 'Января'; break;
        case '02': curMonth = 'Февраля'; break;
        case '03': curMonth = 'Марта'; break;
        case '04': curMonth = 'Апреля'; break;
        case '05': curMonth = 'Мая'; break;
        case '06': curMonth = 'Июня'; break;
        case '07': curMonth = 'Июля'; break;
        case '08': curMonth = 'Августа'; break;
        case '09': curMonth = 'Сентября'; break;
        case '10': curMonth = 'Октября'; break;
        case '11': curMonth = 'Ноября'; break;
        case '12': curMonth = 'Декабря'; break;
      }
      return curMonth
    }
	}
}
</script>

<style scoped>
	i {
		color: #333;
	}
</style>