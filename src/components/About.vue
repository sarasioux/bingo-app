<template>
    <h1 class="title has-text-white">About the Game</h1>
    <div class="columns">
        <div class="column">
            <h2 class="title is-4 has-text-light">Cards</h2>
            <ul class="has-text-grey">
                <li>Each card is assigned a random on-chain value using Chain Link's verifiable randomness.</li>
                <li>The random value determines the card's layout.</li>
                <li>The numbers and positions are generated on-chain, the image is generated via API.</li>
                <li>Each time a ball is drawn the generated image will update.</li>
                <li>If your card is a winner, a "Claim Bingo" button will appear.</li>
                <li>Purchased cards will appear here as well as in your OpenSea wallet.</li>
            </ul>
        </div>
        <div class="column is-1"></div>
        <div class="column">
            <h2 class="title is-4 has-text-light">Balls</h2>
            <ul class="has-text-grey">
                <li>Each ball is drawn at random using Chain Link's verifiable randomness.</li>
                <li>Balls are drawn every <strong>{{ballDrawTime}}</strong> seconds.</li>
                <li>Ball draw time is configurable on the contract and we might change it from game to game.</li>
                <li>Balls are drawn automatically using Chain Link's keepers.</li>
                <li>Balls will not begin drawing until the minimum amount of cards have sold.</li>
                <li>Balls will keep drawing until every ball is drawn or a bingo has been claimed.</li>
            </ul>
        </div>
        <div class="column is-1"></div>
        <div class="column">
            <h2 class="title is-4 has-text-light">Prizes</h2>
            <ul class="has-text-grey">
                <li>The prize pool is a percentage of sales, configurable from game to game.</li>
                <li>The default value is one half of sales.</li>
                <li>It's possible for more than one card to be a winner, so only the first person to claim bingo wins the prize.</li>
                <li>NFT prizes are distributed manually to the wallet address that successfully claims bingo.</li>
                <li>The winner will need to pay gas fees to claim bingo, but the prize money will be transferred during that same transaction.</li>
            </ul>
        </div>
        <div class="column is-1"></div>
        <div class="column">
            <h2 class="title is-4 has-text-light">Swap</h2>
            <ul class="has-text-grey">
                <li>All bingo cards from games which have ended will turn into a piece of art.</li>
                <li>The art uses a generative algorithm which is configured using your bingo card numbers.</li>
                <li>Colors in the art are determined using your successful balls matched.</li>
                <li>Our hope is that you will enjoy your unique on-chain art as much as you enjoyed playing Bingo.</li>
            </ul>
        </div>
    </div>

    <p class="has-text-centered has-text-white">Brought to you by <a href="https://scarce.art" target="_blank">scarce.art</a>.</p>
</template>

<script>
  export default {
    name: 'About',
    data: function() {
      return {
      }
    },
    watch: {
    },
    props: {
      ballDrawTime: Number
    },
    mounted: async function() {
    },
    methods: {
      connectWeb3: function() {
        this.$emit('connect');
      }
    }
  }
</script>

<style scoped>
</style>
