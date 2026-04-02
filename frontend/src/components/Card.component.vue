<script setup>
    import { ref, watch, onMounted} from "vue";
    const API_URL = import.meta.env.VITE_API_URL;

	onMounted(async () => {
        await fetchSubjects();
		await fetchTypes();
    });

	const subjects = ref([]);
	const types = ref([]);
	const loading = ref(false);

    async function fetchSubjects() {
        try {
            loading.value = true;
            const response = await fetch(`${API_URL}/subjects`);
            const data = await response.json();
            
            subjects.value = data.map(subject => {
                return {
                    id: subject.id,
                    title: subject.title,
                    color: subject.color
                };
            });
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

	async function fetchTypes() {
        try {
            loading.value = true;
            const response = await fetch(`${API_URL}/types`);
            const data = await response.json();
            
            types.value = data.map(type => {
                return {
                    id: type.id,
                    title: type.title,
                    color: type.color
                };
            });
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

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
                <label class="text-stone-400">Title</label>
                <input class="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 transition-all" required v-model="localCard.title"/>

                <label class="text-stone-400">Description</label>
                <input class="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 transition-all" v-model="localCard.description"/>

                <label class="text-stone-400">Date</label>
                <input type="date" class="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 transition-all" v-model="localCard.date" required />

                <label class="text-stone-400">Subject</label>
				<select class="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 transition-all" v-model="localCard.subject" required>
					<option v-for="subject in subjects" :key="subject.title" :value="subject.title">
						{{ subject.title }}
					</option>
				</select>

                <label class="text-stone-400">Type</label>
                <select class="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 transition-all" v-model="localCard.type" required>
                    <option v-for="type in types" :key="type.title" :value="type.title">
						{{ type.title }}
					</option>
                </select>

                <label class="text-stone-400">Progress</label>
                <select class="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 transition-all" v-model="localCard.progress" required>
                    <option value="Not started">Not started</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </form>

            <button class="w-full mt-2 bg-red-500 text-white p-2 rounded" type="submit" @click="deleteCard">Delete</button>
            <span class="text-red-700">{{ inputError }}</span>
        </div>
    </div>
</template>