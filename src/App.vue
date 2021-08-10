<template>
    <a @click="connectWeb3" class="button" v-if="!isConnected">Connect</a>
    <br />

    <div class="bingo" v-if="isReady">
        <div class="columns">
            <div class="column is-2 has-text-centered">
                <h4 class="subtitle is-4 playfair">Round</h4>
                <h3 class="title is-3 has-text-primary">{{gameRound}}</h3>
            </div>
            <div class="column is-2 has-text-centered">
                <h4 class="subtitle is-4 playfair">Next Draw</h4>
                <h3 class="title is-3 has-text-primary">{{timeUntilDraw()}} secs</h3>
            </div>
            <div class="column has-text-centered">
                <h1 class="title is-1 playfair">Bingo Morph</h1>
            </div>
            <div class="column is-2 has-text-centered">
                <h4 class="subtitle is-4 playfair">Cards Sold</h4>
                <h3 class="title is-3 has-text-primary">{{currentTokenId - gameTokenFloor}}</h3>
            </div>
            <div class="column is-2 has-text-centered">
                <h4 class="subtitle is-4 playfair">Prize</h4>
                <h3 class="title is-3 has-text-primary">{{prizePool}} ETH</h3>
            </div>
        </div>
        <div class="tabs is-centered">
            <ul class="playfair">
                <li class="is-active"><a>Play Bingo</a></li>
                <li><a>About the Game</a></li>
            </ul>
        </div>
        <div class="section balls-section has-background-dark has-text-centered">
            <Balls
                v-if="isReady"
                :account="account"
                :contract="contract"
                :refresh="refresh"
            />
        </div>

        <div class="section has-text-centered">
            <Mint
                    v-if="isReady"
                    :account="account"
                    :contract="contract"
                    :weedContract="weedContract"
                    :refresh="refresh"
                    v-on:minted="refreshCards"
            />
            <br />
            <p class="help">Contract Address: <strong>{{contract.address}}</strong></p>
        </div>

        <div class="has-text-centered">
            <Cards
                    v-if="isReady"
                    :account="account"
                    :contract="contract"
                    :refresh="refresh"
            />
        </div>

        <div class="section">
            <Admin
                    v-if="isReady"
                    :account="account"
                    :contract="contract"
                    :refresh="refresh"
            />
        </div>

    </div>

</template>

<script>

import BingoContract from '../public/contracts/Bingo.json'
import WeedContract from '../public/contracts/Weed.json'

import TruffleContract from '@truffle/contract'
import Mint from './components/Mint'
import Cards from './components/Cards'
import Balls from './components/Balls'
import Admin from './components/Admin'

export default {
  name: 'App',
  data: function() {
    return {
      account: '',
      connectionInProgress: false,
      network: 0,
      isConnected: false,
      isReady: false,
      contract: {},
      weedContract: {},
      refresh: 0,

      gameRound: '',
      prizePool: '',
      lastBallTime: '',
      ballDrawTime: '',
      gameTokenFloor: '',
      currentTokenId: '',
    }
  },
  components: {
    Mint, Cards, Balls, Admin
  },
  mounted: function() {
    //this.fillBox();
  },
  methods: {
    fillBox: function() {
        let canvas = document.getElementById('canvas-card');
        let ctx = canvas.getContext('2d');
        let imgSrc = document.getElementById('canvas-image');
        let img = new Image();
        img.src = imgSrc.src;
        img.onload = function() {
          ctx.drawImage(img, 0, 0);

          // Fill in boxes
          ctx.font = '65px "Source Code Pro"';
          ctx.fillText('12', 110, 270);
          ctx.fillText('22', 210, 270); // + 100
          ctx.fillText('15', 310, 270);
          ctx.fillText('33', 410, 270);
          ctx.fillText('74', 510, 270);
          ctx.fillText('1', 130, 370);
          ctx.fillText('22', 210, 370); // + 150
          ctx.fillText('5', 430, 370); // + 155
          ctx.fillText('3', 530, 370); // + 155
          //ctx.fillText('7', 775, 425); // + 150
        };



    },
    connectWeb3: async function() {
      this.connectionInProgress = true;
      try {
        // Request account access
        let accounts = await this.$web3.currentProvider.send('eth_requestAccounts');
        this.account = accounts.result[0];
        this.connectionInProgress = false;
        await this.initContracts();
        this.isConnected = true;
      } catch (error) {
        // User denied account access
        console.log('did not receive accts', error);
      }
    },
    initContracts: async function() {
      let contract = TruffleContract(BingoContract);
      contract.setProvider(this.$web3.currentProvider);
      contract.defaults({
        from: this.account
      });
      this.contract = await contract.deployed();

      contract = TruffleContract(WeedContract);
      contract.setProvider(this.$web3.currentProvider);
      contract.defaults({
        from: this.account
      });
      this.weedContract = await contract.deployed();

      this.loadData();
    },
    loadData: async function() {
      this.gameRound = parseInt(await this.contract.getCurrentGame.call());
      this.prizePool = parseInt(await this.contract.prizePool.call()) / 1e18;
      this.lastBallTime = parseInt(await this.contract.lastBallTime.call());
      this.ballDrawTime = parseInt(await this.contract.ballDrawTime.call());
      this.gameTokenFloor = parseInt(await this.contract.gameFloors.call(this.gameRound));
      this.currentTokenId = parseInt(await this.contract.getCurrentToken.call());
      this.isReady = true;
    },
    refreshCards: function() {
      this.refresh = Date.now();
      this.loadData();
    },
    timeUntilDraw: function() {
      return Math.round(((this.lastBallTime*1000 + this.ballDrawTime*1000) - Date.now()) / 1000);
    }
  }
}


/*
    StonersRock + Bingo Mashup Thoughts:
    - Airdrop 1 free rock to all 43 paid holders
    - Lower price of rock to .024
    - Release $WEED
    - All rocks start with 1k of $WEED
    - Claim 50 $WEED for every day you're a holder
    - Put half of community fund into $WEED contract (~$400)
    - Bingo cards can be purchased on stonersrock.com for 1k $WEED
    - $WEED can be cashed out for face value (.005-ish)
    - Eventually set up an NFT auction and allow people to bid with $WEED


*/
</script>

<style>
    .hidden {
        display: none;
    }
    .balls-section {
        padding-left: 0;
        padding-right: 0;
    }

    .playfair {
        font-family: "Playfair Display";
        font-size: 1.4em;
    }
</style>
