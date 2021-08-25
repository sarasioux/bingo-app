<template>
    <div class="ball has-background-light"
         :class="{'has-background-warning':value === newBall}"
         v-tooltip="formatTime(drawtime)"
    >
        <h1 class="title is-2">{{value}}</h1>
    </div>
</template>

<script>
  import moment from 'moment';
  export default {
    name: 'Ball',
    data: function() {
      return {
      }
    },
    watch: {
    },
    props: {
      value: Number,
      newBall: Number,
      drawtime: Number
    },
    mounted: async function() {
    },
    methods: {
      formatTime: function(num) {
        return moment(num*1000).format('MMMM Do YYYY, h:mm:ss a');
      }
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
