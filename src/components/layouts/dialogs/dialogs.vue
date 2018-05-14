<template>
    <div class="col-lg-4">
        <div class="card mb-3">
            <div class="card-header">Диалоги</div>
            <div class="list-group list-group-flush small" style="max-height: 470px;overflow-y: auto;">
                <a href="#" class="list-group-item list-group-item-action" v-for="dialog in dialogs" @click="openDialog(dialog.Id)">
                    <div class="media">
                        <img class="d-flex mr-3 rounded-circle" src="https://placehold.it/45x45" alt="">
                        <div class="media-body">
                            <strong>{{ dialog.CreatorName }}</strong><br>
                            <span v-html="dialog.LastMessage.replace(/¤/g, '\n')"></span>
                            <div class="text-muted smaller">{{dialog.CreationTime | formatDate}}</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import host from '../data/host.js'
export default {
    data() {
        return {
            newMessageText: "",
            partition: 0
        }
    },
    methods: {
        openDialog(id) {
            this.$parent.$emit('openDialog', id)
        }
    },
    props: ['dialogs']
}
</script>


<style scoped>
  .container-fluid {
    margin-top: 55px;
  }
  .btn-new-ticket {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
  }
</style>

