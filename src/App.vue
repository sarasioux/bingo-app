<template>
    <div class="bingo">
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
                                <h3 class="title is-5 has-text-primary" v-if="timeUntilNextDraw < 0">Pending</h3>
                            </div>
                        </div>
                    </div>
                    <br />
                    <h1 class="title has-text-centered has-text-white is-4">Welcome to the world's first blockchain based bingo.</h1>
                </div>
                <div class="column has-text-centered">
                    <img src="../public/logo3.png" />
                </div>
                <div class="column is-3">
                    <div class="columns is-mobile" v-if="isReady">
                        <div class="column is-6 has-text-centered">
                            <div class="box">
                                <h4 class="subtitle is-6">Cards Sold</h4>
                                <h3 class="title is-5 has-text-primary">{{currentTokenId - gameTokenFloor}}</h3>
                            </div>
                        </div>
                        <div class="column is-6 has-text-centered">
                            <div class="box">
                                <h4 class="subtitle is-6">Prize Pool</h4>
                                <h3 class="title is-5 has-text-primary">{{prizePool}} ETH</h3>
                            </div>
                        </div>
                    </div>

                    <div class="box has-text-centered" v-if="gameRound === 5">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-96x96">
                                    <img src="./assets/images/rock.png" alt="Stoners Rock">
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
            />
        </div>

        <div class="section balls-section has-background-black has-text-centered" v-if="isReady">
            <Balls
                :account="account"
                :contract="contract"
                :refresh="refresh"
                :graphClient="graphClient"
            />
        </div>

        <div class="section has-text-centered" v-if="isReady">
            <Mint
                    :account="account"
                    :contract="contract"
                    :weedContract="weedContract"
                    :refresh="refresh"
                    v-on:minted="refreshCards"
            />
            <br />
            <p class="help">Contract Address: <strong>{{contract.address}}</strong></p>
        </div>

        <div class="section has-text-centered" v-if="isReady">
            <Cards
                    :account="account"
                    :contract="contract"
                    :refresh="refresh"
            />
        </div>

        <section class="section has-background-black">
            <About
                :ballDrawTime="ballDrawTime"
            />
        </section>

        <Admin
                v-if="isReady"
                :account="account"
                :contract="contract"
                :weedContract="weedContract"
                :refresh="refresh"
        />
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
import Welcome from './components/Welcome'
import About from './components/About'

import { createClient } from 'urql';

export default {
  name: 'App',
  data: function() {
    return {
      account: '',
      connectionInProgress: false,
      network: 0,
      isMounted: false,
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

      timeUntilNextDraw: 0,

      graphClient: {}
    }
  },
  components: {
    Mint, Cards, Balls, Admin, Welcome, About
  },
  mounted: async function() {
    if(this.getCookie('connected')) {
      await this.connectWeb3();
    }
    this.isMounted = true;
  },
  methods: {
    getCookie: function(cookieName) {
      let name = cookieName + "=";
      let allCookieArray = document.cookie.split(';');
      for(let i=0; i<allCookieArray.length; i++) {
        let temp = allCookieArray[i].trim();
        if (temp.indexOf(name)===0)
          return temp.substring(name.length,temp.length);
      }
      return "";
    },
    connectWeb3: async function() {
      this.connectionInProgress = true;
      try {
        // Request account access
        let accounts = await this.$web3.currentProvider.send('eth_requestAccounts');
        this.account = accounts.result[0];
        let networkId = await this.$web3.eth.net.getId();
        switch (networkId) {
            case 42:
                this.connectionInProgress = false;
                document.cookie = "connected=true";
                await this.initContracts();
                this.isConnected = true;
                break;
            default:
                alert('Please connect to the Kovan test network.');
        }
      } catch (error) {
        // User denied account access
        alert('Please enable web3 to continue.');
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

      await this.loadData();
    },
    loadData: async function() {
      let response = await this.contract.getCurrent.call();
      this.gameRound = parseInt(response.game);
      this.currentTokenId = parseInt(response.token);
      this.prizePool = parseInt(await this.contract.prizePool.call()) / 1e18;
      this.lastBallTime = parseInt(await this.contract.lastBallTime.call());
      this.ballDrawTime = parseInt(await this.contract.ballDrawTime.call());
      this.gameTokenFloor = parseInt(await this.contract.gameFloor.call());
      this.timeUntilDraw();
      this.isReady = true;

      this.queryGraph();
    },
    refreshCards: function() {
      this.refresh = Date.now();
      this.loadData();
    },
    timeUntilDraw: function() {
      this.timeUntilNextDraw = Math.round(((this.lastBallTime*1000 + this.ballDrawTime*1000) - Date.now()) / 1000);
      setTimeout(this.timeUntilDraw, 1000);
    },
    queryGraph: async function() {
      const APIURL = "https://api.studio.thegraph.com/query/4841/bingo/v0.0.2";
      this.graphClient = createClient({
        url: APIURL
      });

    /*
      const tokensQuery = `
        query {
            token(id: 1) {
                id
                game {
                    id
                }
            }
        }
        `;
      const data = await client.query(tokensQuery).toPromise();
      console.log('graph data', data);
      */
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
