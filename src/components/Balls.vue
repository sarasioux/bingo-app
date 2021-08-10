<template>
    <div class="balls-wrapper">
        <div class="balls">
            <Ball
                    v-for="ball in balls"
                    :key="ball"
                    :value="parseInt(ball)"
            />
        </div>
    </div>
</template>

<script>
  import Ball from './Ball'

  export default {
    name: 'Balls',
    data: function() {
      return {
        balls: [],
        chosenBalls: [],
      }
    },
    components: {
      Ball
    },
    watch: {
      refresh: async function() {
        this.loadBalls();
      }
    },
    props: {
      account: String,
      contract: Object,
      refresh: Number
    },
    mounted: async function() {
        this.loadBalls();
    },
    methods: {
      loadBalls: async function() {
        this.balls = [];
        for(let i=1; i<76; i++) {
          let ball = await this.contract.Balls(i);
          if(ball) {
            this.balls.push(i);
          }
        }
      },

    }
  }
</script>

<style scoped>
    /*
    .balls-wrapper {
        width: 100%;
        overflow-x: scroll;
    }
    .balls {
        width: 120%;
        overflow-x: scroll;
    }
    */
</style>
