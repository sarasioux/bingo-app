<template>
    <div class="columns">
        <div class="column">
            <div class="columns" v-if="showHelp">
                <div class="column is-half is-offset-one-quarter">
                    <div class="box has-text-centered">
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
            <figure class="image" v-if="!showHelp">
                <div class="is-hidden-tablet has-text-centered">
                    <a @click="connectWeb3" class="button is-danger is-medium">
                        Connect to Play
                        <span v-if="connectionInProgress">
                            <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span>
                        </span>
                    </a>
                    <br /><br />
                </div>
                <img src="../assets/images/entrance.png" />
                <a @click="connectWeb3" class="button is-danger is-medium connect-button is-hidden-mobile">
                    Connect to Play
                    <span v-if="connectionInProgress">
                        <span class="icon"><i class="fas fa-spinner fa-pulse"></i></span>
                    </span>
                </a>
            </figure>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Welcome',
    data: function() {
      return {
        isConnecting: false,
      }
    },
    watch: {
    },
    props: {
      showHelp: Boolean,
      connectionInProgress: Boolean,
    },
    mounted: async function() {
    },
    methods: {
      connectWeb3: function() {
        this.isConnecting = true;
        this.$emit('connect');
      }
    }
  }
</script>

<style scoped>
    .connect-button {
        position: absolute;
        top: 55%;
        left: 45%;
    }
</style>
