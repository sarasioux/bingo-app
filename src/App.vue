<template>
    <div class="container">


    <div class="bingo section" style="padding: 1em">
        <div class="columns is-gapless no-margin">
            <div class="column nav-col">
                <h1 class="tagline title has-text-white has-text-centered is-4">The world's first<br />blockchain-based bingo.</h1>
            </div>
            <div class="column is-2">
                <router-link to="/" @click="cardSelection">
                    <figure class="image">
                        <img src="../public/logo3.png" class="logo" />
                    </figure>
                </router-link>
            </div>
            <div class="column nav-col">
                <nav class="primary-navbar navbar is-transparent" role="navigation" aria-label="main navigation">
                    <div class="navbar-brand">
                        <a
                            role="button"
                            class="navbar-burger has-text-white"
                            aria-label="menu"
                            aria-expanded="false"
                            data-target="navbarBasicExample"
                            @click="navbarActive=(navbarActive===false)"
                            :class="{'is-active':navbarActive}"
                        >
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active':navbarActive}">
                        <div class="navbar-start">
                        </div>

                        <div class="navbar-end">
                            <router-link to="/" class="navbar-item has-text-white" :class="{'has-text-primary':$route.path === '/'}">
                                Play
                            </router-link>
                            <router-link to="/about" class="navbar-item has-text-white" :class="{'has-text-primary':$route.path === '/about'}">
                                About
                            </router-link>
                            <div class="navbar-item"></div>
                            <a href="https://twitter.com/nftbingo" target="_blank" class="navbar-item has-text-primary-light">
                                <span class="icon"><i class="fab fa-2x fa-twitter"></i></span>
                            </a>
                            <div class="navbar-item"></div>
                            <a href="https://discord.gg/c8pYtQgXxU" target="_blank" class="navbar-item has-text-primary-light">
                                <span class="icon"><i class="fab fa-2x fa-discord"></i></span>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
        <router-view
                :account="account"
                :contract="contract"
                :weedContract="weedContract"
                :graphClient="graphClient"
                :ballDrawTime="ballDrawTime"
                :refresh="refresh"
                :refreshBalls="refreshBalls"
                :refreshCards="refreshCards"
                :showHelp="showHelp"
                :gameRound="gameRound"
                :pattern="pattern"
                :patterns="patterns"
                :timeUntilNextDraw="timeUntilNextDraw"
                :prizePool="prizePool"
                :startGame="startGame"
                :balanceOf="balanceOf"
                :isReady="isReady"
                :isMounted="isMounted"
                :resetCardSelection="resetCardSelection"
                :connectionInProgress="connectionInProgress"
                v-on:connect="connectWeb3"
        ></router-view>

        <p class="has-text-centered has-text-grey"><br />Brought to you by <a href="https://scarce.art" target="_blank">scarce.art</a>.</p>
        <Admin
                v-if="isReady"
                :account="account"
                :contract="contract"
                :weedContract="weedContract"
                :refresh="refresh"
        />
    </div>
    </div>

</template>

<script>

import BingoContract from '../public/contracts/Bingo.json'
import WeedContract from '../public/contracts/Weed.json'

import TruffleContract from '@truffle/contract'
import Admin from './components/Admin'

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
      refreshBalls: 0,
      resetCardSelection: 0,
      balanceOf: '',
      startGame: false,
      navbarActive: false,

      gameRound: '',
      prizePool: '',
      lastBallTime: '',
      ballDrawTime: '',
      gameTokenFloor: '',
      currentTokenId: '',
      pattern: '',
      patterns: {
        1: 'Line',
        2: 'X',
        3: 'Full Card',
        4: 'Four Corners',
      },

      timeUntilNextDraw: 0,

      graphClient: {},

      showHelp: false,
    }
  },
  components: {
    Admin
  },
  mounted: async function() {
    /*
    if(this.getCookie('connected')) {
      await this.connectWeb3();
    }
    */
    this.queryGraph();
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
      console.log('connecting');
      this.connectionInProgress = true;
      try {
        // Request account access
        let accounts = await this.$web3.currentProvider.send('eth_requestAccounts');
        this.account = accounts.result[0];
        let networkId = await this.$web3.eth.net.getId();
        switch (networkId) {
            case 42:
                document.cookie = "connected=true";
                await this.initContracts();
                this.connectionInProgress = false;
                this.isConnected = true;
                break;
            default:
                alert('Please connect to the Kovan test network.');
        }
      } catch (error) {
        this.showHelp = true;
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
      if(this.gameRound > 0 && this.gameRound !== parseInt(response.game)) {
        this.refreshBalls = Date.now();
      }
      this.gameRound = parseInt(response.game);
      this.currentTokenId = parseInt(response.token);
      this.prizePool = Math.round((parseInt(await this.contract.prizePool.call()) / 1e18)*1000) / 1000;
      this.lastBallTime = parseInt(await this.contract.lastBallTime.call());
      this.ballDrawTime = parseInt(await this.contract.ballDrawTime.call());
      this.gameTokenFloor = parseInt(await this.contract.gameFloor.call());
      this.pattern = parseInt(await this.contract.pattern.call());
      this.balanceOf = parseInt(await this.contract.balanceOf.call(this.account));
      this.startGame = await this.contract.startGame.call();
      this.timeUntilDraw();
      this.isReady = true;
    },
    cardSelection: function() {
      this.resetCardSelection = Date.now();
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
      const APIURL = "https://api.studio.thegraph.com/query/4841/bingo/v0.1.5";
      this.graphClient = createClient({
        url: APIURL,
        requestPolicy: 'network-only'
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

    .tagline {
        margin-top: 1rem;
    }
    .primary-navbar {
        margin-top: 1rem;
    }

</style>
