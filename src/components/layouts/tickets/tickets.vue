<template>
    <div class="col-lg-4">
        <div class="card mb-3">
            <div class="card-header">Диалоги</div>
            <div class="list-group list-group-flush small" style="max-height: 470px;overflow-y: auto;">
                <a href="#" class="list-group-item list-group-item-action" v-for="ticket in tickets" @click="openTickes(ticket.Id)">
                    <div class="media">
                        <img class="d-flex mr-3 rounded-circle" src="https://placehold.it/45x45" alt="">
                        <div class="media-body">
                            <span class="badge badge-success">Активный</span>
                            <strong>{{ ticket.CreatorName }}</strong><br>
                            <span v-html="ticket.CreationMessage.replace(/¤/g, '\n')"></span>
                            <div class="text-muted smaller">{{ticket.CreationTime | formatDate}}</div>
                        </div>
                    </div>
                </a>
            </div>
            <a class="btn btn-primary btn-new-ticket" href="#" data-toggle="modal" data-target="#newTicket">Создать новый тикет</a>
        </div>
        <div class="modal fade" id="newTicket" tabindex="-1" role="dialog" aria-labelledby="newTicketLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="newTicketLabel">Новый тикет</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="message-text" class="form-control-label">Сообщение:</label>
                                <textarea v-model="newMessageText" class="form-control" id="message-text"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary"  :disabled="newMessageText == ''" @click="newTicket(partition, newMessageText)">Создать новвый тикет</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newMessageText: "",
            partition: 0
        }
    },
    methods: {
        openTickes(id) {
            this.$parent.$emit('openTickes', id)
        },
        newTicket(partition, newMessageText) {
            this.$parent.$emit('newTicket', partition, newMessageText)
        }
    },
    props: ['tickets']
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

