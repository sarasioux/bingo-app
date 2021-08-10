<template>
    <div class="form">
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <div class="box">
                    <h1 class="title playfair is-3">Buy Bingo Cards</h1>
                    <div class="columns">
                        <div class="column">
                            <p class="subtitle is-6 playfair">Price</p>
                            <p class="title has-text-primary is-4" v-if="currencyChoice === 'ETH'">{{pricePerCard}}</p>
                            <p class="title has-text-primary is-4" v-if="currencyChoice === 'WEED'">{{weedPerCard}}</p>
                        </div>
                        <div class="column">
                            <p class="subtitle is-6 playfair">Mint Limit</p>
                            <p class="title has-text-primary is-4">{{maxCardPurchase}}</p>
                        </div>
                        <div class="column">
                            <p class="subtitle is-6 playfair">Cards Remaining</p>
                            <p class="title has-text-primary is-4">{{maxCardsPerGame - (currentTokenId - gameTokenFloor)}}</p>
                        </div>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <div class="select">
                              <select v-model="currencyChoice">
                                <option>ETH</option>
                                <option>WEED</option>
                              </select>
                            </div>

                        </div>
                        <p class="control is-expanded">
                            <input v-model="mintAmount" class="input" type="text" placeholder="Amount to Mint">
                        </p>
                        <p class="control">
                            <a class="button" @click="mint">
                                Mint
                            </a>
                        </p>
                    </div>
                    <p class="help">Your Balance:
                        <strong v-if="currencyChoice === 'ETH'">{{myEthBalance}} {{currencyChoice}}</strong>
                        <strong v-if="currencyChoice === 'WEED'">{{myWeedBalance}} {{currencyChoice}}</strong>
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import BN from 'bignumber.js';

  export default {
    name: 'Mint',
    data: function() {
      return {
        gameRound: '',
        currencyChoice: 'ETH',
        myEthBalance: 0,
        myWeedBalance: 0,
        mintAmount: '',
        pricePerCard: '',
        weedPerCard: '',
        maxCardPurchase: '',
        maxCardsPerGame: '',
        gameTokenFloor: '',
        currentTokenId: '',
      }
    },
    props: {
      account: String,
      contract: Object,
      weedContract: Object,
      refresh: Number
    },
    mounted: function() {
      this.loadData();
    },
    methods: {
      mint: async function() {
        if(this.currencyChoice === 'ETH') {
          await this.contract.mintCardEth(this.mintAmount, {value: this.mintAmount * this.pricePerCard * 1e18, from: this.account});
          this.$emit('minted');
        } else {
          let totalWeed = new BN(this.weedPerCard * this.mintAmount * 1e18);
          console.log('total weed', totalWeed);
          await this.weedContract.approve(this.contract.address, totalWeed);
          await this.contract.mintCardWeed(this.mintAmount, {from: this.account});
          this.$emit('minted');
        }
      },
      loadData: async function() {
        this.gameRound = parseInt(await this.contract.getCurrentGame.call());
        this.pricePerCard = parseInt(await this.contract.pricePerCard.call()) / 1e18;
        this.maxCardPurchase = parseInt(await this.contract.maxCardPurchase.call());
        this.maxCardsPerGame = parseInt(await this.contract.maxCardsPerGame.call());
        this.gameTokenFloor = parseInt(await this.contract.gameFloors.call(this.gameRound));
        this.currentTokenId = parseInt(await this.contract.getCurrentToken.call());
        this.weedPerCard = parseInt(await this.contract.weedPerCard.call()) / 1e18;

        this.myEthBalance = Math.round(await this.$web3.eth.getBalance(this.account) / 1e16) / 1e2;
        this.myWeedBalance = parseInt(await this.weedContract.balanceOf(this.account)) / 1e18;
      },
      myBalance: function() {
        if(this.currencyChoice === 'ETH') {
          return this.myEthBalance;
        } else {
          return this.myWeedBalance;
        }
      }
    }
  }
</script>

<style scoped>

</style>
