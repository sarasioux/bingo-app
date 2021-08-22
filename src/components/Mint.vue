<template>
    <div class="form">
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <div class="box">
                    <h1 class="title is-3">Buy Bingo Cards</h1>
                    <div class="columns">
                        <div class="column">
                            <p class="subtitle is-6">Price</p>
                            <p class="title has-text-primary is-4" v-if="currencyChoice === 'ETH'">{{pricePerCard}}</p>
                            <p class="title has-text-primary is-4" v-if="currencyChoice === 'WEED'">{{weedPerCard}}</p>
                        </div>
                        <div class="column">
                            <p class="subtitle is-6">Mint Limit</p>
                            <p class="title has-text-primary is-4">{{maxCardPurchase}}</p>
                        </div>
                        <div class="column">
                            <p class="subtitle is-6">Cards Remaining</p>
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
                            <input v-model="mintAmount" class="input" type="number" min="1" max="10" step="1" placeholder="Amount to Mint">
                        </p>
                        <p class="control">
                            <a class="button is-primary" @click="mint">
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
  // import BN from 'bignumber.js';

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
        weedPerCard: 4000,
        maxCardPurchase: 10,
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
        if(this.mintAmount < 1) {
          alert('Minimum amount to mint is 1 card.');
          return;
        }
        if(this.mintAmount > this.maxCardPurchase) {
          alert('Maximum amount to mint is 10 cards.');
          return;
        }
        if(this.currencyChoice === 'ETH') {
          await this.contract.mintCard(this.mintAmount, {value: this.mintAmount * this.pricePerCard * 1e18, from: this.account});
          this.$emit('minted');
        } else {
          //let totalWeed = new BN(this.weedPerCard * this.mintAmount * 1e18);
          let totalWeed = '4000000000000000000000';
          await this.weedContract.approve(this.contract.address, totalWeed);
          await this.contract.mintCard(this.mintAmount, {from: this.account});
          this.$emit('minted');
        }
      },
      loadData: async function() {
        let response = await this.contract.getCurrent.call();
        this.gameRound = parseInt(response.game);
        this.currentTokenId = parseInt(response.token);
        this.pricePerCard = parseInt(await this.contract.pricePerCard.call()) / 1e18;
        this.maxCardsPerGame = parseInt(await this.contract.maxCards.call());
        this.gameTokenFloor = parseInt(await this.contract.gameFloor.call());

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
