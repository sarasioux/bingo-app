<template>
    <div>
        <div style="margin-bottom: 1.5em" v-if="payouts.length > 0">
            <div class="box has-background-primary-light has-text-centered" v-for="payout in payouts" :key="payout">
                <h1 class="title">You're a Winner!</h1>
                <button class="button is-danger" @click="claimBingo(payout)">Claim {{payoutAmounts[payout]}} ETH</button>
            </div>
        </div>
        <article class="message is-primary is-small">
            <div class="message-header">
                <p v-if="selected === 'current'">Your Current Cards</p>
                <p v-if="selected === 'previous'">Your Previous Cards</p>
                <p v-if="selected === 'all'">All Cards</p>
                <p v-if="selected === 'games'">Previous Games</p>
                <div class="dropdown is-pulled-right is-right" @click="dropdownActive=(dropdownActive===false)" :class="{'is-active':dropdownActive}">
                    <div class="dropdown-trigger">
                        <a aria-haspopup="true" aria-controls="dropdown-menu3" style="text-decoration: none;">
                            <span class="icon">
                                <i class="fas fa-bars" aria-hidden="true"></i>
                            </span>
                        </a>
                    </div>
                    <div class="dropdown-menu has-text-weight-normal" id="dropdown-menu3" role="menu">
                        <div class="dropdown-content">
                            <a class="dropdown-item" @click="selected='current'">
                                Your Current Cards
                            </a>
                            <a class="dropdown-item" @click="selected='previous'">
                                Your Previous Cards
                            </a>
                            <a class="dropdown-item" @click="selected='all'">
                                All Current Cards
                            </a>
                            <a class="dropdown-item" @click="selected='games'">
                                Previous Games
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="message-body">
                <div class="columns is-multiline" v-if="selected === 'current'">
                    <div class="column" v-if="cards.length === 0 && balanceOf === oldCards.length && cardsLoaded">
                        <p class="is-size-5 has-text-centered">You don't have any current cards.<br />Why don't you go buy some?</p><br />
                        <figure class="image"><img src="../assets/images/bingohost.png" /></figure>
                    </div>
                    <div class="column" v-if="cards.length === 0 && balanceOf > oldCards.length && cardsLoaded">
                        <p class="is-size-5 has-text-centered">Your freshly minted cards will appear here shortly.</p><br />
                        <figure class="image"><img src="../assets/images/mildred.jpg" /></figure>
                    </div>
                    <div class="column is-4" v-for="card in cards" :key="card">
                        <Card
                            :id="parseInt(card)"
                            :contract="contract"
                            :account="account"
                            :type="'current'"
                        />
                    </div>
                </div>
                <div class="columns is-multiline" v-if="selected === 'previous'">
                    <div class="column" v-if="oldCards.length === 0 && cardsLoaded">
                        <p class="is-size-5 has-text-centered">You don't have any previous cards.<br />When a game ends they'll show up here.</p><br />
                        <figure class="image"><img src="../assets/images/bill.jpg" /></figure>
                    </div>
                    <div class="column is-4" v-for="card in oldCards" :key="card">
                        <Card
                                :id="parseInt(card)"
                                :contract="contract"
                                :account="account"
                                v-on:claimed="claimed"
                                :type="'previous'"
                        />
                    </div>
                </div>
                <div class="columns is-multiline" v-if="selected === 'all'">
                    <div class="column is-3" v-for="card in currentCards()" :key="card">
                        <Card
                                :id="parseInt(card)"
                                :contract="contract"
                                :account="account"
                                :type="'all'"
                        />
                    </div>
                </div>
                <div v-if="selected === 'games'">
                    <p class="is-size-5 has-text-centered">Game History coming soon.</p><br />
                    <figure class="image"><img src="../assets/images/mildred.jpg" /></figure>
                </div>
            </div>
        </article>
        <div class="modal" :class="{'is-active':showClaimModal}">
            <div class="modal-background" @click="hideClaimModal"></div>
            <div class="modal-content">
                <div class="box">
                    <h1 class="title">Congratulations Winner!</h1>
                    <p v-if="!showClaimPrize">Waiting for transaction confirmation... <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></p>
                    <p class="title is-5 has-text-primary" v-if="showClaimPrize">You just had ETH deposited into your account.<br /></p>
                    <p v-if="showClaimPrize">If there was an NFT prize for this round and you were the first to claim, it will be transferred to you shortly.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Card from './Card'

  export default {
    name: 'Cards',
    data: function() {
      return {
        selected: 'current',
        gameRound: '',
        currentTokenId: '',
        gameFloor: '',
        cards: [],
        oldCards: [],
        balanceOf: 0,
        cardsPending: false,
        cardsLoaded: false,
        dropdownActive: false,
        payouts: [],
        payoutAmounts: {},
        showClaimModal: false,
        showClaimPrize: false,
      }
    },
    components: {
      Card
    },
    watch: {
      refresh: async function() {
        this.loadCardsGraph();
      },
      resetCardSelection: async function() {
        this.selected = 'current';
      }
    },
    props: {
      account: String,
      contract: Object,
      refresh: Number,
      graphClient: Object,
      resetCardSelection: Number,
      isReady: Boolean
    },
    mounted: async function() {
        let response = await this.contract.getCurrent.call();
        this.gameRound = parseInt(response.game);
        this.currentTokenId = parseInt(response.token);
        this.gameFloor = parseInt(await this.contract.gameFloor.call());
        await this.loadCardsGraph();
        this.contract.CardGenerated().on('data', this.cardListener);
    },
    methods: {
      cardListener: async function(event) {
        console.log('New Card Event', event);
        let account = event.args.owner;
        if(this.account === account) {
            setTimeout(this.loadCardsGraph, 5000);
        }
      },
      claimed: function() {
        this.$emit('claimed');
      },
      currentCards: function() {
        let cards = [];
        for(let i=this.currentTokenId; i>this.gameFloor+1; i--) {
          cards.push(i);
        }
        return cards;
      },
      loadCardsGraph: async function() {
        this.balanceOf = parseInt(await this.contract.balanceOf.call(this.account));
        let query = `{
              owners(where:{address:"${this.account}"}) {
              tokens {
                id,
                  game {
                  id
                }
              }
            }
        }`;
        let cards = [];
        let oldCards = [];
        let response = await this.graphClient.query(query).toPromise();
        if(response.data && response.data.owners[0] && response.data.owners[0].tokens.length > 0) {
          for(let i=0; i<response.data.owners[0].tokens.length; i++) {
            let token = response.data.owners[0].tokens[i];
            let tokenId = parseInt(token.id);
            if(tokenId > this.gameFloor) {
              cards.push(tokenId);
            }  else {
              oldCards.push(tokenId);
            }

            // Check for payouts
            let payout = parseInt(await this.contract.winners.call(tokenId));
            if(payout > 0) {
              this.payouts.push(tokenId);
              this.payoutAmounts[tokenId] = payout / 1e18;
            }
          }
        }
        cards.sort(function(a, b) {
          return b - a;
        });
        oldCards.sort(function(a, b) {
          return b - a;
        });
        this.cards = cards;
        this.oldCards = oldCards;

        if((this.cards.length + this.oldCards.length) < this.balanceOf) {
          this.cardsPending = true;
          setTimeout(this.loadCardsGraph, 5000);
        }
        this.cardsLoaded = true;
      },
      claimBingo: async function(tokenId) {
        this.showClaimModal = true;
        await this.contract.claimBingo(tokenId);
        this.showClaimPrize = true;
        this.$emit('claimed');
      },
      hideClaimModal: function() {
        this.showClaimModal=false;
        location.reload();
      },
    }
  }
</script>

<style scoped>
    .dropdown-trigger {
        margin: -0.5em;
    }
</style>
