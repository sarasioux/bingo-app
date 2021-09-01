<template>
    <article class="message is-primary is-small">
        <div class="message-header">
            <p v-if="selected === 'current'">Your Current Cards</p>
            <p v-if="selected === 'previous'">Your Previous Cards</p>
            <p v-if="selected === 'all'">All Cards</p>
            <p v-if="selected === 'games'">Previous Games</p>
            <div class="dropdown is-pulled-right is-hoverable is-right">
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
                <div class="column" v-if="cards.length === 0 && balanceOf === oldCards.length">You don't have any current cards.  Why don't you go mint some?</div>
                <div class="column" v-if="cards.length === 0 && balanceOf > oldCards.length">Your freshly minted cards will appear here shortly.</div>
                <div class="column is-4" v-for="card in cards" :key="card">
                    <Card
                        :id="parseInt(card)"
                        :contract="contract"
                        :account="account"
                    />
                </div>
            </div>
            <div class="columns is-multiline" v-if="selected === 'previous'">
                <div class="column" v-if="oldCards.length === 0">You don't have any previous cards.  When a game ends they'll show up here.</div>
                <div class="column is-4" v-for="card in oldCards" :key="card">
                    <Card
                            :id="parseInt(card)"
                            :contract="contract"
                            :account="account"
                            v-on:claimed="claimed"
                    />
                </div>
            </div>
            <div v-if="selected === 'all'">
                All cards coming soon.
            </div>
            <div v-if="selected === 'games'">
                Game History coming soon.
            </div>
        </div>
    </article>
</template>

<script>
  import Card from './Card'

  export default {
    name: 'Cards',
    data: function() {
      return {
        selected: 'current',
        gameRound: '',
        gameFloor: '',
        cards: [],
        oldCards: [],
        balanceOf: 0,
        cardsPending: false,
      }
    },
    components: {
      Card
    },
    watch: {
      refresh: async function() {
        this.loadCardsGraph();
      }
    },
    props: {
      account: String,
      contract: Object,
      refresh: Number,
      graphClient: Object
    },
    mounted: async function() {
        let response = await this.contract.getCurrent.call();
        this.gameRound = parseInt(response.game);
        this.gameFloor = parseInt(await this.contract.gameFloor.call());
        await this.loadCardsGraph();
        this.contract.CardGenerated().on('data', this.cardListener);
    },
    methods: {
      cardListener: async function(event) {
        let account = event.args.owner;
        if(this.account === account) {
            setTimeout(this.loadCardsGraph, 5000);
        }
      },
      claimed: function() {
        this.$emit('claimed');
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
        if(response.data.owners[0] && response.data.owners[0].tokens.length > 0) {
          for(let i=0; i<response.data.owners[0].tokens.length; i++) {
            let token = response.data.owners[0].tokens[i];
            if(parseInt(token.id) > this.gameFloor) {
              cards.push(parseInt(token.id));
            }  else {
              oldCards.push(parseInt(token.id));
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
      }
    }
  }
</script>

<style scoped>
    .dropdown-trigger {
        margin: -0.5em;
    }
</style>
