<template>
    <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
        <ul class="nav nav-pills flex-column">
            <li class="nav-item">
                <a class="nav-link disabled" href="#">{{ currentData.name }}</a>
            </li>
            <li class="nav-item" v-if="currentData.parent != -1">
                <a class="nav-link" href="#" @click="clicked(currentData.parent)">Do góry</a>
            </li>
        </ul>
        <hr>
        <ul class="nav nav-pills flex-column">
            <li class="nav-item" v-for="item in categories" :key="item.id">
                <a class="nav-link" href="#" @click="clicked(item.id)">{{ item.name }}</a>
            </li>
        </ul>
    </nav>
</template>

<script>
import axios from 'axios'

export default {
    props: ['current'],
    data: function() {
        return {
            currentData: {},
            categories: []
        }
    },
    methods: {
        loadCategories: function(parent) {
            axios.get('/categories/' + parent)
            .then(res => {
                this.currentData = res.data[0];
                this.categories = res.data.splice(1);
            })
            .catch(e => {
                console.log(e);
            });
        },
        clicked: function(id) {
            this.$emit('catswitch', id);
        }
    },
    watch: {
        current: {
            immediate: true,
            handler: function(val) { this.loadCategories(val); }
        }
    }
}
</script>

<style>
.sidebar {
  position: fixed;
  top: 51px;
  bottom: 0;
  left: 0;
  z-index: 1000;
  padding: 20px 0;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
  border-right: 1px solid #eee;
}

.sidebar .nav-item {
  width: 100%;
}

.sidebar .nav-item + .nav-item {
  margin-left: 0;
}

.sidebar .nav-link {
  border-radius: 0;
}
</style>