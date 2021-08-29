<template>
    <div class="console section has-background-danger">
        <div class="columns is-gapless no-margin">
            <div class="column nav-col">
                <h1 class="tagline title has-text-white has-text-centered is-4">The world's first<br />blockchain-based bingo.</h1>
            </div>
            <div class="column is-3">
                <img src="../../public/logo3.png" class="logo" />
            </div>
            <div class="column nav-col">
                <nav class="primary-navbar navbar is-transparent has-background-danger" role="navigation" aria-label="main navigation">
                    <div class="navbar-brand">
                        <a role="button" class="navbar-burger has-text-white" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" class="navbar-menu">
                        <div class="navbar-start">
                        </div>

                        <div class="navbar-end">
                            <a class="navbar-item has-text-primary-light">
                                Play
                            </a>
                            <a class="navbar-item has-text-primary-light">
                                About
                            </a>
                            <a class="navbar-item has-text-primary-light">
                                Prizes
                            </a>
                            <a class="navbar-item has-text-primary-light">
                                Contact
                            </a>
                            &nbsp;
                            <a class="navbar-item has-text-primary-light">
                                <span class="icon"><i class="fab fa-2x fa-twitter"></i></span>
                            </a>
                            &nbsp;
                            <a class="navbar-item has-text-primary-light">
                                <span class="icon"><i class="fab fa-2x fa-discord"></i></span>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
        <div class="box has-background-primary">
            <div class="columns">
                <div class="column is-3 game-data">
                    <div class="columns is-multiline is-mobile">
                        <div class="column">
                            <div class="box has-text-centered">
                                <div class="has-text-weight-bold">NFT Prize</div>
                                <figure class="image is-square">
                                    <img src="https://bulma.io/images/placeholders/128x128.png">
                                </figure>
                                <label class="label has-text-primary has-margin">Stoners Rock</label>
                            </div>
                        </div>
                        <div class="column">
                            <div class="box has-text-centered">
                                <div class="has-text-weight-bold">Pattern</div>
                                <figure class="image is-square">
                                    <img src="https://bulma.io/images/placeholders/128x128.png">
                                </figure>
                                <label class="label has-text-primary has-margin">Full Card</label>
                            </div>
                        </div>
                        <div class="column is-12">
                            <div class="box has-text-centered">
                                <span class="title is-5 has-text-primary has-text-weight-bold">0.025 ETH</span>
                                <label class="label">Cash Prize</label>
                            </div>
                            <div class="box">
                                <div class="title is-6 half-margin-bottom">
                                    Game <span class="has-text-primary">#6</span>
                                </div>
                                <div class="columns is-gapless has-text-centered is-mobile half-margin-bottom">
                                    <div class="column">
                                        <span class="title is-6 has-text-primary">999</span>
                                        <label class="label is-small">Remaining</label>
                                    </div>
                                    <div class="column">
                                        <span class="title is-6 has-text-primary">0.025</span>
                                        <label class="label is-small">Price</label>
                                    </div>
                                    <div class="column">
                                        <span class="title is-6 has-text-primary">4,306,293</span>
                                        <label class="label is-small">Balance</label>
                                    </div>
                                </div>

                                <div class="field has-addons">
                                    <div class="control">
                                        <div class="select">
                                            <select v-model="currencyChoice">
                                                <option>ETH</option>
                                                <option>WEED</option>
                                            </select>
                                        </div>

                                    </div>
                                    <p class="control is-expanded">
                                        <input v-model="mintAmount" class="input" type="number" min="1" max="10" step="1" placeholder="# of Cards">
                                    </p>
                                </div>

                                <div class="columns is-mobile">
                                    <div class="column">
                                        <a class="button is-primary" @click="mint">
                                            Buy Cards
                                        </a>
                                    </div>
                                    <div class="column has-text-centered">
                                        <div class="title is-primary is-6 has-text-primary">0.025 ETH</div>
                                        <div class="subtitle is-7">Total</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="box">
                        <nav class="navbar" role="navigation" aria-label="main navigation">
                            <div class="navbar-brand">
                                <div class="navbar-item">
                                    <h2 class="title has-text-primary is-5">Your Current Cards</h2>
                                </div>

                                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                </a>
                            </div>

                            <div id="navbarBasicExample" class="navbar-menu">
                                <div class="navbar-start">
                                </div>

                                <div class="navbar-end">
                                    <div class="navbar-item has-dropdown is-hoverable">
                                        <a class="navbar-link">
                                            More
                                        </a>

                                        <div class="navbar-dropdown">
                                            <a class="navbar-item">
                                                Your Current Cards
                                            </a>
                                            <a class="navbar-item">
                                                Your Previous Cards
                                            </a>
                                            <a class="navbar-item">
                                                All Current Cards
                                            </a>
                                            <a class="navbar-item">
                                                Previous Games
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </nav>
                        <div class="is-scrollable">
                            <div class="columns is-multiline">
                                <div class="column is-4" v-for="i in 9" :key="i">
                                    <div class="card">
                                        <div class="card-image">
                                            <figure class="image is-square">
                                                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
                                            </figure>
                                        </div>
                                        <footer class="card-footer">
                                            <div class="card-footer-item">
                                                <a href="#" class="button is-small is-primary">Claim Bingo</a>
                                                <!-- <h3 class="title is-6 has-text-centered">Card #1</h3> //-->
                                            </div>

                                        </footer>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="column is-3">
                    <div class="box letter-box">
                        <div class="columns is-mobile">
                            <div v-for="k in 5" :key="k" class="column">
                                <div class="label has-text-primary letter is-large">
                                    {{letters[k]}}
                                </div>
                                <div v-for="i in 15" :key="i" class="ball">
                                    {{i + (k-1)*15}}
                                </div>
                            </div>
                        </div>
                        <div class="columns is-gapless has-text-centered is-mobile">
                            <div class="column">
                                <span class="title is-5 has-text-primary" @click="ballModal=true">B14</span>
                                <label class="label is-small">Last</label>
                            </div>
                            <div class="column">
                                <span class="title is-5 has-text-primary">34 seconds</span>
                                <label class="label is-small">Next</label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="modal" :class="{'is-active':ballModal}">
            <div class="modal-background" @click="ballModal=false"></div>
            <div class="modal-content has-text-centered">
                <h2 class="title has-text-white">New Ball Dropping</h2>
                <div class="fa-10x has-text-primary">
                    <i class="fas fa-spinner fa-pulse"></i>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="ballModal=false"></button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Console',
    data: function() {
      return {
        entered: false,
        numCards: '',
        letters: {
          1: 'B',
          2: 'I',
          3: 'N',
          4: 'G',
          5: 'O'
        },

        ballModal: false
      }
    },
    watch: {
      isReady: function() {
        this.loadData();
      }
    },
    props: {
      isReady: Boolean,
      contract: Object,
      account: String,
    },
    mounted: async function() {
      this.loadData();
    },
    methods: {
      loadData: async function() {
        if(this.contract.address) {
          this.numCards = parseInt(await this.contract.balanceOf.call(this.account));
          console.log('numcards', this.numCards);
        }
      },
      connectWeb3: function() {
        this.$emit('connect');
      }
    }
  }
</script>

<style scoped>
    .console.section {
        height: 100%;
        padding: 1em;
    }

    .tag.margin-tag {
        margin-top: 1em;
    }
    .mint-help {
        padding-left: 1em;
        padding-top: 0.5em;
    }

    .has-margin {
        margin-top: 0.5em;
        margin-bottom: 0;
    }

    .no-margin {
        margin: 0 !important;
    }

    .box {
        padding: 0.8em;
    }
    .letter-box {
        padding: 1.4em;
        text-align: center;
    }
    .is-scrollable {
        max-height: 442px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0 0.5em;

    }
    .nav-col {
        padding-top: 2em;
    }
    .primary-navbar {
        margin-top: 1em;
    }
    .tagline {
        margin-top: 1em;
    }
    .half-margin-bottom {
        margin-bottom: 0.5em;
    }
</style>
