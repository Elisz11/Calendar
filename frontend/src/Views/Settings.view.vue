<script setup>

    import { ref, onMounted } from "vue";
    import NavbarComponent from "../Components/Navbar.component.vue";

    const colors = ["white", "black", "blue", "yellow", "green", "orange"];

    const API_URL = import.meta.env.VITE_API_URL;

	onMounted(async () => {
        await fetchSubjects();
    });

	const subjects = ref([]);
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

    async function insertSubjects(subjectData) {
        try {
            const response = await fetch(`${API_URL}/subjects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: subjectData.title,
                    color: subjectData.color
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create subject");
            }

            const newEvent = await response.json();

            await fetchSubjects();

        } catch (err) {
            console.error(err);
        }
    }
    
    async function deleteSubject(subjectId) {
        try {
            const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Failed to delete subject");
            await fetchSubjects();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleUpdateSubject(subjectData) {
        const index = subjects.value.findIndex(e => e.id === subjectData.id);

        subjects.value[index] = {
            ...subjects.value[index],
            title: subjectData.title,
            color: subjectData.color
        };

        try {
            const response = await fetch(`${API_URL}/subjects/${subjectData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) throw new Error("Failed to sync with server");
        } catch (err) {
            console.error("Sync error:", err);
        }
    }

</script>

<template>
    <div class=" bg-stone-900 min-h-screen">
    
        <NavbarComponent />

        <div class="text-white">
            <span class="text-2xl">Subjects</span>
            <div>
                <form class="flex gap-2">
                    <label>New Subject</label>
                    <input type="text" >
                    <label>Color</label>
                    <select>
                        <option v-for="subject in subjects" >{{ subject }}</option>
                    </select>
                </form>
            </div>
        </div>
    </div>
</template>