<script setup>
    import { useRoute } from 'vue-router';
    import { ref, watch, defineEmits } from 'vue';

    const route = useRoute();
    const path = ref(route.path);

    watch(route, (newRoute) => {
        path.value = newRoute.path;
    });

    defineEmits(['open']);

</script>

<template>
    <nav class="flex justify-between p-2 bg-stone-900">
        <span class="text-4xl text-white m-3">Calendar</span>
        <div class="flex">
            <button class="bg-white text-black p-2 rounded w-30 m-3 cursor-pointer" @click="$emit('open')" v-if="path == '/'">New event</button>
            <RouterLink class="cursor-pointer bg-white rounded m-3 w-10 flex items-center justify-center" :to="path == '/' ? '/settings' : '/'">
                <svg class="w-6 h-6 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" v-if="path == '/'">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"/>
                </svg>
                <svg class="w-6 h-6 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" v-else>
                    <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
                </svg>
            </RouterLink>
        </div>
    </nav>
</template>
