<template>
  <div class="flex justify-center items-center flex-col ">
    <!-- <div>11</div> -->
    <div class="my-4" v-for="bpItem in demoBp">
      <NoteCard :itemMsg="bpItem"></NoteCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { demoBp } from "@/views/blue-print.js";
import NoteCard from "@/components/NoteCard.vue";
console.log(demoBp);
</script>

<style></style>
@/views/blue-print
