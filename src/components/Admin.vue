<template>
    <a class="admin-link has-text-light" @click="modalActive=(modalActive===false)">
        <span class="icon">
            <i class="fas fa-cog"></i>
        </span>
    </a>
    <div class="modal" :class="{'is-active':modalActive}">
        <div class="modal-background"  @click="modalActive=(modalActive===false)"></div>
        <div class="modal-content has-background-white">
            <div class="admin">
                <nav class="panel">
                    <p class="panel-heading">
                        Admin
                    </p>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Base URI</label>
                        </div>
                        <p class="control is-expanded">
                            <input
                                v-model="baseUri"
                                class="input is-expanded"
                                type="text"
                                placeholder="http://localhost:3000/bingo-json/"
                            />
                        </p>
                   </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Ball Draw Time</label>
                        </div>
                        <p class="control is-expanded">
                            <input
                                    v-model="ballDrawTime"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="60"
                            />
                        </p>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Min Cards Per Game</label>
                        </div>
                        <p class="control is-expanded">
                            <input
                                    v-model="minCardsPerGame"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="1"
                            />
                        </p>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Max Cards Per Game</label>
                        </div>
                        <p class="control is-expanded">
                            <input
                                    v-model="maxCardsPerGame"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="100"
                            />
                        </p>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Price Per Card</label>
                        </div>
                        <p class="control is-expanded">
                            <input
                                    v-model="pricePerCard"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="0.1"
                            />
                        </p>
                    </div>
                    <div class="panel-block">
                        <p class="control is-expanded">
                            <button class="button is-fullwidth is-primary" @click="saveSettings">Save</button>
                        </p>
                    </div>
                    <div class="panel-block">
                        <p class="control is-expanded">
                            <button class="button" @click="requestBall">Request New Ball</button>
                        </p>
                    </div>

                </nav>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"  @click="modalActive=(modalActive===false)"></button>
    </div>
</template>

<script>
  export default {
    name: 'Admin',
    data: function() {
      return {
        modalActive: false,
        baseUri: '',
        ballDrawTime: '',
        minCardsPerGame: '',
        maxCardsPerGame: '',
        pricePerCard: '',
        forceBall: 0,
        ballRequest: '',
      }
    },
    props: {
      account: String,
      contract: Object,
      weedContract: Object,
      refresh: Number
    },
    mounted: function() {
      this.loadData();
    },
    methods: {
      loadData: async function() {
        this.baseUri = await this.contract.baseUri.call();
        this.ballDrawTime = await this.contract.ballDrawTime.call();
        this.minCardsPerGame = await this.contract.minCardsPerGame.call();
        this.maxCardsPerGame = await this.contract.maxCardsPerGame.call();
        this.pricePerCard = await this.contract.pricePerCard.call() / 1e18;
      },
      saveSettings: async function() {
        await this.contract.contractSettings(this.baseUri, this.ballDrawTime, this.minCardsPerGame, this.maxCardsPerGame, String(this.pricePerCard * 1e18));
        this.loadData();
      },
      requestBall: async function() {
        await this.contract.requestRandomBall();
        this.ballRequest = await this.contract.ballRequest.call();
        this.fulfillRandom();

      },
      fulfillRandom: async function() {
        let randomness = Math.round(Math.random() * 10e10);
        await this.contract.fulfillRandomBall(this.ballRequest, randomness);
      },
    }
  }
</script>

<style scoped>
    .field-label {
        min-width: 200px;
    }
    .admin-link {
        position: fixed;
        bottom: 10px;
        right: 10px;
    }
</style>
