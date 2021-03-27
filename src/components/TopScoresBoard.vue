<template>
    <div>
        <!-- <TopScore :key="item.key" v-for="item in items"/> -->
        <v-simple-table dark>
            <template>
                <thead>
                    <tr>
                        <th class="text-left">Player</th>
                        <th class="text-left">Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="(item, i) in scoreData"
                    :key="i">
                        <td>{{item.Name}}</td>
                        <td>{{item.score}}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

        <!-- <v-card class="ml-3 text-center">
            <v-list class="">
            <div class="header  text-center" > <h3>SCOREBOARD</h3> </div>
            <v-list-item :key="i" v-for="(item, i) in scoreData">
                <v-list-item-content>
                    <section>
                        <v-list-item-title class="playername" v-text="item.Name"></v-list-item-title>
                        <div class="score">{{item.score}}</div>
                    </section>
                    
                    
                </v-list-item-content>
            </v-list-item>
        </v-list>
        </v-card> -->
        
        <!-- <div v-bind:key="score.Name" v-for="score in scoreData">
            <h3>{{score.Name}}</h3>
            <p>{{score.score}}</p>
        </div> -->
     
    </div>
    
</template>

<script>
import TopScore from './TopScore';


export default {
    name: 'TopScoresBoard',
    props:["scoreData"],
    data(){
        return{
            emmiter: null,
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
      
    },
    mounted(){
        
    }
}
</script>

<style scoped>
@import
url('https://fonts.googleapis.com/css?family=Playfair+Display|Source+Sans+Pro:200,400');
h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
}

p, a, .playername {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 1.1rem;
}
section:hover .playername{
    text-decoration: underline;
    font-weight: 600;
    cursor: pointer;
}
section:hover .score{
    font-size: 1.3rem;
}
.header{
    font-size: 1.5rem;
    align-content: center !important;
}
</style>