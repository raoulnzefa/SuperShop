<template>
  <div class = "container registration">

    <div class="alert alert-danger" role="alert" v-show="error!=''">
        {{ error }}
    </div>

    <div class = "row justify-content-center">

        <div class="col-md-8">
          <h4 class="mb-3">Zarejestruj się</h4>
          <form @submit.prevent="register()">
            <div class="mb-3">
                <label for="username">Full name</label>
                <input type="text" class="form-control" placeholder="Full name" v-model="fullname" required>
            </div>

            <div class="mb-3">
              <label for="username">Username</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">@</span>
                </div>
                <input type="text" class="form-control" placeholder="Username" v-model="username" required>
              </div>
            </div>

            <div class="mb-3">
              <label for="email">Hasło</label>
              <input type="password" class="form-control" v-model="password" placeholder="Password">
            </div>

            <div class="mb-3">
              <label for="email">Powtórz hasło</label>
              <input type="password" class="form-control" v-model="repeatpassword" placeholder="Repeat password">
            </div>

            <button class="btn btn-primary btn-lg btn-block" type="submit">Zarejestruj się</button>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    data: function () {
        return {
            fullname: '',
            username: '',
            password: '',
            repeatpassword: '',
            error: ''
        }
    },
    methods: {
        register: function() {
            if(this.password != this.repeatpassword) {
                this.error = true;
                return;
            }
            axios.post('/register', {
                username: this.username,
                fullname: this.fullname,
                password: this.password
            })
            .then(res => {
                if(!res.data.errorMsg) {
                    this.$emit('userlogged', res.data.user);
                } else {
                    this.error = res.data.errorMsg;
                }
            })
            .catch(e => {
                this.error = 'Wystąpił błąd.';
            });
        },
    }
}
</script>

<style>
.registration {
    margin-top: 40px;
    margin-bottom: 40px;
    max-width: 720px;
}
</style>