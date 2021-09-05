<template>
    <div class="balls-wrapper">
        <div class="columns is-mobile">
            <div v-for="k in 5" :key="k" class="column">
                <div class="label has-text-danger letter is-large">
                    {{letters[k]}}
                </div>
                <div
                    v-for="i in 15"
                    :key="i"
                    class="ball"
                    :class="{'has-background-primary':ballSelected(i+(k-1)*15), 'has-text-white':ballSelected(i+(k-1)*15)}"
                >
                    <span>{{i + (k-1)*15}}</span>
                </div>
            </div>
        </div>
        <div class="columns is-gapless has-text-centered is-mobile" style="margin-bottom: 0">
            <div class="column" @click="ballModal=true">
                <span class="title is-5 has-text-danger" v-if="newBall === 0">--</span>
                <span class="title is-5 has-text-danger" v-if="newBall > 0">{{ballLetter(newBall)}}{{newBall}}</span>
                <label class="label is-small">Last</label>
            </div>
            <div class="column" v-if="gameStarted">
                <span class="title is-5 has-text-danger" v-if="timeUntilNextDraw > 0">{{timeUntilNextDraw}} seconds</span>
                <span class="title is-5 has-text-danger" v-if="timeUntilNextDraw < 0 && balls.length < 75">Pending <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></span>
                <span class="title is-5 has-text-danger" v-if="timeUntilNextDraw < 0 && balls.length >= 75">All Drawn</span>
                <label class="label is-small">Next</label>
            </div>
            <div class="column" v-if="!gameStarted">
                <a v-tooltip='"New balls will draw as soon as " + minCardsPerGame + " cards have been sold."'>
                    <span class="icon is-small has-text-danger"><i class="fas fa-info-circle"></i></span>
                </a>
                <label class="label is-small">Next</label>
            </div>
        </div>
        <div class="modal" :class="{'is-active':ballModal}">
            <div class="modal-background" @click="ballModal=false"></div>
            <div class="modal-content has-text-centered">
                <h2 class="title has-text-white">New Ball Dropping</h2>
                <div class="columns">
                    <div class="column is-one-third is-offset-one-third">
                        <div class="box">
                            <figure class="image is-square">
                                <span v-if="!ballSpinning" class="static-ball">{{newBall}}</span>
                                <img src="../assets/images/static-ball.png" v-if="!ballSpinning" />
                                <img src="../assets/images/spinning-ball.gif" v-if="ballSpinning" />
                            </figure>
                        </div>
                    </div>
                </div>

            </div>
            <button class="modal-close is-large" aria-label="close" @click="ballModal=false"></button>
        </div>
    </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'Balls',
    data: function() {
      return {
        balls: [],
        chosenBalls: [],
        gameRound: 0,
        currentTokenId: 0,
        gameTokenFloor: '',
        minCardsPerGame: '',
        newBall: 0,
        ballDraws: {},
        ballModal: false,
        gameStarted: false,

        ballSpinning: true,

        lastBallDrawTime: '',
        ballDrawTime: '',
        timeUntilNextDraw: '',

        letters: {
          1: 'B',
          2: 'I',
          3: 'N',
          4: 'G',
          5: 'O'
        },
      }
    },
    components: {
    },
    watch: {
      refreshBalls: async function() {
        this.loadBalls();
      }
    },
    props: {
      account: String,
      contract: Object,
      refreshBalls: Number,
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
        this.currentTokenId = parseInt(response.token);

        const query = `
            query {
                game(id: ${this.gameRound}) {
                    balls(orderBy: drawtime, orderDirection: asc) {
                      ball,
                      drawtime
                    }
                }
            }
        `;
        response = await this.graphClient.query(query).toPromise();
        if(response.data.game && response.data.game.balls.length > 0) {
          this.balls = [];
          for(let i=0; i<response.data.game.balls.length; i++) {
            let ball = parseInt(response.data.game.balls[i].ball);
            this.balls[this.balls.length] = ball;
            this.ballDraws[ball] = parseInt(response.data.game.balls[i].drawtime);
            this.newBall = ball;
          }
        }
        this.balls.sort(function(a, b) {
          return a - b;
        });

        this.lastBallTime = parseInt(await this.contract.lastBallTime.call());
        this.ballDrawTime = parseInt(await this.contract.ballDrawTime.call());
        this.timeUntilDraw();

        this.minCardsPerGame = parseInt(await this.contract.minCards.call());
        this.gameTokenFloor = parseInt(await this.contract.gameFloor.call());

        if(this.currentTokenId - this.gameTokenFloor > this.minCardsPerGame) {
          this.gameStarted = true;
        }
      },
      ballListener: async function(event) {
        this.newBall = parseInt(event.args.ball);
        let found = false;
        for(let i=0; i<this.balls.length; i++) {
          if(this.balls[i] === this.newBall) {
            found = true;
          }
        }
        if(!found) {
          this.balls.push(this.newBall);
          this.ballDraws[this.newBall] = Date.now() / 1000;
          this.balls.sort(function(a, b) {
            return a - b;
          });
          this.$emit('newball');
          this.ballSpinning = true;
          this.ballModal = true;
          setTimeout(this.showBall, 2000);
        }
      },
      formatTime: function(num) {
        if(num) {
          return moment(num*1000).format('MMM Do YYYY, h:mm:ss a');
        } else {
          return '--';
        }
      },
      ballSelected: function(num) {
        for(let i=0; i<this.balls.length; i++) {
          if(this.balls[i] === num) {
            return true;
          }
        }
      },
      ballLetter: function(num) {
        return this.letters[Math.floor(num / 15) + 1];
      },
      timeUntilDraw: function() {
        this.timeUntilNextDraw = Math.round(((this.lastBallTime*1000 + this.ballDrawTime*1000) - Date.now()) / 1000);
        setTimeout(this.timeUntilDraw, 1000);
      },
      showBall: function() {
        this.ballSpinning = false;
      },
      hideBallModal: function() {
        this.ballModal = false;
      }

    }
  }
</script>

<style scoped>
    .ball {
        font-family: "Source Code Pro";
        margin-bottom: 0.2em;
        border-radius: 4px;
    }
    .static-ball {
        font-family: "Source Code Pro";
        position: absolute;
        left: 25px;
        top: 15px;
        font-size: 4em;
    }
</style>
