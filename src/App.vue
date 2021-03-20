<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
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
      <!-- <HelloWorld/> -->
      <v-container >
        <v-row no-gutters justify="center">
          <v-col md="9" >
            <!-- <GameArea/> -->
            <div :id="containerId" v-if="downloaded" />
            <div class="placeholder" v-else/>
              Downloading..

            
          </v-col>
          <v-col md="3">
              <TopScoresBoard v-bind:scoreData="scores"/>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import GameArea from './components/GameArea';
import TopScoresBoard from './components/TopScoresBoard';
export default {
  name: 'App',

  components: {
    TopScoresBoard
    // Login
    // GameArea,
  },

  data: () => ({
    downloaded: false,
    gameInstance: null,
    containerId: 'game-container',
    scores: null,
  }),
  async mounted(){
    const game = await import('./game/game');
    this.downloaded = true;
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId);
    });
    this.axios
    .get('http://localhost:3000/userScore')
    .then(response => {
      this.scores=response.data;
      console.log(this.scores);
    })

  },
  destroyed(){
    this.gameInstance.destroy(false);
  },
  methods:{
    startGame: function(){
      console.log('Starting game..');
      
    }
  }
};
</script>
