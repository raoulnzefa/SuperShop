<template>
  <div class = "row justify-content-center">
    <div class = "col-10">
    <div class="jumbotron">
        <h1 class="display-3">{{ details.name }}</h1>
        <p class="lead">Ciekawy tekst marketingowy.</p>
        <div class = "row justify-content-center">
            <div class = "col-2" style="margin-right:20px">
                <a class="btn btn-lg btn-primary" href="#" role="button" @click="addToCart()">Do koszyka</a>
            </div>
            <div class = "col-2">
                <a class="btn btn-lg btn-outline-secondary" href="#" role="button" @click="back()">Wróc</a>
            </div>
        </div>
    </div>

    <div class="row marketing justify-content-center">
      <div class="col">
        <h4>Produkt</h4>
        <p style="white-space: pre-wrap">{{ details.description }}</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
import bus from './bus.js'

export default {
    props: ['id'],
    data: function() {
        return {
            details: {}
        }
    },
    methods: {
        loadData: function(id) {
            axios.get('/item/' + id)
            .then(res => {
                this.details = res.data;
            })
            .catch(e => {
                console.log(e);
            });
        },
        addToCart: function() {
            axios.get('/cart/add/' + this.id)
            .then(res => {
                bus.$emit('cartchanged', res.data.items);
            })
            .catch(e => {
                this.$emit('selectview', 'Login');
            });
        },
        back: function() { this.$emit('back'); }
    },
    watch: {
        id: {
            immediate: true,
            handler: function(val) { this.loadData(val); }
        }
    }
}
</script>

<style>
/* Everything but the jumbotron gets side spacing for mobile first views */
.marketing {
  padding-right: 1rem;
  padding-left: 1rem;
}

/* Main marketing message and sign up button */
.jumbotron {
    margin-top: 2rem;
    text-align: center;
    border-bottom: .05rem solid #e5e5e5;
}
.jumbotron .btn {
  padding: .75rem 1.5rem;
  font-size: 1.5rem;
}

/* Supporting marketing content */
.marketing {
  margin: 3rem 0;
}
.marketing p + h4 {
  margin-top: 1.5rem;
}

</style>