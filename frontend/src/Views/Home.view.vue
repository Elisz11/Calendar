<script setup>
    
    import { add, format, isToday, isSameDay, startOfWeek } from "date-fns";
    import { ref, onMounted, computed } from "vue";
    import CardComponent from "../Components/Card.component.vue";
    import NewEventComponent from "../Components/NewEvent.component.vue";
    import NavbarComponent from "../Components/Navbar.component.vue";

    const API_URL = import.meta.env.VITE_API_URL;

    const startWeek = ref(new Date());

    const monday = computed(() =>
        startOfWeek(startWeek.value, { weekStartsOn: 1 })
    );

    const weekDays = computed(() =>
        Array.from({ length: 7 }, (_, i) =>
            add(monday.value, { days: i })
        )
    );

    function nextWeek() {
    startWeek.value = add(startWeek.value, { weeks: 1 });
    }

    function prevWeek() {
    startWeek.value = add(startWeek.value, { weeks: -1 });
    }

    function gotoCurrentWeek() {
        startWeek.value = new Date();
    }
    
    const events = ref([]);

    const loading = ref(false);

    const showNewEvent = ref(false);
    const newEventDate = ref(null);

    onMounted(async () => {
        await fetchSubjects();
        await fetchEvents();
        await fetchTypes();
    });

    async function fetchEvents() {
        try {
            loading.value = true;
            const response = await fetch(`${API_URL}/events`);
            const data = await response.json();
            
            events.value = data.map(event => {
                const parsedDate = new Date(event.date);
                return {
                    id: event.id,
                    Title: event.title,
                    Description: event.description,
                    Date: parsedDate,
                    Subject: event.subject,
                    Type: event.type,
                    Progress: event.progress
                };
            });
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    async function insertEvent(eventData) {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: eventData.title,
                    description: eventData.description,
                    date: eventData.date,
                    subject: eventData.subject,
                    type: eventData.type,
                    progress: eventData.progress
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create event");
            }

            const newEvent = await response.json();

            await fetchEvents();

        } catch (err) {
            console.error(err);
        }
    }
    
    async function deleteEvent(eventId) {
        try {
            const response = await fetch(`${API_URL}/events/${eventId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Failed to delete event");
            await fetchEvents();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleUpdateCard(eventData) {
        const index = events.value.findIndex(e => e.id === eventData.id);

        events.value[index] = {
            ...events.value[index],
            Title: eventData.title,
            Description: eventData.description,
            Date: new Date(eventData.date),
            Subject: eventData.subject,
            Type: eventData.type,
            Progress: eventData.progress
        };

        try {
            const response = await fetch(`${API_URL}/events/${eventData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) throw new Error("Failed to sync with server");
        } catch (err) {
            console.error("Sync error:", err);
        }
    }

    function showEventsForDay(day) {
        if (events.value.length === 0) {
            return [];
        }

        return events.value.filter(event =>
            isSameDay(event.Date, day)
        );
    }

    const showCardBool = ref(false);
    const card = ref({
        title: "",
        description: "",
        date: "",
        subject: "",
        type: "",
        progress: ""
    });

    function showCard(event) {
        card.value = {
            id: event.id,
            title: event.Title,
            description: event.Description,
            date: format(event.Date, "yyyy-MM-dd"),
            subject: event.Subject,
            type: event.Type,
            progress: event.Progress
        };
        showCardBool.value = true;
    }

	const subjects = ref([]);

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

    function getSubjectColor(subjectTitle) {
        const subject = subjects.value.find(s => s.title === subjectTitle);
        return subject ? subject.color : "transparent";
    }

    const types = ref([]);

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

    function getTypeColor(typeTitle) {
        const type = types.value.find(t => t.title === typeTitle);
        return type ? type.color : "transparent";
    }

</script>

<template>
    <div class="bg-stone-900 min-h-screen">
        <NavbarComponent @open="showNewEvent = true; newEventDate = null"/>

        <div class="flex flex-col">
            <div class="flex justify-between items-center text-white">
                <span class="text-xl m-3">{{ format(monday, "MMMM yyyy") }}</span>
                <div class="flex items-center justify-center gap-1 mr-2">
                    <button class="w-7 h-7 rounded bg-white cursor-pointer flex items-center justify-center hover:scale-105 transition-all" @click="prevWeek">
                        <svg class="w-7 h-4.75 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m15 19-7-7 7-7"/>
                        </svg>
                    </button>
                    <button class="w-17 h-7 rounded cursor-pointer flex items-center justify-center hover:scale-105 transition-all text-white" @click="gotoCurrentWeek">Today</button>
                    <button class="w-7 h-7 rounded bg-white text-black cursor-pointer flex items-center justify-center hover:scale-105 transition-all" @click="nextWeek">
                        <svg class="w-7 h-4.75 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m9 5 7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex w-full">
                <div class="flex flex-[1_1_0] min-w-0 flex-col min-h-100" v-for="day in weekDays">
                    <span class="text-center text-stone-400 truncate text-sm">{{ format(day, "EEEE") }}</span>
                    
                    <div class="flex flex-col border border-stone-600 p-2 flex-1 text-white overflow-y-auto max-h-[calc(100vh-200px)]">
                        <div class="flex justify-between items-center mb-2">
                            <span class="shrink-0 flex items-center justify-center w-7 h-7 rounded" :class="isToday(day) ? 'bg-white text-black' : ''">{{ format(day, "dd") }}</span>
                            <button class="shrink-0 flex items-center justify-center w-7 h-7 rounded hover:bg-white hover:text-black cursor-pointer group" @click="showNewEvent = true; newEventDate = day">
                                <svg class="w-5 h-5 text-white group-hover:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                                </svg>
                            </button>
                        </div>

                        <div
                            v-for="event in showEventsForDay(day)"
                            :key="event.id"
                            @click="showCard(event)"
                            class="flex flex-col event-item mb-2 p-2 bg-stone-800 rounded cursor-pointer hover:scale-105 transition-all min-w-0"
                        >
                            <span class="font-bold text-lg leading-tight break-all line-clamp-1">{{ event.Title }}</span>
                            

                            <div class="flex items-center gap-1 min-w-0 text-white pt-1 pb-1">
                                <svg :style="{ color: getSubjectColor(event.Subject) }" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                                <span class="text-xs truncate">{{ event.Subject }}</span>
                            </div>

                            <div class="flex items-center gap-1 min-w-0 text-white pt-1 pb-1">
                                <svg :style="{ color: getTypeColor(event.Type) }" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>
                                <span class="text-xs truncate">{{ event.Type }}</span>
                            </div>


                            <div class="flex items-center gap-1.5 pt-1">
                                <!-- Dynamic Icon -->
                                <span :class="event.Progress === 'Completed' ? 'text-green-400' : event.Progress === 'Not started' ? 'text-red-400' : 'text-yellow-400'">
                                    
                                    <!-- Completed Icon -->
                                    <svg v-if="event.Progress === 'Completed'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>

                                    <!-- Not Started Icon -->
                                    <svg v-else-if="event.Progress === 'Not started'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>

                                    <!-- In Progress Icon -->
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>
                                </span>

                                <span class="text-xs font-semibold tracking-tight" 
                                        :class="event.Progress === 'Completed' ? 'text-green-400' : event.Progress === 'Not started' ? 'text-red-400' : 'text-yellow-400'">
                                    {{ event.Progress }}
                                </span>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <NewEventComponent :date="newEventDate" @new-event="insertEvent" v-if="showNewEvent" @close="showNewEvent = false; newEventDate = null"/>
        <CardComponent :card="card" v-if="showCardBool == true" @close="showCardBool = false" @card="handleUpdateCard" @delete="deleteEvent(card.id)"/>
    </div>
</template>