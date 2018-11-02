<template>
  <div class = "container-fluid">
    <div class = "row">
      <Categories :current="category" @catswitch="val => changeCategory(val)" />
      <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3">
        <keep-alive>
          <component 
            :is="currentView" 
            v-bind="props"
            @selectview="view => selectView(view)"
            @productclicked="key => clicked(key)" 
            @back="goBack()" />
        </keep-alive>
      </main>
    </div>
  </div>
</template>

<script>
import Products from './Products.vue'
import Details from './Details.vue'
import Categories from './Categories.vue'

export default {
  data: function() {
    return {
      props: { category: 0 },
      category: 0,
      currentView: 'Products'
    }
  },
  components: {
    Products,
    Details,
    Categories
  },
  methods: {
    clicked: function(key) {
      this.props = { id: key };
      this.currentView = 'Details';
    },
    goBack: function() {
      this.props = { category: this.category };
      this.currentView = 'Products';
    },
    changeCategory: function(val) {
      this.category = val;
      this.props = { category: val };
      this.currentView = 'Products';
    },
    selectView: function(view) { this.$emit('selectview', view); }
  }
}
</script>

