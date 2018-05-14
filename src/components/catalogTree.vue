<template>
  <div class="typicalTre treeview" id="treesTypicalDetails">
  </div>
</template>

<script>
import host from '../data/host.js'

export default {
  name: 'catalogTree',
  props: ['data', 'selectedTypical', 'admin'],
  data() {
    return {
      openNode: 0,
      createdNode: {},
      movedNode: {
        id: 0,
        newParent: 0
      }
    }
  },
  watch: {
    selectedTypical: function(node) {
      this.openNode = node
      this.getWorkById(node)
    }
  },
  methods: {
    renameNode(id, text, prevText) {
      if (text != prevText) {
        this.$http.put(`${host.host}/Catalog/Typical/Nodes/Title?nodeId=${+id}&title=${text}`, {}, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type' : 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
          }
        }).then(response => {
          return toastr.success('Узел успешно переименован')
        }, response => {
          return toastr.error('Ошибка сервера')
        })
      }
    },
    createNode(parentId, node) {
      this.$http.post(`${host.host}/Catalog/Typical/Nodes`, {
        parentId: parentId,
        title: 'New node',
        categoryId: 0
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        $("#treesTypicalDetails").jstree("set_id", node, response.body.id) // переписываем сгенеренный плагином айдишник на полученный с сервака
        return toastr.success('Узел успешно создан')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    deleteNode(id) {
      this.$http.delete(`${host.host}/Catalog/Typical/Nodes?nodeId=${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        return toastr.success('Узел успешно удален')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    moveNode(nodeId, parentId) {
      this.$http.put(`${host.host}/Catalog/Typical/Nodes/Move?nodeId=${nodeId}&parentId=${parentId}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type' : 'application/json; charset=UTF-8',
          'Accept' : 'application/json'
        }
      }).then(response => {
        return toastr.success('Узел успешно перемещен')
      }, response => {
        return toastr.error('Ошибка сервера')
      })
    },
    getWorkById(id, category) {
      this.$parent.$emit('getLoaderTypical', true)
      this.$http.get(`${host.host}/Catalog/Typical/Node/${id}/Labors`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        }
      }).then(response => {
        let data = response.body
        data.forEach((it) => {
          it.isRemoved = false
          it.isEditing = false

          it.Id = it.id
          it.Type = it.type
          it.NodeId = it.nodeId
          it.Text = it.text
          it.Time = it.time

          delete it.id
          delete it.type
          delete it.nodeId
          delete it.text
          delete it.time
        })
        this.$parent.$emit('getLoaderTypical', false)
        this.$parent.$emit('getTypicalWork', data)
        this.$parent.$emit('getNodeCategory', category)
        this.openNode = 0
      }, response => {
      })
    },
    getTree() {
      let self = this;
      $(document).ready(function() {
        $('#treesTypicalDetails').jstree({
          'core': {
            data: self.data,
            dblclick_toggle: false,
            themes: { "icons": false },
            check_callback : (operation, node, parent, position, more) => {
              if (operation == 'delete_node' && parent.id == '#') return false // защищаем корень
              if (operation == 'move_node' && parent.id == '#') return false 
              if (operation == 'delete_node') return confirm('Вы действительно хотите удалить этот узел?')
              return true
            }
          },
          'plugins': ['contextmenu', 'dnd'],
        }).on("ready.jstree", (e, data) => {

          $('#treesTypicalDetails')

            .bind("select_node.jstree", (e, data) => { // переключает режим по клику на узел
              data.instance.toggle_node(data.node);
            })

            .on("changed.jstree", (e, data) => {
              self.getWorkById(data.node.original.id, data.node.data)
              self.$parent.$emit('selectNode', data.node.id)
            })

            .on("create_node.jstree", (e, data) => {
              self.createNode(data.node.parent, data.node)
            })

            .on("rename_node.jstree", (e, data) => {
              self.renameNode(data.node.id, data.text, data.old)
            })

            .on("delete_node.jstree", (e, data) => {
              self.deleteNode(data.node.id)
            })

            .on("move_node.jstree", (e, data) => {
              self.moveNode(data.node.id, data.parent)
            })

        })
      })
    }
  },
  created() {
    this.getTree()
    if (this.selectedTypical) {
      this.openNode = this.selectedTypical
      this.getWorkById(node)
    } 
  }
}
</script>

<style>
  
  .jstree .jstree-container-ul {
    position: relative;
    /*top: -20px;*/
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