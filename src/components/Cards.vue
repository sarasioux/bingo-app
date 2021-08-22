<template>
    <div class="cards" v-if="cards.length > 0 || oldCards.length > 0">
        <h1 class="title is-3">My Cards</h1>
        <div class="tabs is-centered">
            <ul>
                <li :class="{'is-active':selected === 'current'}"><a @click="selected='current'">Current Cards</a></li>
                <li :class="{'is-active':selected === 'previous'}"><a @click="selected='previous'">Previous Games</a></li>
            </ul>
        </div>
        <div class="columns is-multiline" v-if="selected === 'current'">
            <div class="column" v-if="cards.length === 0">You don't have any current cards.  Why don't you go mint some?</div>
            <div class="column is-3" v-for="card in cards" :key="card">
                <Card
                    :id="parseInt(card)"
                    :contract="contract"
                    :account="account"
                />
            </div>
        </div>
        <div class="columns is-multiline" v-if="selected === 'previous'">
            <div class="column" v-if="oldCards.length === 0">You don't have any previous cards.  When a game ends they'll show up here.</div>
            <div class="column is-3" v-for="card in oldCards" :key="card">
                <Card
                        :id="parseInt(card)"
                        :contract="contract"
                        :account="account"
                />
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
        gameFloor: '',
        cards: [],
        oldCards: [],
      }
    },
    components: {
      Card
    },
    watch: {
      refresh: async function() {
        this.loadCards();
      }
    },
    props: {
      account: String,
      contract: Object,
      refresh: Number
    },
    mounted: async function() {
        let response = await this.contract.getCurrent.call();
        this.gameRound = parseInt(response.game);
        this.gameFloor = parseInt(await this.contract.gameFloor.call());
        this.loadCards();
    },
    methods: {
      loadCards: async function() {
        this.cards = [];
        this.oldCards = [];
        let cards = await this.contract.getCardsByOwner.call(this.account);
        cards.reverse();
        for(let i=0; i<cards.length; i++) {
          if(parseInt(cards[i]) > this.gameFloor) {
            this.cards.push(parseInt(cards[i]));
          } else {
            this.oldCards.push(parseInt(cards[i]));
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
