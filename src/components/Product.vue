<template>
    <div class="card" @click="clicked()">
        <img v-holder="{img: '100px280', theme: 'gray', text: 'Thumbnail'}" alt="Card image cap">
        <h5>{{ details.name }}</h5>
        <p class="card-text">{{ details.description }}</p>
    </div>
</template>

<script>
export default {
    props: ['id', 'details'],
    methods: {
        clicked: function() { this.$emit('productclicked', this.id); }
    }
}
</script>

<style>
.card {
  float: left;
  width: 33.333%;
  padding: .75rem;
  margin-bottom: 2rem;
  border: 0;
}

.card > img {
  margin-bottom: .75rem;
}

.card-text {
  font-size: 85%;
}
</style>
