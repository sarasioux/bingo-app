<template>
    <div class="ball has-background-light">
        <h1 class="title is-2">{{value}}</h1>
    </div>
</template>

<script>
  export default {
    name: 'Ball',
    data: function() {
      return {
      }
    },
    watch: {
    },
    props: {
      value: Number
    },
    mounted: async function() {
    },
    methods: {
    }
  }
</script>

<style scoped>
    .ball {
        display: inline-block;
        padding: 1.5em;
        border-radius: 100px;
        width: 96px;
        margin: 0.2em 0.5em;
        font-family: "Source Code Pro";

    }
</style>
