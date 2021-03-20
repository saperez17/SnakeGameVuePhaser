<template>
    <div>
        <!-- <TopScore :key="item.key" v-for="item in items"/> -->
        <v-card>
            <v-list>
            <v-subheader>SCOREBOARD</v-subheader>
            <v-list-item :key="i" v-for="(item, i) in scoreData">
                <v-list-item-content>
                    <v-list-item-title v-text="item.Name"></v-list-item-title>

                    {{item.score}}
                </v-list-item-content>
            </v-list-item>
        </v-list>
        </v-card>
        
        <!-- <div v-bind:key="score.Name" v-for="score in scoreData">
            <h3>{{score.Name}}</h3>
            <p>{{score.score}}</p>
        </div> -->
     
    </div>
    
</template>

<script>
import TopScore from './TopScore';
// client-side
const io = require("socket.io-client");

export default {
    name: 'TopScoresBoard',
    props:["scoreData"],
    data(){
        return{
            socket: {},
            items: [
                {
                    id:1,
                    score:20
                },
                {
                    id:2,
                    score:40
                }
            ]
        }
    },
    created(){
         this.socket = io("http://localhost:8090");
         window.addEventListener('keydown', this.keyPressed);
         window.addEventListener('keyup', ()=>{
            this.onCommunication = !this.onCommunication;
        });
    }
}
</script>

<style>

</style>