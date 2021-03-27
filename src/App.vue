<template>
  <v-app>
    <v-app-bar
      app
      color=""
      light>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src='./assets/UltimateSnakeLogo.png'
          transition="scale-transition"
          width="200"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Contact</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="game-container">
        <v-row  justify="center">
          <v-col md="9" >
            <GameArea/>
          </v-col>
          <v-col md="3" >
              <TopScoresBoard v-bind:scoreData="scores"/>
          </v-col>
        </v-row>
      </v-container >

      <v-container>
        <v-row>
          <v-col md="6">
            <h3 class="">Instructions</h3>
            <section
            ><h4 class="">Welcome to UltimateSnake</h4>
            <p>In this game you'll take the role of an apple rapaicious snake. Your goal is to eat as many
              apples as possible, but watch out, some are poisonous and not very healthy. 
            </p>
              <ul>
                <li>Green apples are healthy and will increase your length by 1 unit.</li>
                <li>Red apples are noxious and will shrink you by 2 units.</li>
                <li>Obstacles appear randomly, do not touch them.</li>
                <li>At the end your score will be reflected on the right-hand side scoreboard</li>
              </ul>
            </section>
          </v-col>
          <v-col md=6>
            <h3 class="">For WebDev</h3>
            <section >
              <h4 >This App's TechStack</h4>
              <h5>Backend</h5>
              <ul>
                <li>Go</li>
                <li>ChiAPI</li>
                <li>CockroachDB</li>
              </ul>
              <v-divider></v-divider>
              <h5>Frontend</h5>
              <ul>
                <li>Vue js + Vuetify</li>
                <li>Phaser 3</li>
              </ul>
            </section>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid class="footer-container">
        <v-footer id="dev">
        <v-card
          flat
          tile
          class="text-center footer-card"
        >
      <v-card-text class=" pt-2 pb-2">
        <!-- Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui.  -->
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4 white--text"
          icon
        >
        <v-icon size="24px">{{ icon }}</v-icon>
        </v-btn>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text class="pb-2 pt-2" style="color=white;">
        {{new Date().getFullYear()}} - <strong>Santiago</strong>
      </v-card-text>
        </v-card>
      </v-footer>
      </v-container>
      
    </v-main>
  </v-app>
</template>

<script>
import GameArea from './components/GameArea';
import TopScoresBoard from './components/TopScoresBoard';
import EventDispatcher from './util/eventDispatcher';
export default {
  name: 'App',

  components: {
    TopScoresBoard,
    GameArea
    // Login
    // GameArea,
  },

  data: () => ({
    emmiter: null,
    downloaded: false,
    gameInstance: null,
    containerId: 'game-container',
    scores: null,
     icons: [
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram',
    ],
  }),
  async mounted(){
    this.axios
    .get('http://localhost:3000/userScore')
    .then(response => {
      this.scores=response.data;
      this.sortData(this.scores);
      console.log(this.scores);
    })

  },
  created(){
     this.emmiter = EventDispatcher.getInstance();
      this.emmiter.on("SCORE_ADDED", (param)=>{
          this.scores.push({
            "Name": param.Name,
            "score": param.score
            })
            this.sortData(this.scores);
      })
  },
  destroyed(){
    this.gameInstance.destroy(false);
  },
  methods:{
    startGame: function(){
      console.log('Starting game..');
    },
    sortData: function(data){
      data.sort((a,b)=>{
              return b.score - a.score
            })
    }
  }
};
</script>

<style scoped>
  #dev{
    padding: 0rem;
  }
  .footer-card{
    position: relative;
    background-color: #222831;
    color: white;
    width: 100%;
    /* height:90px; */
    /* height: 12vh; */
    /* top: 2rem; */
  }
  .game-container{
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    
    /* margin-bottom: 4rem; */
  }
  .footer-container{
    padding:0rem;
    /* position: absolute; */
    bottom: 0px;
    /* height: 30px; */
  }
</style>