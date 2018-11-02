<template>
    <div class="container" style="margin-top:40px">

      <div class="alert alert-danger" role="alert" v-show="error!=''">
        {{ error }}
      </div>

      <div class="form-signin">
        <form @submit.prevent="login()">
          <h2 class="form-signin-heading">Please sign in</h2>
          <label for="inputLogin" class="sr-only">Username</label>
          <input 
              v-model="username" 
              type="text" 
              id="inputLogin" 
              class="form-control" 
              placeholder="Username" 
              required autofocus>
          <label for="inputPassword" class="sr-only">Password</label>
          <input 
              v-model="password"
              type="password" 
              id="inputPassword" 
              class="form-control" 
              placeholder="Password" 
              required>
          <div class="checkbox">
            <label>
              <input type="checkbox" value="remember-me" v-model="remember"> Remember me
            </label>
          </div>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
        <div style="margin-top: 1em">
          <a href="#" @click="selectView('Register')">Nie masz konta? Zarejestruj się.</a>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: function () {
        return {
            username: '',
            password: '',
            remember: false,
            error: ''
        }
    },
    methods: {
        login: function() {
          axios.post('/login', {
            username: this.username,
            password: this.password,
            remember: this.remember
          })
          .then(res => {
            if(!res.data.errorMsg) {
              this.$emit('userlogged', res.data.user);
            } else {
              this.error = res.data.errorMsg;
            }
          })
          .catch(e => {
            console.log(e);
            this.error = e;
          });
        },
        selectView: function(view) { this.$emit('selectview', view); }
    }
}
</script>


<style>
.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>

