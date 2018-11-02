<template>
  <div class = "container-fluid">
    <div class = "row">
      <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
        <ul class="nav nav-pills flex-column">
            <li :class="['nav-item', { active: isViewActive('ManageProducts') }]">
                <a class="nav-link" href="#" @click="selectView('ManageProducts')">Produkty</a>
            </li>
            <li :class="['nav-item', { active: isViewActive('ManageUsers') }]">
                <a class="nav-link" href="#" @click="selectView('ManageUsers')">Użytkownicy</a>
            </li>
            <li :class="['nav-item', { active: isViewActive('ManageOrders') }]">
                <a class="nav-link" href="#" @click="selectView('ManageOrders')">Zamówienia</a>
            </li>
        </ul>
    </nav>
      <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3">
          <component 
            :is="currentView" 
            v-bind="props"
            @editproduct="key => editProduct(key)" 
            @back="selectView('ManageProducts')" />
      </main>
    </div>
  </div>
</template>

<script>
import ManageProducts from './ManageProducts.vue'
import ManageUsers from './ManageUsers.vue'
import ManageOrders from './ManageOrders.vue'
import EditProduct from './EditProduct.vue'

export default {
  data: function() {
    return {
      props: {},
      currentView: 'ManageProducts'
    }
  },
  components: {
    ManageProducts,
    ManageUsers,
    ManageOrders,
    EditProduct
  },
  methods: {
    isViewActive: function(view) { return this.currentView == view; },
    selectView: function(view) { 
        this.currentView = view;
        this.props = {};
    },
    editProduct: function(key) { 
        this.currentView = 'EditProduct'; 
        this.props = { itemkey: key };
    }
  }
}
</script>

