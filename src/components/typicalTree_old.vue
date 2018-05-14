<!-- <template>
	<div class="typicalTre treeview">

	  <ul class="list-group">
	    <div v-for="tree in data" v-if="tree.ParentId === parent">
	      <li data-toggle="collapse" :href="'#tree'+tree.Id" class="list-group-item" v-if="tree.ParentId == 0" @click="getWorkById(tree.Id)" :class="{ active: activeTree == tree.Id }">
          <span class="fa fa-chevron-right" v-if="tree.ParentId == 0" data-toggle="collapse" :href="'#tree'+tree.Id" @click="getWorkById(tree.Id)"></span>
         {{ tree.Text }}
      </li>
      <li data-toggle="collapse" :href="'#tree'+tree.Id" class="list-group-item" v-if="tree.ParentId != 0" @click="getWorkByIdChild(tree.Id)">
          <span class="fa fa-stop" v-if="tree.ParentId != 0" @click="getWorkByIdChild(tree.Id)"></span>
         {{ tree.Text }}
      </li>
      <typical-tree :data="data" :parent="tree.Id" :id="'tree' + tree.Id" class="collapse" v-on:getData="getDataList"></typical-tree>
	    </div>
	  </ul>
	</div>
</template>

<script>
import host from '../data/host.js'
import typicalTree from './typicalTree'
export default {
	name: 'typicalTree',
	props: ['data', 'parent', 'activeTrees'],
	components: {
		typicalTree
	},
  watch: {
    activeTrees: function(val) {
      if(val == '') return false
      this.activeTree = val
    }
  },
  data() {
    return {
      activeTree: ''
    }
  },
	methods: {
    getDataList(id) {
      this.$parent.$emit('getChildLoaderTypical', true)
      this.$http.get(`${host.host}/Catalog/GetNodeLaborsTypical/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.body.model)
        this.$parent.$emit('getChildLoaderTypical', false)
        this.$parent.$emit('getChildTypicalWork', data)
      }, response => {
      })
    },
    getWorkByIdChild(id) {
      this.$emit('getData', id)
    },
    getWorkById(id) {
      this.activeTree = id
      this.$parent.$emit('getLoaderTypical', true)
      this.$http.get(`${host.host}/Catalog/GetNodeLaborsTypical/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        let data = JSON.parse(response.body.model)
        this.$parent.$emit('getLoaderTypical', false)
        this.$parent.$emit('getTypicalWork', data)
      }, response => {
      })
    }
	}
}
</script>

<style scoped>

	.treeview {
    text-align: left;
    margin-left: -1px;
    margin-top: -1px;
    width: calc(100% + 2px);
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