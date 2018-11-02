<template>
    <div class="row justify-content-center" style="margin: 20px auto">
        <div class = "col-10">
            <div class="row justify-content-between" style="margin-bottom: 10px">
                <div class="col-6">
                    <h2>Zarządzaj zamówieniami</h2>
                </div>
            </div>
            <table class="table" id="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Użytkownik</th>
                    <th scope="col">Produkty</th>
                    <th scope="col">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, index) in orders">
                        <tr :key="item.id">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ item.user.fullname }}</td>
                            <td>{{ item.cnt }}</td>
                            <td>
                                <a href="#"
                                    @click="collapse(index)" 
                                    data-toggle="collapse" 
                                    :data-target="'#collapse'+index"
                                    :aria-controls="'collapse'+index" >
                                    {{ collapsed[index] ? "Zwiń" : "Rozwiń" }}
                                </a> | 
                                <a href="#" @click="close(index)">Zamknij</a>
                            </td>
                        </tr>
                        <tr class="collapse" :id="'collapse'+index" data-parent="#table">
                            <td colspan="2">
                                <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-center"
                                    v-for="(product, index1) in item.items" :key="index+'#'+index1">
                                    {{ product.name }}
                                    <span class="badge badge-primary badge-pill">{{ product.cnt }}</span>
                                </li>
                                </ul>
                            </td>
                            <td colspan="2"></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            orders: [],
            collapsed: []
        }
    },
    created: function() {
        axios.get('/orders')
        .then(res => {
            this.orders = res.data;
            this.collapsed = Array(this.orders.length).fill(false);
        })
        .catch(e => {
            console.log(e);
        });
    },
    methods: {
        close: function(index) {
            var id = this.orders[index].id;
            axios.get('/orders/close/' + id)
            .then(() => {
                this.orders.splice(index, 1);
            })
            .catch(e => {
                console.log(e);
            });
        },
        collapse: function(index) {
            this.collapsed[index] = !this.collapsed[index];
        }
    }
}
</script>