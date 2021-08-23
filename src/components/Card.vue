<template>
    <div class="box" :class="{'has-background-primary':isWinner}">
        <h2 class="title is-5">Card #{{id}}</h2>
        <figure class="image is-square" v-if="image">
            <img :src="image">
        </figure>
        <br />
        <a @click="claimBingo" v-if="isWinner" class="button is-fullwidth is-danger">Claim Bingo</a><br />
    </div>
    <div class="modal" :class="{'is-active':showClaimModal}">
        <div class="modal-background" @click="showClaimModal=false"></div>
        <div class="modal-content">
            <div class="box">
                <h1 class="title">Congratulations Winner!</h1>
                <p v-if="!showClaimPrize">Waiting for transaction confirmation... <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span></p>
                <p class="title is-5 has-text-primary" v-if="showClaimPrize">You just had {{prizePool}} ETH deposited into your account.<br /></p>
                <p v-if="showClaimPrize">If there was an NFT prize for this round, it will be transferred to you shortly.</p>
            </div>
        </div>
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
        showClaimModal: false,
        showClaimPrize: false,
        prizePool: 0,
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
        this.showClaimModal = true;
        this.prizePool = Math.round((parseInt(await this.contract.prizePool.call()) / 1e18)*1000) / 1000;
        await this.contract.claimBingo(this.id);
        this.showClaimPrize = true;
      },
    }
  }
</script>

<style scoped>

</style>
