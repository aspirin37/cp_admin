<template>
    <div class="reg" style="background-color:#ccc;min-height:100vh;">
        <div class="container">
            <div class="row" style="display: flex;justify-content: center;">
                <div class="col-sm-5 text">
                    <div class="form-box" v-if="!isSMSCode">
                        <div class="form-top">
                            <div class="text-center">
                                <h2 class="header">Регистрация</h2>
                            </div>
                        </div>
                        <div class="form-bottom">
                            <p>Уже есть аккаунт?
                                <router-link :to="{ path: '/' }">Вход</router-link>
                            </p>
                            <form class="registration-form" onsubmit="return false">
                                <div class="form-group">
                                    <select class="form-control form-control-lg" v-model="userAdminPanelType">
                                        <option disabled="disabled" selected value="">Выберите пользователя</option> 
                                        <option v-for="userType in userTypes" :value="userType.value">{{ userType.type }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="sr-only" for="phoneNumber">Номер телефона</label>
                                    <the-mask v-model="phoneNumber" mask="7(###)###-####" type="text" class="form-control form-control-lg" id="phoneNumber" required placeholder="Номер телефона" />
                                </div>
                                <div class="form-group">
                                    <label class="sr-only" for="password">Пароль</label>
                                    <input v-model="password" v-validate="" type="password" name="password" placeholder="Пароль" class="form-control form-control-lg" id="password" required>
                                    <!-- <span v-show="errors.has('password')">{{ errors.first('password') }}</span> -->
                                </div>
                                <div class="form-group">
                                    <label class="sr-only" for="confirmPassword">Подтвердите пароль</label>
                                    <input v-model="confirmPassword" v-validate="" type="password" name="confirmPassword" placeholder="Подтвердите пароль" class="form-control form-control-lg" id="confirmPassword" required>
                                    <!-- <span v-show="errors.has('confirmPassword')">{{ errors.first('confirmPassword') }}</span> -->
                                </div>
                                <button type="submit" @click="register" class="btn btn-lg btn-primary btn-block" :disabled="phoneNumber == '' || password == '' || confirmPassword == '' || password != confirmPassword || password.length < 6">Зарегистрироваться</button>
                            </form>
                        </div>
                    </div>
                    
                    <div class="form-box" v-if="isSMSCode">
                        <div class="form-top">
                            <div class="text-center">
                                <h2 class="header">Подтверждение номера</h2>
                                <p>На Ваш номер телефона был отправлен код подтверждения, введите его в поле ниже</p>
                            </div>
                        </div>
                        <div class="form-bottom">
                            <form class="registration-form" onsubmit="return false">
                                <div class="form-group">
                                    <label class="sr-only" for="smscode">Код из СМС</label>
                                    <input v-model="sms" type="text" class="form-control" placeholder="Код из СМС" id="smscode" required v-mask="'XXXXXX'">
                                </div>
                                <button @click="sendSms" type="submit" class="btn btn-lg btn-success btn-block" :disabled="sms == ''"><i class="fa fa-send"></i> Отправить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import host from '../data/host.js'
import {
    TheMask
} from 'vue-the-mask'

export default {
    name: 'reg',
    components: {
        TheMask
    },
    data() {
        return {
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            sms: '',
            userAdminPanelType: '',
            isSMSCode: false,
            userTypes: [{
                type: 'Логист',
                value: 4
            },
            {
                type: 'Экспедитор',
                value: 5
            },
            {
                type: 'Бухгалтер',
                value: 6
            },
            {
                type: 'Снабжение',
                value: 7
            },
            {
                type: 'Маркетолог',
                value: 8
            },
            {
                type: 'Тех. поддержка',
                value: 9
            },
            {
                type: 'Клиент. поддержка',
                value: 10
            }
            ]
        }
    },
    methods: {
        register() {
            this.$http.post(`${host.host}/Account/User/AdminPanel`, {
                phone: '7' + this.phoneNumber,
                password: this.password,
                confirmPassword: this.confirmPassword,
                userAdminPanelType: this.userAdminPanelType
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.body.error) return toastr.error("Ошибка сервера")
                    this.isSMSCode = true
            }, response => {
                toastr.error("Ошибка сервера")
            })
        },
        sendSms() {
            this.$http.put(`${host.host}/Account/UserRegCode/AdminPanel`, {
                phone: '7' + this.phoneNumber,
                password: this.password,
                code: this.sms,
                userAdminPanelType: this.userAdminPanelType
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.body.error) return toastr.error("Ошибка сервера")
                    let data = JSON.parse(response.body.model)
                localStorage.setItem('token', data.EncodedJwt)
                localStorage.setItem('userType', this.userAdminPanelType)
                this.$router.push('/chat')
            }, response => {
                toastr.error("Ошибка сервера")
            })
        }
    },
    created() {
        if (localStorage.getItem('token')) return this.$router.push('/stats')
    }
}
</script>

<style scoped src="../assets/login.css">

</style>
