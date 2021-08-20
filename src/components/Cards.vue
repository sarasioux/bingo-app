<template>
    <div class="cards" v-if="cards.length > 0">
        <h1 class="title is-3">My Cards</h1>
        <div class="columns is-multiline">
            <div class="column is-3" v-for="card in cards" :key="card">
                <Card
                    :id="parseInt(card)"
                    :contract="contract"
                    :account="account"
                />
            </div>
        </div>
        <div class="columns is-multiline">
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
        this.cards = await this.contract.getCardsByOwner.call(this.account);
        this.cards.reverse();
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
        let cards = await this.contract.getCardsByOwner.call(this.account);
        cards.reverse();
        for(let i=0; i<cards.length; i++) {
          if(parseInt(cards[i]) > this.gameFloor) {
            this.cards.push(parseInt(cards[i]));
          } else {
            this.oldCards.push(parseInt(cards[i]));
          }
        }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
