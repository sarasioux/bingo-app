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

        <div class="modal" :class="{'is-active':showMintEthModal}">
            <div class="modal-background" @click="showMintEthModal=false"></div>
            <div class="modal-content">
                <div class="box">
                    <h1 class="title">Minting {{mintAmount}} Cards</h1>
                    <p>Waiting for transaction confirmation... <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></p>
                    <article class="message is-danger" v-if="modalMessage">
                        <div class="message-body">
                            {{modalMessage}}
                        </div>
                    </article>
                </div>
            </div>
        </div>
        <div class="modal" :class="{'is-active':showMintWeedModal}">
            <div class="modal-background" @click="showMintWeedModal=false"></div>
            <div class="modal-content">
                <div class="box">
                    <h1 class="title">Minting {{mintAmount}} Cards</h1>
                    <p v-if="!showMintWeedApproved">Waiting for $WEED approval... <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></p>
                    <p v-if="showMintWeedApproved">Waiting for transaction confirmation... <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></p>
                    <article class="message is-danger" v-if="modalMessage">
                        <div class="message-body">
                            {{modalMessage}}
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import confetti from 'canvas-confetti';

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
        showMintEthModal: false,
        showMintWeedModal: false,
        showMintWeedApproved: false,
        modalMessage: '',
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
        this.modalMessage = '';
        if(this.mintAmount < 1) {
          alert('Minimum amount to mint is 1 card.');
          return;
        }
        if(this.mintAmount > this.maxCardPurchase) {
          alert('Maximum amount to mint is 10 cards.');
          return;
        }
        if(this.currencyChoice === 'ETH') {
          this.showMintEthModal = true;
          try {
            await this.contract.mintCard(this.mintAmount, {value: this.mintAmount * this.pricePerCard * 1e18, from: this.account});
            this.showMintEthModal = false;
            this.mintAmount = '';
            this.$emit('minted');
            this.confetti();
          }
          catch(error) {
            this.modalMessage = error.message;
          }
        } else {
          this.showMintWeedModal = true;
          try {
            let totalWeed = (this.weedPerCard * this.mintAmount).toString() + '000000000000000000';
            await this.weedContract.approve(this.contract.address, totalWeed);
            this.showMintWeedApproved = true;
            await this.contract.mintCard(this.mintAmount, {from: this.account});
            this.showMintWeedModal = false;
            this.showMintWeedApproved = false;
            this.mintAmount = '';
            this.$emit('minted');
            this.confetti();
          }
          catch(error) {
            this.modalMessage = error.message;
          }

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
      },
      confetti: function() {
        let colors = ['#FD2A00', '#FDFE00', '#19C401'];
        let end = Date.now() + (3 * 1000);
        (function frame() {
          confetti({
            particleCount: 3,
            angle: -90,
            spread: 200,
            origin: { y: -0.2 },
            colors: colors
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      },
    }
  }
</script>

<style scoped>

</style>
