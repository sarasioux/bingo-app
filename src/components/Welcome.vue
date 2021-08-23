<template>
    <div class="columns">
        <div class="column">
            <p>Play BINGO to win ETH prizes and NFTs, then watch your finished BINGO cards turn into unique works of art.</p>
            <br />
            <div class="columns" v-if="showHelp">
                <div class="column is-half is-offset-one-quarter">
                    <div class="box">
                        <h3 class="title is-4">Please Connect a Web3 Browser to Continue</h3>
                        <a href="https://metamask.io/download" target="_blank"><img src="../assets/images/metamask-logo2.png" /></a>
                        <br /><br />
                        <div class="columns">
                            <div class="column has-text-centered">
                                <div class="title is-5">Metamask Mobile</div>
                                <a href="https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202" target="_blank">App Store</a>
                                | <a >Google Play</a>
                            </div>
                            <div class="column has-text-centered">
                                <div class="title is-5">Metamask Plugin</div>
                                <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank">Chrome Store</a>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
            <a @click="connectWeb3" class="button is-primary is-large">Connect to Play</a>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Welcome',
    data: function() {
      return {
      }
    },
    watch: {
    },
    props: {
      showHelp: Boolean
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
