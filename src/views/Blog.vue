<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-08
 * @LastEditors: lize
-->
<template>
  <div class="flex justify-center items-center flex-col">
    <!-- <div>11</div> -->
    <div class="my-4" v-for="bpItem in blogBp">
      <NoteCard :itemMsg="bpItem"></NoteCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blogBp } from "@/views/blue-print";
import NoteCard from "@/components/NoteCard.vue";
console.log(blogBp);
</script>

<style></style>
@/views/blue-print
