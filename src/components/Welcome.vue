<template>
    <div class="columns">
        <div class="column">
            <p>Play BINGO to win ETH prizes and NFTs, then watch your finished BINGO cards turn into unique works of art.</p>
            <br />
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
      value: Number
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
