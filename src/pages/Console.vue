<template>
    <div class="console">

        <div class="box main-box">
            <div class="columns">
                <div class="column is-12" v-if="!isReady && isMounted">
                    <Welcome
                            v-on:connect="connectWeb3"
                            :showHelp="showHelp"
                    />
                </div>

                <div class="column is-3 game-data" v-if="isReady">
                    <div class="columns is-multiline is-mobile">
                        <div class="column">
                            <article class="message is-primary is-small" v-if="showNFT" style="height: 100%">
                                <div class="message-header">
                                    <p>NFT Prize</p>
                                    <a v-tooltip='"NFT prizes are transferred to the winner after claiming a Bingo."'>
                                        <span class="icon is-small"><i class="fas fa-info-circle is-pulled-right"></i></span>
                                    </a>
                                </div>
                                <div class="message-body">
                                    <figure class="image is-square">
                                        <img src="../assets/images/rock.png">
                                    </figure>
                                    <label class="label has-text-danger has-margin has-text-centered">Stoners Rock</label>
                                </div>
                            </article>
                            <article class="message is-primary is-small" v-if="!showNFT" style="height: 100%">
                                <div class="message-header">
                                    <p>Cash Prize</p>
                                    <a v-tooltip='"Cash prizes are transferred instantly when claiming a Bingo."'>
                                        <span class="icon is-small"><i class="fas fa-info-circle is-pulled-right"></i></span>
                                    </a>
                                </div>
                                <div class="message-body has-text-centered">
                                    <br class="is-hidden-touch is-hidden-desktop" />
                                    <span class="icon is-large has-text-dark"><i class="fab fa-4x fa-ethereum"></i></span>
                                    <br /><br />
                                    <h2 class="title is-5 has-text-danger">{{prizePool}} ETH</h2>
                                </div>
                            </article>
                        </div>
                        <div class="column">
                            <article class="message is-primary is-small" style="height: 100%">
                                <div class="message-header">
                                    <p>Pattern</p>
                                    <a v-tooltip='"Your card must match pattern shown here in order to claim Bingo."'>
                                        <span class="icon is-small"><i class="fas fa-info-circle is-pulled-right"></i></span>
                                    </a>
                                </div>
                                <div class="message-body">
                                    <figure class="image is-square">
                                        <img :src="'/images/' + patternImgs[pattern]">
                                    </figure>
                                    <label class="label has-text-danger has-margin has-text-centered">{{patterns[pattern]}}</label>
                                </div>
                            </article>
                        </div>
                        <div class="column is-12">
                            <article class="message is-primary is-small">
                                <div class="message-header">
                                    <p>Game {{gameRound}}</p>
                                    <a v-tooltip='"New games start automatically as soon as someone claims a Bingo."'>
                                        <span class="icon is-small"><i class="fas fa-info-circle is-pulled-right"></i></span>
                                    </a>
                                </div>
                                <div class="message-body">
                                    <Mint
                                            :account="account"
                                            :contract="contract"
                                            :weedContract="weedContract"
                                            v-on:minted="refreshCards"
                                    />
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
                <div class="column">

                    <Cards
                            v-if="isReady"
                            :account="account"
                            :contract="contract"
                            :refresh="refresh"
                            :graphClient="graphClient"
                            v-on:claimed="refreshCards"
                    />

                </div>
                <div class="column is-3">
                    <div class="box letter-box has-text-centered has-background-primary-light" v-if="isReady">
                        <Balls
                                :account="account"
                                :contract="contract"
                                :refreshBalls="refreshBalls"
                                :graphClient="graphClient"
                                v-on:newball="refreshCards"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Mint from '../components/Mint'
  import Balls from '../components/Balls'
  import Cards from '../components/Cards'
  import Welcome from '../components/Welcome'

  export default {
    name: 'Console',
    components: { Mint, Balls, Cards, Welcome },
    data: function() {
      return {
        gameRound: '',
        entered: false,
        showNFT: false,

        prizePool: 0,

        balls: {
          36: true
        },

        pattern: '',
        patterns: {
          1: 'Line',
          2: 'X',
          3: 'Full Card',
          4: 'Four Corners',
        },
        patternImgs: {
          1: 'line.png',
          2: 'x.png',
          3: 'fullcard.png',
          4: 'fourcorners.png',
        },
      }
    },
    watch: {
      isReady: function() {
        this.loadData();
      }
    },
    props: {
      isMounted: Boolean,
      isReady: Boolean,
      showHelp: Boolean,
      contract: Object,
      weedContract: Object,
      graphClient: Object,
      account: String,
      timeUntilNextDraw: Number,

      refreshBalls: Number,
      refreshCards: Function,
      refresh: Number,
    },
    mounted: async function() {
      this.loadData();
    },
    methods: {
      loadData: async function() {
        if(this.contract.address) {
          this.pattern = parseInt(await this.contract.pattern.call());
          this.prizePool = Math.round((parseInt(await this.contract.prizePool.call()) / 1e18)*1000) / 1000;
          let response = await this.contract.getCurrent.call();
          this.gameRound = parseInt(response.game);
        }
      },
      connectWeb3: function() {
        this.$emit('connect');
      }
    }
  }
</script>

<style scoped>
    .console.section {
        height: 100%;
        padding: 1em;
    }


    .mint-help {
        padding-left: 1em;
        padding-top: 0.5em;
    }

    .has-margin {
        margin-top: 0.5em;
        margin-bottom: 0;
    }

    .no-margin {
        margin: 0 !important;
    }

    .box {
        padding: 0.8em;
    }
    .letter-box {
        padding: 1.4em;
        text-align: center;
    }
    .is-scrollable {
        max-height: 90%;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0 0.5em;

    }
    .nav-col {
        padding-top: 2em;
    }


    .half-margin-bottom {
        margin-bottom: 0.5em;
    }

    .game-data {

    }

    .ball {
        font-family: "Source Code Pro";
    }

    .main-box {
        background: #0f7094 !important;
    }

    .ball.is-active {
        background: #DC2305;
        color: white;
    }
</style>
