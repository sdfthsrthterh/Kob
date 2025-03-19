<template>
  <div>Botname: {{ bot_name }}</div>
  <div>Botrating: {{ bot_rating }}</div>
  <router-view/>
</template>

<script>  //写js代码
import $ from 'jquery';
import {  ref } from 'vue';

export default{
  name: "APP",
  setup: () => {
    let bot_name = ref("");
    let bot_rating = ref("");

    $.ajax({
      url: "http://localhost:3000/pk/getbotinfo/",
      type: "get",
      success: resp => {
        console.log(resp);
        bot_name.value = resp.name;
        bot_rating.value = resp.rating;
      }
    });
    return {
      bot_name,
      bot_rating,
    }
  }
}
</script>



<style>  
body{
  background-image: url("@/assets/background2.png");
  background-size: cover;
}
</style>
