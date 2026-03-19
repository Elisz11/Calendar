<script setup>

    import { ref, onMounted } from "vue";
    import NavbarComponent from "../Components/Navbar.component.vue";

    const colors = [
        "Gray", 
        "Blue", 
        "Green", 
        "Red",  
        "Orange", 
        "Cyan", 
        "Purple", 
        "Brown"
    ];

    const API_URL = import.meta.env.VITE_API_URL;

	onMounted(async () => {
        await fetchSubjects();
    });

	const subjects = ref([]);
	const loading = ref(false);
    const newSubjectTitle = ref("");
    const newSubjectColor = ref("SlateGray");

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

    async function handleCreateSubject() {
        if (!newSubjectTitle.value.trim()) return;
        
        await insertSubjects({
            title: newSubjectTitle.value,
            color: newSubjectColor.value
        });
        
        newSubjectTitle.value = "";
        newSubjectColor.value = "white";
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

            await fetchSubjects();

        } catch (err) {
            console.error(err);
        }
    }
    
    async function handleDeleteSubject(subjectId) {
        if (!confirm("Are you sure you want to delete this subject?")) return;
        await deleteSubject(subjectId);
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
                body: JSON.stringify(subjectData)
            });

            if (!response.ok) throw new Error("Failed to sync with server");
        } catch (err) {
            console.error("Sync error:", err);
        }
    }

</script>

<template>
    <div class="bg-stone-900 min-h-screen text-white">
        <NavbarComponent />

        <div class="max-w-4xl mx-auto p-6">
            <h1 class="text-3xl font-bold mb-8">Settings</h1>
            
            <section class="mb-12">
                <h2 class="text-xl font-semibold p-2">Manage Subjects</h2>
                
                <div class="bg-stone-800 p-4 rounded-lg mb-6 shadow-md">
                    <h3 class="text-sm font-medium text-stone-400 mb-3 uppercase tracking-wider">Add New Subject</h3>
                    <form @submit.prevent="handleCreateSubject" class="flex flex-wrap gap-4 items-end">
                        <div class="grow min-w-50px">
                            <label class="block text-xs text-stone-400 mb-1 ml-1">Title</label>
                            <input 
                                v-model="newSubjectTitle"
                                type="text" 
                                placeholder="Subject title..."
                                class="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 transition-all"
                                required
                            >
                        </div>
                        
                        <div>
                            <label class="block text-xs text-stone-400 mb-1 ml-1">Color</label>
                            <select 
                                v-model="newSubjectColor"
                                class="bg-stone-700 border border-stone-600 rounded px-3 py-2 focus:outline-none focus:ring-2 appearance-none min-w-50px"
                            >
                                <option v-for="color in colors" :key="color" :value="color">
                                    {{ color.charAt(0).toUpperCase() + color.slice(1) }}
                                </option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            class="bg-white text-black font-medium px-6 py-2 rounded transition-colors"
                        >
                            Add Subject
                        </button>
                    </form>
                </div>

                <div class="space-y-3">
                    <div v-if="loading" class="text-stone-500 animate-pulse">Loading subjects...</div>
                    <div v-else-if="subjects.length === 0" class="text-stone-500 italic p-4 text-center border border-dashed border-stone-700 rounded">
                        No subjects created yet.
                    </div>
                    
                    <div 
                        v-for="subject in subjects" 
                        :key="subject.id"
                        class="flex items-center justify-between bg-stone-800/50 border border-stone-700 p-4 rounded-lg group hover:border-stone-500 transition-colors"
                    >
                        <div class="flex items-center gap-4">
                            <div 
                                :style="{ backgroundColor: subject.color }"
                                class="w-4 h-4 rounded-full shadow-sm"
                            ></div>
                            <span class="font-medium text-stone-200">{{ subject.title }}</span>
                        </div>
                        
                        <button 
                            @click="handleDeleteSubject(subject.id)"
                            class="text-stone-500 hover:text-red-400 p-2 rounded-full hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete subject"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>