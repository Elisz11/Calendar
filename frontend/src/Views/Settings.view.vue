<script setup>
    import { ref } from "vue";
    import NavbarComponent from "../Components/Navbar.component.vue";


    const colors = ["white", "black", "blue", "yellow", "green", "orange"];
</script>

<template>
    <div class=" bg-stone-900 min-h-screen">
    
        <NavbarComponent />

        <div class="text-white">
            <span class="text-2xl">Subjects</span>
            <div>
                <form class="flex gap-2">
                    <label>New Subject</label>
                    <input type="text">
                    <label>Color</label>
                    <select>
                        <option v-for="color in colors" >{{ color }}</option>
                    </select>
                </form>
            </div>
        </div>
    </div>
</template>