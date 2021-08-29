<template>
    <div class="game has-text-centered">
        <div class="section has-background-danger is-clearfix">
            <div class="columns">
                <div class="column">eth logo</div>
                <div class="column is-2">
                    <img src="../../public/logo3.png" class="logo" />
                </div>
                <div class="column">Bingo Card</div>
            </div>
        </div>
        <div class="section body">
            <div class="container">
                <div class="columns is-gapless">
                    <div class="column is-1"></div>
                    <div class="column entrance" v-if="!entered">
                        <a @click="entered=true"><img src="../assets/images/click-to-enter.png" class="click-to-enter" /></a>
                        <img src="../assets/images/entrance.png" />
                    </div>
                    <div class="column betty" v-if="entered">
                        <div class="mintbox">
                            <button class="button is-primary">Mint</button>
                        </div>
                        <div class="chatbox has-text-centered">
                            <span v-if="!isReady">You need to connect your wallet to play Bingo.</span>
                            <span v-if="isReady && numCards > 0">You have {{numCards}} cards. What would you like to do?</span>
                        </div>
                        <div class="responsebox">
                            <div class="buttons">
                                <button class="button is-primary" @click="connectWeb3" v-if="!isReady">Connect Wallet</button>
                                <button class="button is-primary" v-if="isReady">Buy More</button>
                                <button class="button is-primary" v-if="isReady">Play Game</button>
                                <button class="button is-primary" v-if="isReady">Burn Cards</button>
                            </div>
                        </div>
                        <img src="../assets/images/betty.png" />
                    </div>
                    <div class="column is-1"></div>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="tabs is-toggle is-centered">
                <ul>
                    <li>
                        <a>
                            <span>About the Game</span>
                        </a>
                    </li>
                    <li>
                        <a>
                            <span>How to Play</span>
                        </a>
                    </li>
                    <li>
                        <a>
                            <span>Prizes</span>
                        </a>
                    </li>
                    <li>
                        <a>
                            <span>Contact</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
  export default {
    name: 'Game',
    data: function() {
      return {
        entered: false,
        numCards: '',
      }
    },
    watch: {
      isReady: function() {
        this.loadData();
      }
    },
    props: {
      isReady: Boolean,
      contract: Object,
      account: String,
    },
    mounted: async function() {
      this.loadData();
    },
    methods: {
      loadData: async function() {
        if(this.contract.address) {
          this.numCards = parseInt(await this.contract.balanceOf.call(this.account));
          console.log('numcards', this.numCards);
        }
      },
      connectWeb3: function() {
        this.$emit('connect');
      }
    }
  }
</script>

<style scoped>
    .section {
        padding: 0;
    }
    .logo {
        margin-top: 10px;
    }
    .section.body .container .columns {

    }

    .click-to-enter {
        position: absolute;
        top: 200px;
        left: 450px;
        width: 300px;
    }

    .chatbox {
        width: 240px;
        height: 100px;
        position: absolute;
        top: 55px;
        left: 730px;
        font-family: "Caveat";
        font-size: 1.8em;
        padding: 0;
        line-height: 1em;
    }

    .responsebox {
        position: absolute;
        top: 175px;
        left: 780px;
    }

    .mintbox {
        position: absolute;
        top: 260px;
        left: 220px;
    }
</style>
