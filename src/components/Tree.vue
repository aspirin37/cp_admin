<template>
  <div class="tree" id="treesDetails"></div>
</template>

<script>
import host from '../data/host.js'

export default {
  name: 'tree',
  props: ['data', 'carModel', 'vehid', 'openNode', 'carId'], 
  watch: {
    openNode: function(node) {
      $("#treesDetails").jstree("destroy");
      this.openNode = node
      this.getTree()
    }
  },
  methods: {
    changeNode(node) {
      for(let i=0;i<this.data.length;i++) {
        if(this.data[i].id == node) this.getPicAndDetails(this.data[i])
      }
      $(document).ready(function() {
        $('#treesDetails').jstree("deselect_all");
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
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
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
        this.$http.get(`${host.host}/Catalog/Parts/PictureMap?userCarId=${this.carId}&imageId=${detail.PictureId}`, {
          headers : {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          this.$parent.$emit('picLoader', false)
          let data = response.data
          data.forEach((it) => {
            it.Index = it.index
            it.X = it.x
            it.Y = it.y
            it.Width = it.width
            it.Height = it.height

            delete it.index
            delete it.x
            delete it.y
            delete it.width
            delete it.height
          })
          if(detail.PictureId == 0) return this.$parent.$emit('getPicImage', null)
          this.$parent.$emit('getPicImage', `${host.host}/Catalog/Parts/Picture/${detail.PictureId}?userCarId=${this.carId}`)
          this.$parent.$emit('getCoordSchema', data)
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
        console.log('TREEEEEEEEEEEEEEEEEEEEEE')
        console.log(self.data)
        $("#treesDetails").jstree({
          'core': {
            data: self.data,
            themes: {
              "icons": false
            }
          },
          'plugins': ['sort']
        }).on("ready.jstree", function(e, data) {
          if(self.openNode == 0) {
            $("#treesDetails").jstree("select_node", "ul > li:first");
          }

          $("#treesDetails").bind("select_node.jstree", function (e, data) {
            data.instance.toggle_node(data.node);
          });
          
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

    console.log('TREEE')
    console.log(this)
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
    white-space: pre-line !important;
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