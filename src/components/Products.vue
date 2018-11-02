<template>
    <div class="album text-muted">
        <div class="row">
            <Product v-for="(value, key) in filtered" 
            :key="key" 
            :details="value" 
            :id="key" 
            @productclicked="key => clicked(key)" />
        </div>
    </div>
</template>

<script>
import Product from './product.vue'
import axios from 'axios'
import bus from './bus.js'

export default {
  props: ['category'],
  data: function() {
    return {
      items: {},
      query: ''
    }
  },
  computed: {
    filtered: function() {
      var list = {};
      var items = this.items;
      var query = this.query;
      Object.keys(items).forEach(function(key) {
        if(items[key].name.toLowerCase().indexOf(query) != -1 || items[key].description.toLowerCase().indexOf(query) != -1) {
          list[key] = items[key];
        }
      });
      return list;
    }
  },
  created: function() {
    var that = this;
    bus.$on('query', function(query) {
      that.query = query.toLowerCase();
    });
  },
  components: {
    Product
  },
  watch: {
    category: {
      immediate: true,
      handler: function(val) { this.loadItems(val); }
    }
  },
  methods: {
    clicked: function(key) { this.$emit('productclicked', key); },
    loadItems: function(category) {
      axios.get('/items/' + category)
      .then(res => {
        this.items = res.data
      })
      .catch(e => {
        console.log(e);
      });
    }
  }
}
</script>

<style>
.album {
    padding: 0 1.5rem 2rem 1.5rem;
}
</style>

