<script setup>
    import { ref, watch } from "vue";

    const props = defineProps({
        card: {
            type: Object,
            required: true
        }
    });

    const emit = defineEmits(["card", "close"]);

    const localCard = ref({ ...props.card });

    watch(localCard, (newValue) => {
        emit("card", { ...newValue });
    }, { deep: true });

    const inputError = ref();

    function close() {
        if ( !localCard.value.title || !localCard.value.date || !localCard.value.subject || !localCard.value.type || !localCard.value.progress ) {
            inputError.value = "Please fill in all required fields.";
            return;
        }
        emit("close");
    }

    function deleteCard() {
        emit("delete");
        emit("close");
    }

</script>

<template>
    <div class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center" @click.self="close">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-stone-800 p-6 rounded-lg shadow-lg w-100">
            <button class="absolute right-3 top-3 text-white text-xl" @click="close">x</button>

            <form class="flex flex-col text-white">
                <label>Title</label>
                <input class="border" required v-model="localCard.title"/>

                <label>Description</label>
                <input class="border" v-model="localCard.description"/>

                <label>Date</label>
                <input type="date" class="border" v-model="localCard.date" required />

                <label>Subject</label>
                <input class="border" required v-model="localCard.subject" />

                <label>Type</label>
                <select class="border bg-stone-800" v-model="localCard.type" required>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam">Exam</option>
                    <option value="Oral exam">Oral exam</option>
                    <option value="Presentation">Presentation</option>
                </select>

                <label>Progress</label>
                <select class="border bg-stone-800" v-model="localCard.progress" required>
                    <option value="Not started">Not started</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </form>

            <button class="mt-2 w-full bg-red-500 text-white p-1 rounded" @click="deleteCard">Delete</button>
            <span class="text-red-700">{{ inputError }}</span>
        </div>
    </div>
</template>