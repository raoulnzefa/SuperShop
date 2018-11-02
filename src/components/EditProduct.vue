<template>
    <div class = "row justify-content-center" style="margin: 20px auto">

        <div class="alert alert-danger" role="alert" v-show="error!=''">
            {{ error }}
        </div>

        <div class="col-6">
            <h4>Dodaj/edytuj produkt</h4>

            <form @submit.prevent="submit()">
                <div class="mb-3">
                    <label for="key">Product key</label>
                    <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">@</span>
                    </div>
                    <input v-if="lockedkey!=''" id="key" type="text" class="form-control" placeholder="some-key" v-model="lockedkey" disabled>
                    <input v-else type="text" id="key" class="form-control" placeholder="some-key" v-model="newkey" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="name">Product name</label>
                    <input type="text" id="name" class="form-control" placeholder="Some name" v-model="details.name" required>
                </div>

                <div class="form-group">
                <label for="category">Category</label>
                <select class="form-control" id="category" v-model="details.category">
                    <option v-for="item in categories" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </option>
                </select>
                </div>

                <div class="mb-3">
                    <label for="description">Description</label>
                    <textarea id="description" class="form-control" v-model="details.description" rows="3"></textarea>
                </div>
                <button class="btn btn-primary btn-lg btn-block" type="submit">Zapisz zmiany</button>
            </form>
            <hr>
            <button class="btn btn-secondary btn-lg btn-block" @click="back()">Wróć</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props: ['itemkey'],
    data: function() {
        return {
            error: '',
            lockedkey: '',
            newkey: '',
            categories: [],
            details: {}
        }
    },
    methods: {
        loadDetails: function(key) {
            axios.get('/item/' + key)
            .then(res => {
                this.details = res.data;
            })
            .catch(e => {
                console.log(e);
            });
        },
        loadCategories: function () {
            axios.get('/categories')
            .then(res => {
                this.categories = res.data;
            })
            .catch(e => {
                console.log(e);
            });
        },
        submit: function() {
            var key = this.lockedkey;
            if(key == '') {
                key = this.newkey;
            }
            axios.post('/item/add', {
                key: key,
                data: this.details
            })
            .then(() => {
                if(this.lockedkey == '') {
                    this.lockedkey = this.newkey;
                }
            })
            .catch(e => {
                console.log(e);
            });
        },
        back: function() { this.$emit('back'); }
    },
    watch: {
        itemkey: {
            immediate: true,
            handler: function(val) {
                this.lockedkey = val;
                if(val != '') {   
                    this.loadDetails(val);
                } else {
                    this.details = {
                        name: '',
                        description: '',
                        category: 0
                    } 
                }
                this.loadCategories();
            }
        }
    }
}
</script>