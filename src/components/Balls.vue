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
        gameRound: ''
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
      refresh: Number,
      graphClient: Object
    },
    mounted: async function() {
        this.loadBalls();
    },
    methods: {
      loadBalls: async function() {
        let response = await this.contract.getCurrent.call();
        this.gameRound = parseInt(response.game);

        const query = `
            query {
                game(id: ${this.gameRound}) {
                    balls {
                      ball
                    }
                }
            }
        `;
        response = await this.graphClient.query(query).toPromise();
        if(response.data.game.balls.length > 0) {
          this.balls = [];
          for(let i=0; i<response.data.game.balls.length; i++) {
            this.balls.push(parseInt(response.data.game.balls[i].ball));
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
