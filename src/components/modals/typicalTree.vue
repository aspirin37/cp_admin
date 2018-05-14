<template>
	<div class="typicalTre treeview" id="treesTypicalDetails"></div>
</template>

<script>
import host from '../../data/host.js'

export default {
	name: 'typicalTree',
	props: ['data', 'selectedTypical'],
  watch: {
    selectedTypical: function(node) {
      this.openNode = node
      $('#treesTypicalDetails').jstree("deselect_all");
      $("#treesTypicalDetails").jstree("select_node", node);
      $("#treesTypicalDetails").jstree("deselect_node", "ul > li:first");
      this.getWorkById(node)
    }
  },
  data() {
    return {
      openNode: 0
    }
  },
	methods: {
    changeNode(node) {
      $("#treesTypicalDetails").jstree("select_node", node);
    },
    getWorkById(id) {
      this.$parent.$emit('getLoaderTypical', true)
      // this.$http.get(`${host.host}/Catalog/GetNodeLaborsTypical/${id}`, {
      //   headers: {
      //     'Authorization': 'Bearer ' + localStorage.getItem('token'),
      //     'Content-Type': 'application/json; charset=UTF-8',
      //     'Accept': 'application/json'
      //   }
      // }).then(response => {
      //   let data = JSON.parse(response.body.model)
      //   this.$parent.$emit('getLoaderTypical', false)
      //   this.$parent.$emit('getTypicalWork', data)
      //   this.openNode = 0
      // }, response => {
      // })
    },
    getTree() {
      let self = this;
      $(document).ready(function() {
        $("#treesTypicalDetails").jstree({
          'core': {
            data: self.data,
            themes: {
              "icons": false
            }
          }
        }).on("ready.jstree", function(e, data) {
          $("#treesTypicalDetails").jstree("select_node", "ul > li:first");
          var Selectednode = $("#treesTypicalDetails").jstree("get_selected");
            $("#treesTypicalDetails").jstree("open_node", Selectednode, false, true);
          $('#treesTypicalDetails').on("changed.jstree", function (e, data) {
            if(self.openNode != 0) return false
            self.getWorkById(data.node.original.id)
          })
        })
      })
    }
	},
  created() {
    if(this.selectedTypical != '') {
      this.getTree()
      let node = this.selectedTypical
      this.openNode = node
      $('#treesTypicalDetails').jstree("deselect_all");
      $("#treesTypicalDetails").jstree("select_node", node);
      $("#treesTypicalDetails").jstree("deselect_node", "ul > li:first");
      this.getWorkById(node)
    } else this.getTree()
  }
}
</script>

<style>
  
  .jstree .jstree-container-ul {
    position: relative;
    top: -20px;
    left: -20px;
  }

  .jstree-anchor, .jstree-anchor:link, .jstree-anchor:visited, .jstree-anchor:hover, .jstree-anchor:active {
    white-space: normal;
    height: auto;
    line-height: 18px;
    margin-top: 3px;
  }
  
</style>

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

</style>