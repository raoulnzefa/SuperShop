<template>
  <div id="app">
    <Navbar 
      :current-view="currentView" 
      :logged="logged"
      @selectview="view => selectView(view)" 
      @logout="logout()" />
    <component 
      :is="currentView" 
      @userlogged="usr => login(usr)" 
      @selectview="view => selectView(view)" />
  </div>
</template>

<script>
import Vue from 'vue'
var bus = new Vue();

import Shop from './components/Shop.vue'
import Navbar from './components/Navbar.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Cart from './components/Cart.vue'
import AdminPanel from './components/AdminPanel.vue'

import axios from 'axios'

export default {
  data: function() {
    return {
      currentView: 'Shop',
      logged: false
    }
  },
  methods: {
    selectView: function(view) { this.currentView = view; },
    login: function(usr) { 
      this.logged = true;
      this.currentView = 'Shop';
    },
    logout: function() {
      axios.get('/logout')
      .then(() => {
        this.logged = false;
        if(this.currentView == 'AdminPanel' || this.currentView == 'Cart') {
          this.currentView = 'Shop';
        }
      })
      .catch(e => {
        console.log(e);
      });
    }
  },
  created: function() {
    axios.get('/user/username')
    .then(res => {
      this.logged = true;
    })
    .catch(e => {
      console.log(e);
    });
  },
  components: {
    Shop,
    Navbar,
    Login,
    Register,
    Cart,
    AdminPanel
  }
}
</script>

<style>
body {
  padding-top: 3.5rem;
}
</style>
