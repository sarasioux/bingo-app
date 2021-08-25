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
                            <label class="label">Ball Draw Time</label>
                        </div>
                        <div class="control is-expanded">
                            <input
                                    v-model="ballDrawTime"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="60"
                            />
                            <p class="help">Seconds between ball draws. 60 is the minimum.</p>
                        </div>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Min Cards Per Game</label>
                        </div>
                        <div class="control is-expanded">
                            <input
                                    v-model="minCardsPerGame"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="1"
                            />
                            <p class="help">Minimum cards to sell before balls start drawing.</p>
                        </div>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Max Cards Per Game</label>
                        </div>
                        <div class="control is-expanded">
                            <input
                                    v-model="maxCardsPerGame"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="100"
                            />
                            <p class="help">Maximum cards to sell per game round.</p>
                        </div>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Price Per Card</label>
                        </div>
                        <div class="control is-expanded">
                            <input
                                    v-model="pricePerCard"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="0.1"
                            />
                        </div>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Prize Split</label>
                        </div>
                        <div class="control is-expanded">
                            <input
                                    v-model="prizeSplit"
                                    class="input is-expanded"
                                    type="text"
                                    placeholder="2"
                            />
                            <p class="help">The denominator in the prize split. Higher number is smaller payout.</p>
                        </div>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Pattern</label>
                        </div>
                        <div class="control is-expanded">
                            <div class="select">
                                <select v-model="pattern">
                                    <option value="1" :selected="pattern === 1">Line</option>
                                    <option value="2">X</option>
                                    <option value="3">Full Card</option>
                                    <option value="4">Four Corners</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Start Game</label>
                        </div>
                        <div class="control is-expanded">
                            <div class="control">
                                <label class="radio">
                                    <input type="radio" name="startGame" v-model="startGame" value="true">
                                    Yes
                                </label>
                                <label class="radio">
                                    <input type="radio" name="startGame" v-model="startGame" value="false">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Auto Start Game</label>
                        </div>
                        <div class="control is-expanded">
                            <div class="control">
                                <label class="radio">
                                    <input type="radio" name="autoStart" v-model="startAuto" value="true">
                                    Yes
                                </label>
                                <label class="radio">
                                    <input type="radio" name="autoStart" v-model="startAuto" value="false">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="panel-block">
                        <p class="control is-expanded">
                            <button class="button is-fullwidth is-primary" @click="saveSettings">Save</button>
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
        prizeSplit: '',
        ballRequest: '',
        pattern: '',
        startGame: false,
        startAuto: false,
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
        this.ballDrawTime = await this.contract.ballDrawTime.call();
        this.minCardsPerGame = await this.contract.minCards.call();
        this.maxCardsPerGame = await this.contract.maxCards.call();
        this.pricePerCard = await this.contract.pricePerCard.call() / 1e18;
        this.prizeSplit = parseInt(await this.contract.prizeSplit.call());
        this.pattern = parseInt(await this.contract.pattern.call());
        this.startGame = await this.contract.startGame.call();
        this.startAuto = await this.contract.startAuto.call();
      },
      saveSettings: async function() {
        await this.contract.contractSettings(
          this.startGame,
          this.startAuto,
          this.ballDrawTime,
          this.minCardsPerGame,
          this.maxCardsPerGame,
          String(this.pricePerCard * 1e18),
          this.prizeSplit,
          this.pattern,
          this.account
        );
        this.loadData();
      }
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
