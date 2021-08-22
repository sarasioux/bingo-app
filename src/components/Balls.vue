<template>
    <div class="balls-wrapper">
        <div class="balls" v-if="balls.length > 0">
            <h3 class="subtitle">{{balls.length}} Balls Dropped</h3>
            <Ball
                    v-for="ball in balls"
                    :key="ball"
                    :value="parseInt(ball)"
                    :newBall="newBall"
            />
        </div>
        <div class="title has-text-white" v-if="balls.length === 0">Next game starting soon.</div>
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
        gameRound: '',
        newBall: 0,
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
        this.contract.BallPicked().on('data', this.ballListener);
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
        if(response.data.game && response.data.game.balls.length > 0) {
          this.balls = [];
          for(let i=0; i<response.data.game.balls.length; i++) {
            this.balls[this.balls.length] = parseInt(response.data.game.balls[i].ball);
          }
        }
        this.balls.sort(function(a, b) {
          return a - b;
        });
      },
      ballListener: async function(event) {
        console.log('ball listener', event);
        this.newBall = parseInt(event.args.ball);
        this.balls.push(this.newBall);
        this.balls.sort(function(a, b) {
          return a - b;
        });
        this.$emit('newball');
      }

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
