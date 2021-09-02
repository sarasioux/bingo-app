<template>
    <div class="box has-background-black">

        <h1 class="title has-text-primary">About the Game</h1>
        <div class="columns">
            <div class="column">
                <article class="panel is-primary has-background-white">
                    <p class="panel-heading">
                        Cards
                    </p>
                    <div class="panel-block">
                        Each card is assigned a random on-chain value using Chain Link's verifiable randomness.
                    </div>
                    <div class="panel-block">
                        The random value determines the card's layout.
                    </div>
                    <div class="panel-block">
                        The numbers and positions are generated on-chain, the image is generated via API.
                    </div>
                    <div class="panel-block">
                        Each time a ball is drawn the generated image will update.
                    </div>
                    <div class="panel-block">
                        If your card is a winner, a "Claim Bingo" button will appear.
                    </div>
                    <div class="panel-block">
                        Purchased cards will appear here as well as in your OpenSea wallet.
                    </div>
                </article>
            </div>
            <div class="column">
                <article class="panel is-primary has-background-white">
                    <p class="panel-heading">
                        Balls
                    </p>
                    <div class="panel-block">
                        Each ball is drawn at random using Chain Link's verifiable randomness.
                    </div>
                    <div class="panel-block">
                        Ball draw time is configurable on the contract and we might change it from game to game.
                    </div>
                    <div class="panel-block">
                        Balls are drawn automatically using Chain Link's keepers.
                    </div>
                    <div class="panel-block">
                        Balls will not begin drawing until the minimum amount of cards have sold.
                    </div>
                    <div class="panel-block">
                        Balls will keep drawing until every ball is drawn or a bingo has been claimed.
                    </div>
                </article>
            </div>
            <div class="column">
                <article class="panel is-primary has-background-white">
                    <p class="panel-heading">
                        Prizes
                    </p>
                    <div class="panel-block">
                        The prize pool is a percentage of sales, configurable from game to game.
                    </div>
                    <div class="panel-block">
                        It's possible for more than one card to be a winner, so only the first person to claim bingo wins the prize.
                    </div>
                    <div class="panel-block">
                        NFT prizes are distributed manually to the wallet address that successfully claims bingo.
                    </div>
                    <div class="panel-block">
                        The winner will need to pay gas fees to claim bingo, but the prize money will be transferred during that same transaction.
                    </div>
                    <div class="panel-block">
                        A single complete line wins.
                    </div>
                </article>
            </div>
            <div class="column">
                <article class="panel is-primary has-background-white">
                    <p class="panel-heading">
                        Swap
                    </p>
                    <div class="panel-block">
                        All bingo cards from games which have ended will turn into a piece of art.
                    </div>
                    <div class="panel-block">
                        The art uses a generative algorithm which is configured using your bingo card numbers.
                    </div>
                    <div class="panel-block">
                        Colors in the art are determined using your successful balls matched.
                    </div>
                    <div class="panel-block">
                        Our hope is that you will enjoy your unique on-chain art as much as you enjoyed playing Bingo.
                    </div>
                </article>
            </div>
        </div>
        <br />
        <h1 class="title has-text-primary">
            Technical
            <button class="button is-pulled-right is-danger is-small" @click="connectWeb3" v-if="!contract.address">Connect Wallet</button>
        </h1>
        <div class="columns">
            <div class="column">
                <article class="panel is-primary has-background-white">
                    <p class="panel-heading">
                        Contract
                    </p>
                    <div class="panel-block">
                        <label>Contract Address</label>
                        <strong><a :href="'https://kovan.etherscan.io/address/' + contract.address + '#code'" target="_blank">{{contract.address}}</a></strong>
                    </div>
                    <div class="panel-block">
                        <label>Chainlink Keeper</label>
                        <strong><a href="https://keepers.chain.link/kovan/upkeeps/530" target="_blank">bingoball8 - 530</a></strong>
                    </div>
                    <div class="panel-block">
                        <label>Subgraph</label>
                        <strong><a href="https://thegraph.com/studio/subgraph/bingo/" target="_blank">bingo v.0.0.9</a></strong>
                    </div>
                </article>
            </div>
            <div class="column">
                <article class="panel is-primary has-background-white">
                    <p class="panel-heading">
                        Settings
                    </p>
                    <div class="panel-block">
                        <label>Ball Draw Time</label>
                        <strong></strong>
                    </div>
                    <div class="panel-block">
                        <label>Start Game</label>
                        <strong></strong>
                    </div>
                    <div class="panel-block">
                        <label>Auto Start Game</label>
                        <strong></strong>
                    </div>
                    <div class="panel-block">
                        <label>Min Cards Per Game</label>
                        <strong></strong>
                    </div>
                    <div class="panel-block">
                        <label>Max Cards Per Game</label>
                        <strong></strong>
                    </div>
                </article>
            </div>
        </div>

    </div>
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
      ballDrawTime: Number,
      contract: {}
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
    li {
        margin-bottom: 1em;
    }
    label {
        width: 40%;
    }
    .panel-heading {
        font-size: 1.1em;
    }
    .panel-block {
        font-size: 0.9em;
    }
</style>
