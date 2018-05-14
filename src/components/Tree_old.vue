<!-- <template>
  <div class="tree treeview">
    <ul class="list-group">
    <div v-for="tree in data" v-if="tree.ParentId === parent">
      <li v-bind:class="{ fontLg: tree.ParentId == 0, active: tree.Id == $store.state.selectedTreeNode }" data-toggle="collapse" :href="'#tree'+tree.Id" @click="getVehicle(tree.ParentId, tree.Id, tree.PictureId)" class="list-group-item">
        <span class="fa fa-stop" v-if="tree.ParentId != 0" @click="getVehicle(tree.ParentId, tree.Id, tree.PictureId)"></span>
        <span class="fa fa-chevron-right" v-if="tree.ParentId == 0" data-toggle="collapse" :href="'#tree'+tree.Id"></span>
        <span style="white-space: pre-line;">{{ tree.Title }}</span>
      </li>
      <tree :data="data" :carModel="carModel" v-on:getData="getDataList" v-on:loader="getLoader" v-on:coordSchema="getCoordSchema" v-on:picImage="getPicImage" v-on:picLoader="getPicLoader" :vehid="vehid" :wload="wload" :dload="dload" :parent="tree.Id" :id="'tree' + tree.Id" class="collapse"></tree>
      </div>
    </ul>
    </div>
</div>
  </div>
</template>

<script>
import host from '../data/host.js'
import Tree from './Tree'

export default {
  name: 'tree',
  props: ['data', 'parent', 'vehid', 'wload', 'dload', 'carModel'],
  data() {
    return {
      token: localStorage.getItem('token')
    }
  },
  components: {
    Tree
  },
  methods: {
    getCoordSchema: function (data) {
      this.$parent.$emit('getCoordSchema', data)
    },
    getPicImage: function (data) {
      this.$parent.$emit('getPicImage', data)
    },
    getPicLoader: function (data) {
      this.$parent.$emit('picLoader', data)
    },
    getDataList: function (data) {
      this.$parent.$emit('getTreeData', data)
    },
    getLoader: function (bool) {
      this.$parent.$emit('detailLoader', bool)
    },
    getVehicle(parentId, id, picturedId) {

      /*let self = this;
      for(let i=0;i<this.data.length;i++) {
        if(this.data[i].ParentId == 0) {
          if(this.data[i].Id != id) {
            $('#tree'+self.data[i].Id).collapse('hide')
          }
        }
      }*/

      if(parentId != 0) {
      this.$emit('loader', true)
      this.$emit('picLoader', true)
        this.$store.state.selectedTreeNode = id
        let parseModel = this.carModel.Model.replace(/ /g,'')
        this.$http.get(`${host.host}/Vehicle/${this.vehid}/Part?treeNodeId=${id}&model=${parseModel}`, {
          headers : {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          if(response.body.error == true) {
            toastr.error('Ошибка сервера')
            this.$emit('picLoader', false)
            this.$emit('loader', false)
            return false
          }
          let data = JSON.parse(response.data.model)
          this.$emit('getData', data)
          this.$emit('loader', false)
          this.$http.get(`${host.host}/Vehicle/${this.vehid}/Picture/${picturedId}`, {
            headers : {
              'Authorization': 'Bearer ' + this.token,
              'Content-Type' : 'application/json; charset=UTF-8',
              'Accept' : 'application/json'
            }
          }).then(response => {
            this.$emit('picLoader', false)
            let data = JSON.parse(response.data.model)
            if(data == null) return this.$emit('picImage', null)
            this.$emit('picImage', response)
            this.$emit('coordSchema', data.CoordSchema)
          }, response => {
            this.$emit('picLoader', false)
          })
        }, response => {
          toastr.error('Ошибка сервера')
          this.$emit('picLoader', false)
          this.$emit('loader', false)
          return false
        })
      }
    }
  },
  created() {
    this.$store.state.orders.pictureId = ''
    this.$store.state.orders.CoordSchema = ''
  },
  mounted() {
    this.$on('getCoordSchema', function(data) {
      this.$parent.$emit('getCoordSchema', data)
    }),
    this.$on('getPicImage', function(data) {
      this.$parent.$emit('getPicImage', data)
    }),
    this.$on('picLoader', function(data) {
      this.$parent.$emit('picLoader', data)
    }),
    this.$on('getTreeData', function(data) {
      this.$parent.$emit('getTreeData', data)
    }),
    this.$on('detailLoader', function(data) {
      this.$parent.$emit('detailLoader', bool)
    })
  }
}
</script>

<style scoped>

  .treeview {
    text-align: left;
    margin-left: -1px;
    margin-top: -1px;
    width: calc(100% + 1px);
  }

  .treeview .list-group div li {
    border-bottom: 0;
    border-radius: 0;
  }

  .treeview .list-group {
    margin-bottom: 0px;
    cursor: pointer;
  }

  .treeview .list-group-item {
    cursor: pointer;
  }

  .treeview span.indent {
    margin-left: 10px;
    margin-right: 10px;
  }

  .treeview span.icon {
    width: 12px;
    margin-right: 5px;
  }

  .treeview .node-disabled {
    color: silver;
    cursor: not-allowed;
  }

  .fontLg {
    font-size: 16px;
    border-radius: 0;
  }

  .list-group .active:hover {
    background-color: #337ab7 !important;
  }

  .list-group .list-group-item:hover {
    background-color: #f1f1f1;
  }

  span {
    cursor: pointer;
  }

  .fa-stop {
    font-size: 10px;
  }

  .fa-stop:before {
    position: relative;
    top: -2px;
  }
  
</style> -->