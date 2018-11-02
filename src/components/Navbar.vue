<template>
    <header>
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="#">SuperShop</a> 
        <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent"> 
            <ul class="navbar-nav mr-auto"> 
                <li v-bind:class="['nav-item', { active: isViewActive('Shop') }]"> 
                <a class="nav-link" @click="selectView('Shop')" href="#">Shop</a> 
                </li> 
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <input v-model="query" @input="querychanged()" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            </form>
            <ul class="navbar-nav">
                <template v-if="logged">
                <li class="nav-item" v-if="admin"> 
                    <a class="nav-link" href="#" @click="selectView('AdminPanel')">Admin</a> 
                </li> 
                <li class="nav-item"> 
                    <a class="nav-link" href="#" @click="selectView('Cart')">Koszyk ({{ itemsInCart }})</a> 
                </li> 
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ fullname }}
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#" @click="logout()">Wyloguj</a>
                    </div>
                </li>
                </template>
                <li v-else class="nav-item">
                    <button class="btn btn-outline-light" href="#" @click="selectView('Login')">Zaloguj się</button>
                </li>
            </ul>
        </div> 
      </nav>
    </header>
</template>

<script>
import axios from 'axios'
import bus from './bus.js'

export default {
    props: ['currentView', 'logged'],
    data: function () {
        return {
            fullname: '',
            admin: false,
            itemsInCart: { count: 0 },
            query: ''
        }
    },
    mounted: function() {
        var that = this;
        bus.$on('cartchanged', function(cnt) {
            that.itemsInCart = cnt;
        });
    },
    methods: {
        querychanged: function() { 
            bus.$emit('query', this.query); 
            this.$emit('selectview', 'Shop');
        },
        isViewActive: function(view) { return this.currentView == view; },
        selectView: function(view) { this.$emit('selectview', view); },
        loadUserData: function() {
            axios.get('/user/info')
            .then(res => {
                this.fullname = res.data.fullname;
                this.itemsInCart = res.data.items;
                this.admin = res.data.admin;
            })
            .catch(e => {
                console.log(e);
            });
        },
        logout: function() { this.$emit('logout'); }
    },
    watch: {
        logged: {
            immediate: true,
            handler: function(val) { 
                if(val == true) {
                    this.loadUserData(); 
                }
            }
        }
    }
}
</script>