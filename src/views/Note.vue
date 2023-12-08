<template>
  <div class="flex justify-center items-center flex-col">
    <!-- <div>11</div> -->
    <div class="my-4" v-for="bpItem in noteBp">
      <NoteCard :itemMsg="bpItem"></NoteCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { noteBp } from "@/views/blue-print.js";
import NoteCard from "@/components/NoteCard.vue";
console.log(noteBp);
</script>

<style></style>
@/views/blue-print
