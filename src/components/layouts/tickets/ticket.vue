<template>
    <div class="col-lg-8" v-if="activeTickets.length !=0">
        <div class="card mb-3" v-if="activeTickets.Actions.length != 0">
            <div class="card-header">Текущий чат c <b>{{ activeTickets.Actions[0].ActionerName }}</b></div>
            <!--<div class="card-body text-center" style="max-height: 50vh;overflow-y: auto;">
                    <span>Выберите час слева</span>
                </div>-->
            <div class="card-body">
                <div class="card-body small bg-faded" style="padding: 0;">
                    <div class="chat">
                        <div class="media mb-2" v-for="(message, index) in activeTickets.Actions">
                            <img class="d-flex mr-3" src="https://placehold.it/45x45" alt="">
                            <div class="media-body">
                                <a class="pull-right delete" v-if="index != 0" href="#" @click="deleteMessage(index, activeTickets.Id, message.TicketActionId)"><i class="fa fa-times"></i></a>
                                <h6 class="mt-0 mb-1">
                                    <a>{{ message.ActionerName }}</a>
                                </h6>
                                <span class="pull-right text-muted">{{message.Time | formatDate}}</span>
                                <p class="mb-2" v-html="message.Message.replace(/¤/g, '<br>')"></p>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <textarea v-model.trim="messageText" @keydown="inputHandler" class="form-control" rows="4" style="resize: none;" placeholder="Написать сообщение"></textarea>
                    </div>
                    <button class="btn btn-success" :disabled="sendMessLoader || messageText == ''" @click="sendMessage(activeTickets.Id, messageText)"><i class="fa fa-send"></i> Отправить</button>
                    <img src="../../../assets/load.svg" alt="" width="40" v-if="sendMessLoader">
    
                    <div class="btn-group pull-right">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Действия</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#closeTicket">Закрыть тикет</a>
                        </div>
                    </div>
                    <div class="btn-group pull-right" style="position: relative;left: -10px;">
                        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">Перенаправить к</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">Снабжение</a>
                            <a class="dropdown-item" href="#">Маркетинг</a>
                            <a class="dropdown-item" href="#">Маркетинг</a>
                            <a class="dropdown-item" href="#">Тех.Поддержка</a>
                            <a class="dropdown-item" href="#">Логистика</a>
                            <a class="dropdown-item" href="#">Клиентская служба</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="card mb-3" v-else>
            <div class="card-header">Сообщений пока нет</div>
            <!--<div class="card-body text-center" style="max-height: 50vh;overflow-y: auto;">
                <span>Выберите час слева</span>
            </div>-->
            <div class="card-body">
                <div class="card-body small bg-faded" style="padding: 0;">
    
                    <div class="form-group">
                        <textarea v-model="messageText" class="form-control" rows="4" style="resize: none;" placeholder="Написать сообщение"></textarea>
                    </div>
                    <button class="btn btn-success" :disabled="sendMessLoader || messageText == ''" @click="sendMessage()"><i class="fa fa-send"></i> Отправить</button>
                    <img src="../../../assets/load.svg" alt="" width="40" v-if="sendMessLoader">
    
                    <div class="btn-group pull-right">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Действия</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#closeTicket">Закрыть тикет</a>
                        </div>
                    </div>
                    <div class="btn-group pull-right" style="position: relative;left: -10px;">
                        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">Перенаправить к</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">Снабжение</a>
                            <a class="dropdown-item" href="#">Маркетинг</a>
                            <a class="dropdown-item" href="#">Маркетинг</a>
                            <a class="dropdown-item" href="#">Тех.Поддержка</a>
                            <a class="dropdown-item" href="#">Логистика</a>
                            <a class="dropdown-item" href="#">Клиентская служба</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="modal fade" id="closeTicket" tabindex="-1" role="dialog" aria-labelledby="closeTicketLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="closeTicketLabel">Закрыть тикет</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="message-text" class="form-control-label">Сообщение:</label>
                                <textarea v-model="closeText" class="form-control" id="message-text"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" :disabled="closeText == ''" @click="closeTicket(activeTickets.Id, closeText)">Закрыть тикет</button>
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
                messageText: "",
                closeText: ""
            }
        },
        methods: {
            inputHandler(e) {
                if (e.keyCode === 13 && !e.shiftKey && this.messageText != '') {
                    e.preventDefault();
                    this.sendMessage();
                }
            },
            sendMessage() {
                this.$parent.$emit('sendMessage', this.activeTickets.Id, this.messageText.replace(/\n/g, "¤"))
                this.messageText = ''
                setTimeout('$(".chat").scrollTop(99999)', 1000)
            },
            closeTicket(id, closeText) {
                this.$parent.$emit('closeTicket', id, closeText)
                setTimeout('$(".chat").scrollTop(99999)', 1000)
            },
            deleteMessage(index, id, messageId) {
                this.$parent.$emit('deleteMessage', index, id, messageId)
            }
        },
        props: ['activeTickets', 'sendMessLoader'],
        created() {
            setTimeout('$(".chat").scrollTop(99999)', 0)
        }
    }
</script>

<style lang="sass" scoped>
    .container-fluid
        margin-top: 55px

    .chat
        overflow-y: auto
        max-height: 283px
    .delete
        color: black
</style>
