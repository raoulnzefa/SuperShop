<template>
    <div class = "container cart">
        <div class = "row justify-content-center">
            <div class = "col-6">

                <ul class="list-group">
                    <li class="list-group-item flex-column  align-items-start" v-for="(item,index) in cart" :key="item.key">
                        {{ item.name }}
                        <div style="float:right">
                            <a href="#" class="badge badge-secondary" @click="modify(index, 1)">+</a>
                            <span class="badge badge-primary badge-pill">{{ item.cnt }}</span>
                            <a href="#" class="badge badge-secondary" @click="modify(index, -1)">-</a>
                        </div>
                    </li>
                </ul>
                <hr>
                <button class="btn btn-primary btn-lg btn-block" @click="placeOrder()">Przejdź do kasy</button>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import bus from './bus.js'

export default {
    data: function() {
        return {
            cart: []
        }
    },
    created: function() {
        axios.get('/cart')
        .then(res => {
            this.cart = res.data;
        })
        .catch(e => {
            console.log(e);
        });
    },
    methods: {
        modify: function(ind, cnt) {
            this.cart[ind].cnt += cnt;
            if(this.cart[ind].cnt < 0) {
                this.cart[ind].cnt = 0;
            }
            var newcnt = this.cart[ind].cnt;
            var key = this.cart[ind].key;
            axios.get('/cart/add/' + key + '/' + cnt)
            .then(res => {
                if(newcnt == 0) {
                    this.cart.splice(ind, 1);
                }
                bus.$emit('cartchanged', res.data.items);
            })
            .catch(() => {
                this.cart[ind].cnt -= cnt;
            });
        },
        placeOrder: function() {
            axios.get('/cart/placeorder')
            .then(res => {
                if(!res.data.errorMsg) {
                    this.$emit('selectview', 'Shop');
                    bus.$emit('cartchanged', 0);
                } else {
                    console.log(res.data.errorMsg);
                }
            })
            .catch(e => {
                console.log(e);
            });
        }
    }
}
</script>

<style>
.cart {
    margin: 40px auto;
}
</style>