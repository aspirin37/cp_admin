<template>
  <div class="tree" id="treesDetails"></div>
</template>

<script>
import host from '../../data/host.js'

export default {
  name: 'tree',
  props: ['data', 'vehid', 'carModel', 'openNode', 'carId'],
  watch: {
    openNode: function(node) {
      $("#treesDetails").jstree("destroy");
      this.openNode = node
      this.getTree()
    }
  },
  data() {
    return {
      token: localStorage.getItem('token')
    }
  },
  methods: {
    changeNode(node) {
      console.log(carModel)
      for(let i=0;i<this.data.length;i++) {
        if(this.data[i].id == node) this.getPicAndDetails(this.data[i])
      }
      $(document).ready(function() {
        $('#treesTypicalDetails').jstree("deselect_all");
        $('#treesDetails').on('ready.jstree', function() {
          $("#treesDetails").jstree()._open_to(node);
          $("#treesDetails").jstree("select_node", node);
        })
      })
    },
    getPicAndDetails(detail) {
      if(detail.parent == 'root') return false

      let parseModel = this.carModel.replace(/ /g,'')
      this.$parent.$emit('detailLoader', true)
      this.$parent.$emit('picLoader', true)
      this.$http.get(`${host.host}/Catalog/Parts?userCarId=${this.carId}&nodeId=${detail.id}`, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        if(response.body.error == true) {
          this.$parent.$emit('detailLoader', false)
          this.$parent.$emit('picLoader', false)
          return toastr.error('Ошибка сервера')
        }
        this.$parent.$emit('detailLoader', false)
        let data = response.body
        //Переводим на рестфул
        data.forEach((it) => {
          it.Id = it.id
          it.TreeNodeId = it.treeNodeId
          it.Oem = it.oem
          it.Amount = it.amount
          it.Text = it.text
          it.Info = it.info
          it.CoordIndex = it.coordIndex
          it.Note = it.note
          it.HasLabors = it.hasLabors

          delete it.id
          delete it.treeNodeId
          delete it.oem
          delete it.amount
          delete it.text
          delete it.info
          delete it.coordIndex
          delete it.note
          delete it.hasLabors

        })
        this.$parent.$emit('getTreeData', data)
        this.$http.get(`${host.host}/Vehicle/${this.vehid}/Picture?pictureId=${detail.PictureId}`, {
          headers : {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.$parent.$emit('picLoader', false)
          let data = JSON.parse(response.data.model)
          if(data == null) return this.$parent.$emit('getPicImage', null)
          this.$parent.$emit('getPicImage', response)
          this.$parent.$emit('getCoordSchema', data.CoordSchema)
        }, response => {
          this.$parent.$emit('picLoader', false)
          return toastr.error('Ошибка сервера')
        })
      }, response => {
        this.$parent.$emit('detailLoader', false)
          this.$parent.$emit('picLoader', false)
        return toastr.error('Ошибка сервера')
      })
    },
    getTree() {
      if(this.openNode != 0) this.changeNode(this.openNode)
      let self = this;
      $(document).ready(function() {
        $("#treesDetails").jstree({
          'core': {
            data: self.data,
            themes: {
              "icons": false
            }
          }
        }).on("ready.jstree", function(e, data) {
          if(self.openNode == 0) {
            $("#treesDetails").jstree("select_node", "ul > li:first");
          }
          var Selectednode = $("#treesDetails").jstree("get_selected");
            $("#treesDetails").jstree("open_node", Selectednode, false, true);

          $('#treesDetails').on("changed.jstree", function (e, data) {
            self.getPicAndDetails(data.node.original)
          })
        })
      })
    }
  },
  created() {
    this.getTree()
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

  #treesDetails a {
    white-space: normal !important;
    height: auto;
    padding: 1px 2px;
  }

  #treesDetails {
    max-width: 100%;
  }
  
</style>