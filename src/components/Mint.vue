<template>
    <div class="form">
        <div class="columns is-gapless has-text-centered is-mobile half-margin-bottom">
            <div class="column">
                <span class="title is-5 has-text-danger" v-if="maxCardsPerGame">{{maxCardsPerGame - (currentTokenId - gameTokenFloor)}}</span>
                <label class="label is-small">Remaining</label>
            </div>
            <div class="column">
                <span class="title is-5 has-text-danger" v-if="currencyChoice === 'ETH'">{{pricePerCard}}</span>
                <span class="title is-5 has-text-danger" v-if="currencyChoice === 'WEED'">{{weedPerCard}}</span>
                <label class="label is-small">Price</label>
            </div>
            <div class="column">
                <span class="title is-5 has-text-danger" v-if="currencyChoice === 'ETH'">{{myEthBalance}}</span>
                <span class="title is-5 has-text-danger" v-if="currencyChoice === 'WEED'">{{myWeedBalance}}</span>
                <label class="label is-small">Balance</label>
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
                <input v-model="mintAmount" class="input" type="number" min="1" max="10" step="1" placeholder="# of Cards">
            </p>
        </div>

        <div class="columns is-mobile">
            <div class="column">
                <a class="button is-danger" @click="mint">
                    Buy Cards
                </a>
            </div>
            <div class="column has-text-centered">
                <div class="title is-primary is-6 has-text-primary">
                    <span v-if="currencyChoice === 'ETH'">{{pricePerCard * mintAmount}} {{currencyChoice}}</span>
                    <span v-if="currencyChoice === 'WEED'">{{weedPerCard * mintAmount}} {{currencyChoice}}</span>
                </div>
                <div class="subtitle is-7">Total</div>
            </div>
        </div>

        <article class="message is-danger" v-if="showMintSuccess">
            <div class="message-body">
                Your mint was successful!  Freshly minted cards will be ready in about a minute.
            </div>
        </article>

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
        showMintSuccess: false,
        modalMessage: '',
      }
    },
    props: {
      account: String,
      contract: Object,
      weedContract: Object,
      refresh: Number
    },
    watch: {
      refresh: async function() {
        this.loadData();
      }
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
            await this.contract.mintCard(this.mintAmount, {gasPrice: null, value: this.mintAmount * this.pricePerCard * 1e18, from: this.account, type: '0x2'});
            //await this.contract.mintCard(this.mintAmount, {gasPrice: null, value: this.mintAmount * this.pricePerCard * 1e18, from: this.account});
            this.showMintEthModal = false;
            this.showMintSuccess = true;
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
            await this.contract.mintCard(this.mintAmount, {gasPrice: null, from: this.account,  type: '0x2'});
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
        this.myWeedBalance = Math.round(parseInt(await this.weedContract.balanceOf(this.account)) / 1e18);
      },
      myBalance: function() {
        if(this.currencyChoice === 'ETH') {
          return this.myEthBalance;
        } else {
          return this.myWeedBalance;
        }
      },
      confetti: function() {
        let colors = ['#FFFFFF', '#D91D8A', '#15A0D4'];
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
      hideMintSuccess: function() {
        this.showMintSuccess = false;
      }
    }
  }
</script>

<style scoped>

</style>
