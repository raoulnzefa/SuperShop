<template>
    <div class="row justify-content-center" style="margin: 20px auto">
        <div class = "col-10">
            <div class="row justify-content-between" style="margin-bottom: 10px">
                <div class="col-6">
                    <h2>Zarządzaj produktami</h2>
                </div>
                <div class="col-3">
                    <button class="btn btn-block btn-primary" @click="editProduct('')">Dodaj</button>
                </div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nazwa</th>
                    <th scope="col">Kategoria</th>
                    <th scope="col">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items" :key="item.key">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ item.name }}</td>
                        <td>{{ item.category }}</td>
                        <td>
                            <a href="#" @click="editProduct(item.key)">Edytuj</a> | 
                            <a href="#" @click="remove(index)">Usuń</a>
                        </td>
                    </tr>
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
            items: []
        }
    },
    created: function() {
        axios.get('/items')
        .then(res => {
            this.items = res.data;
        })
        .catch(e => {
            console.log(e);
        });
    },
    methods: {
        remove: function(index) {
            var key = this.items[index].key;
            axios.get('/item/' + key + '/remove')
            .then(() => {
                this.items.splice(index, 1);
            })
            .catch(e => {
                console.log(e);
            });
        },
        editProduct: function(key) { this.$emit('editproduct', key); }
    }
}
</script>