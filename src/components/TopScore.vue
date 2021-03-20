<template>
  <v-card width="400px" class="mt-5 mx-a">
      <v-card-title class="pb-0">
          <h5>Username#1</h5>
      </v-card-title>
      <v-card-text>
         <p>{{item}}</p>
      </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'TopScore',
    props: ["item"]
}
</script>

<style>

</style>