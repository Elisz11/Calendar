<script setup>
	import { ref } from "vue";
	import { format } from "date-fns";

	const props = defineProps({
		date: {
			type: Date,
			required: false
		}
	});

	const emit = defineEmits(["new-event", "close"]);

	const newEvent = ref({
		title: "",
		description: "",
		date: format(props.date, "yyyy-MM-dd"),
		subject: "",
		type: "",
		progress: ""
	});

	const inputError = ref();

	function sendNewEvent() {
		if ( !newEvent.value.title || !newEvent.value.date || !newEvent.value.subject || !newEvent.value.type || !newEvent.value.progress ) {
			inputError.value = "Please fill in all required fields.";
			return;
		}
		emit("new-event", { ...newEvent.value });

		newEvent.value = {
			title: "",
			description: "",
			date: "",
			subject: "",
			type: "",
			progress: ""
		};

		emit("close");
	}
	
</script>

<template>
	<div class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center" @click.self="$emit('close')">
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-stone-800 p-6 rounded-lg shadow-lg text-white">
			<span class="text-xl">New event</span>

			<button class="absolute right-3 top-3 text-white text-xl" @click="$emit('close')">x</button>

			<form @submit.prevent="sendNewEvent" class="flex flex-col">
				<label>Title</label>
				<input class="border" v-model="newEvent.title" required />

				<label>Description</label>
				<input class="border" v-model="newEvent.description" />

				<label>Date</label>
				<input type="date" class="border" v-model="newEvent.date" required />

				<label>Subject</label>
				<input class="border" v-model="newEvent.subject" required />

				<label>Type</label>
				<select class="border" v-model="newEvent.type" required>
					<option value="Assignment">Assignment</option>
					<option value="Exam">Exam</option>
					<option value="Oral exam">Oral exam</option>
				<option value="Presentation">Presentation</option>
				</select>

				<label>Progress</label>
				<select class="border" v-model="newEvent.progress" required>
					<option value="Not started">Not started</option>
					<option value="In progress">In progress</option>
					<option value="Completed">Completed</option>
				</select>

				<span class="text-red-700">{{ inputError }}</span>

				<button class="mt-2 bg-white text-black p-2 rounded" type="submit">Add Event</button>
			</form>
		</div>
	</div>
</template>
