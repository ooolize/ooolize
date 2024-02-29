<template>
    <div class="flex justify-around items-center">
        <div class="w-64 mx-16 h-4 bg-[#ff4646] rounded-lg"></div>
        <p> {{ props.title }} </p>
        <div class="w-64 mx-16 h-4 bg-[#ff4646] rounded-lg"></div>
    </div>
</template>
    
<script setup lang='ts'>
const props = defineProps<{
    title: string;
}>();
</script>
    
<style></style>