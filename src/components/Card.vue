<template>
    <div class="box" :class="{'has-background-warning':isWinner}">
        <h2 class="title is-4">Card #{{id}}</h2>
        <figure class="image is-square" v-if="image">
            <img :src="image">
        </figure>
        <br />
        <a @click="claimBingo" v-if="isWinner" class="button is-fullwidth is-primary">Claim Bingo</a><br />
    </div>
</template>

<script>
  export default {
    name: 'Card',
    data: function() {
      return {
        gameRound: '',
        gameFloor: '',
        randomness: '',
        tokenUrl: '',
        tokenJson: {},
        image: '',
        isCurrent: false,
        isWinner: false,
      }
    },
    watch: {
    },
    props: {
      account: String,
      contract: Object,
      id: Number
    },
    mounted: async function() {
      this.loadCard();
    },
    methods: {
      loadCard: async function() {
        let response = await this.contract.getCurrent.call();
        this.gameRound = parseInt(response.game);
        this.gameFloor = parseInt(await this.contract.gameFloor.call());
        this.randomness = parseInt(await this.contract.cardRandomness(this.id));

        if(this.id > this.gameFloor) {
          this.isCurrent = true;
          this.isWinner = await this.contract.validateCard(this.id);
        }

        this.tokenUrl = await this.contract.tokenURI(this.id);
        response = await fetch(this.tokenUrl);
        this.tokenJson = await response.json();
        this.image = this.tokenJson.image;
      },
      claimBingo: async function() {
        const response = await this.contract.claimBingo(this.id);
        console.log('claim response', response);
      },
    }
  }
</script>

<style scoped>

</style>
