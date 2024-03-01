<!--
 * @Description: 
 * @Author: lize
 * @Date: 2024-02-29
 * @LastEditors: lize
-->
<template>
    <div class="absolute left-1/2 top-[10%] -translate-x-1/2 h-1/2 w-1/2 ">
        <div class="flex justify-evenly h-full item-center">
            <img class="my-16 h-1/2 w-1/3" :src="props.picture" alt="">
            <div class="my-24 w-1 h-32 bg-red-400"></div>
            <div class="my-16 h-1/2 w-1/3 rounded-lg">
                <div
                    class="indent-4 font-mono text-base font-bold rounded-lg border-x-4 border-t-4  border-cyan-500 border-solid shadow-lg shadow-cyan-500/50 pt-4 h-1/4 w-full">
                    {{ props.name }}
                </div>
                <div
                    class="indent-4 font-mono text-base  rounded-lg border-4 border-cyan-500 border-solid shadow-lg shadow-cyan-500/50 pt-4 h-3/4 w-full ">
                    {{ props.description }}</div>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
const props = defineProps<{
    name: string;
    picture: string;
    description: string;
}>();

// console.log(props);
</script>
    
<style></style>