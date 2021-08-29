<template>
    <div class="home">
        <div class="section has-background-danger has-background-logo">
            <div class="columns">
                <div class="column is-3">
                    <div class="columns is-mobile" v-if="isReady">
                        <div class="column is-6 has-text-centered">
                            <div class="box">
                                <h4 class="subtitle is-6">Round</h4>
                                <h3 class="title is-5 has-text-primary">{{gameRound}}</h3>
                            </div>
                        </div>
                        <div class="column is-6 has-text-centered">
                            <div class="box">
                                <h4 class="subtitle is-6">Next Draw</h4>
                                <h3 class="title is-5 has-text-primary" v-if="timeUntilNextDraw > 0">{{timeUntilNextDraw}} secs</h3>
                                <h3 class="title is-5 has-text-primary" v-if="timeUntilNextDraw < 0">Pending <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></h3>
                            </div>
                        </div>
                    </div>
                    <br />
                    <h1 class="title has-text-centered has-text-white is-4">Welcome to the world's first blockchain based bingo.</h1>
                </div>
                <div class="column has-text-centered">
                    <img src="../../public/logo3.png" />
                </div>
                <div class="column is-3">
                    <div class="columns is-mobile" v-if="isReady">
                        <div class="column is-6 has-text-centered">
                            <div class="box">
                                <h4 class="subtitle is-6">Pattern</h4>
                                <h3 class="title is-5 has-text-primary">{{patterns[pattern]}}</h3>
                            </div>
                        </div>
                        <div class="column is-6 has-text-centered">
                            <div class="box">
                                <h4 class="subtitle is-6">Prize Pool</h4>
                                <h3 class="title is-5 has-text-primary"><span class="icon"><i class="fab fa-ethereum"></i></span>{{prizePool}}</h3>
                            </div>
                        </div>
                    </div>

                    <div class="box has-text-centered" v-if="gameRound === 18">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-96x96">
                                    <img src="../assets/images/rock.png" alt="Stoners Rock">
                                </figure>
                            </div>
                            <div class="media-content">
                                <h4 class="subtitle is-6">NFT Prize</h4>
                                <p class="title is-5 has-text-primary">Stoners Rock</p>
                                <p class="subtitle is-6"><a href="https://twitter.com/mystoners">@mystoners</a></p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>

        <div class="section has-text-centered" v-if="!isReady && isMounted">
            <Welcome
                    v-on:connect="connectWeb3"
                    :showHelp="showHelp"
            />
        </div>

        <div class="section balls-section has-background-black has-text-centered" v-if="isReady && !startGame">
            <div class="title has-text-white">Next game starting soon.</div>
        </div>

        <div class="section balls-section has-background-black has-text-centered" v-if="isReady && startGame">
            <Balls
                    :account="account"
                    :contract="contract"
                    :refreshBalls="refreshBalls"
                    :graphClient="graphClient"
                    v-on:newball="refreshCards"
            />
        </div>

        <div class="section has-text-centered" v-if="isReady && startGame">
            <Mint
                    :account="account"
                    :contract="contract"
                    :weedContract="weedContract"
                    :refresh="refresh"
                    v-on:minted="refreshCards"
            />
        </div>

        <div class="section has-text-centered" v-if="isReady">
            <Cards
                    :account="account"
                    :contract="contract"
                    :refresh="refresh"
                    :graphClient="graphClient"
                    v-on:claimed="refreshCards"
            />
        </div>

        <section class="section has-background-black">
            <About
                    :ballDrawTime="ballDrawTime"
                    :contract="contract"
            />
        </section>
    </div>
</template>

<script>

  import Mint from '../components/Mint'
  import Cards from '../components/Cards'
  import Balls from '../components/Balls'
  import Welcome from '../components/Welcome'
  import About from '../components/About'

  export default {
    name: 'Home',
    data: function() {
      return {
      }
    },
    components: {
      Mint, Cards, Balls, Welcome, About
    },
    props: {
      account: String,
      contract: Object,
      weedContract: Object,
      graphClient: Object,
      ballDrawTime: Number,
      refresh: Number,
      refreshBalls: Number,
      showHelp: Boolean,
      gameRound: Number,
      pattern: Number,
      patterns: Object,
      prizePool: Number,
      startGame: Boolean,
      refreshCards: Function,
      timeUntilNextDraw: Number,
      isReady: Boolean
    },
    mounted: function() {
    },
    methods: {
      connectWeb3: function() {
        this.$emit('connect');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .rock-img {
        border-radius: 20px;
    }
    a.is-ghost:hover {
        text-decoration: none !important;
    }
    figure.logo {
        display: inline-block;
    }
    figure.smaller-logo {
        width: 600px;
        display: inline-block;
    }
    p.is-size-4 {
        line-height: 1.3em;
    }
    .small-top {
        padding-top: 1em;
    }
</style>
