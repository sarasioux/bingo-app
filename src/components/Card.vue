<template>
    <div class="box">
        <h2 class="title is-4 playfair">Card #{{id}}</h2>
        <figure class="image is-square" v-if="image">
            <img :src="image">
        </figure>
        <a @click="validateCard" v-if="isCurrent">Check Winner</a><br />
        <a @click="claimBingo" v-if="isCurrent">Claim Bingo</a><br />
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
        this.gameRound = parseInt(await this.contract.getCurrentGame.call());
        this.gameFloor = parseInt(await this.contract.gameFloors.call(this.gameRound));
        this.randomness = parseInt(await this.contract.cardRandomness(this.id));

        if(this.id > this.gameFloor) {
          this.isCurrent = true;
        }

        this.tokenUrl = await this.contract.tokenURI(this.id);
        let response = await fetch(this.tokenUrl);
        this.tokenJson = await response.json();
        this.image = this.tokenJson.image;
      },
      validateCard: async function() {
        const response = await this.contract.validateWinner(this.id);
        console.log('validation response', response);
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
