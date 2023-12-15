<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-11
 * @LastEditors: lize
-->
<script setup>
const temperature = 0;
const airConditioner = "冷风";
const textColor = "blue";

const onChangeEvent = () => {
  if (temperature > 26) {
    airConditioner = "冷风";
    textColor = "blue";
  } else {
    airConditioner = "暖风";
    textColor = "red";
  }
  let dom = document.getElementById("ac");
  dom.style.color = textColor;
  dom.innerText = airConditioner;
};
</script>

<template>
  <h1 id="ac">{{ airConditioner }}</h1>
  <input type="text" @change="onChangeEvent" />
</template>
