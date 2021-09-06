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
            <div class="column" @click="ballModal=(ballModal===false)">
                <span class="title is-5 has-text-danger" v-if="newBall === 0">--</span>
                <span class="title is-5 has-text-danger" v-if="newBall > 0">{{ballLetter(newBall)}}{{newBall}}</span>
                <label class="label is-small">Last</label>
            </div>
            <div class="column" v-if="gameStarted">
                <span class="title is-5 has-text-danger" v-if="timeUntilNextDraw > 0">{{timeUntilNextDraw}} seconds</span>
                <span class="title is-5 has-text-danger" v-if="timeUntilNextDraw < 0 && balls.length < 75 && checkUpkeep">Pending <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></span>
                <span class="title is-5 has-text-danger" v-if="timeUntilNextDraw < 0 && balls.length < 75 && !checkUpkeep">Waiting <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></span>
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

        <div class="has-text-centered" v-if="ballModal">
            <h2 class="title is-4">New Ball Dropping</h2>
            <div v-if="!ballSpinning" class="title is-1 static-ball">{{newBall}}</div>
            <figure class="image is-128x128 is-inline-block" v-if="ballSpinning">
                <img src="../assets/images/spinning-ball.gif" />
            </figure>
        </div>

        <!--
        <div class="stats help has-text-left">
            <br />
            Last Ball Draw Time:
            <strong>{{formatTime(lastBallTime)}}</strong>
            <br />
            Ball Draw Time:
            <strong>{{ballDrawTime}}</strong>
            <br />
            Random Request ID:
            <strong>{{formatRequest(ballRequest)}}</strong>
            <br />
            Needs Upkeep:
            <strong>{{checkUpkeep}}</strong>
        </div>
        //-->

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

        lastBallTime: '',
        ballDrawTime: '',
        ballRequest: '',
        checkUpkeep: false,

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
        setTimeout(this.monitorBallDrop, 5000);
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

        await this.loadDrawTimes();
        this.timeUntilDraw();

        this.minCardsPerGame = parseInt(await this.contract.minCards.call());
        this.gameTokenFloor = parseInt(await this.contract.gameFloor.call());

        if(this.currentTokenId - this.gameTokenFloor > this.minCardsPerGame) {
          this.gameStarted = true;
        }
      },
      loadDrawTimes: async function() {
        this.lastBallTime = parseInt(await this.contract.lastBallTime.call());
        this.ballDrawTime = parseInt(await this.contract.ballDrawTime.call());
        this.ballRequest = await this.contract.ballRequest.call();
        let response = await this.contract.checkUpkeep.call('0x0');
        this.checkUpkeep = response.upkeepNeeded;
      },
      ballListener: async function(event) {
        console.log('New Ball Event', event);
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
          await this.loadDrawTimes();
          this.$emit('newball');
          this.ballSpinning = true;
          this.ballModal = true;
          setTimeout(this.showBall, 3000);
        }
      },
      formatTime: function(num) {
        if(num) {
          return moment(num*1000).format('MMM Do YYYY, h:mm:ss a');
        } else {
          return '--';
        }
      },
      formatRequest: function(word) {
        return word.substr(0, 5);
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
        if(this.timeUntilNextDraw <= 0) {
          this.loadDrawTimes();
        }
        setTimeout(this.timeUntilDraw, 1000);
      },
      showBall: function() {
        this.ballSpinning = false;
        setTimeout(this.hideBallModal, 6000);
      },
      hideBallModal: function() {
        this.ballModal = false;
      },
      monitorBallDrop: async function() {
        this.loadDrawTimes();
        setTimeout(this.monitorBallDrop, 2000);
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
    }
</style>
