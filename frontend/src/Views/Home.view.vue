<script setup>
    import { add, format, isToday, isSameDay, startOfWeek } from "date-fns";
    import { ref, onMounted, computed } from "vue";
    import CardComponent from "../Components/Card.component.vue";
    import NewEventComponent from "../Components/NewEvent.component.vue";

    const API_URL = "http://localhost:5000/api";

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
        await fetchEvents();
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

</script>

<template>
    <div class=" bg-stone-900 min-h-screen">
        
        <nav class="flex justify-between p-2">
            <span class="text-4xl text-white m-3">Calendar</span>
            <div class="flex">
                <button class="bg-white text-black p-2 rounded w-30 m-3 cursor-pointer" @click=" newEventDate == null; showNewEvent = true">New Event</button>
                <button class="cursor-pointer bg-white rounded m-3 w-10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"/>
                    </svg>
                </button>
            </div>
        </nav>
        
        <div class="flex flex-col">
            
            <div class="flex justify-between items-center text-white">
                <span class="text-xl m-3">{{ format(monday, "MMMM yyyy") }}</span>
                <div class="flex items-center justify-center gap-1 mr-2">
                    <button class="w-7 h-7 rounded bg-white cursor-pointer flex items-center justify-center" @click="prevWeek">
                        <svg class="w-7 h-4.75 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m15 19-7-7 7-7"/>
                            </svg>
                    </button>

                    <button class="w-17 h-7 rounded cursor-pointer flex items-center justify-center" @click="gotoCurrentWeek">Today</button>

                    <button class="w-7 h-7 rounded bg-white text-black cursor-pointer flex items-center justify-center" @click="nextWeek">
                        <svg class="w-7 h-4.75 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m9 5 7 7-7 7"/>
                            </svg>
                    </button>
                </div>
            </div>

            


            <div class="flex w-full">
                <div class="flex w-full flex-col min-h-100" v-for="day in weekDays">
                    <span class="text-center text-stone-600">{{ format(day, "EEEE") }}</span>
                    <div class="flex flex-col border border-stone-600 p-3 flex-1 text-white">
                        <div class="flex justify-between items-center mb-2">
                            <span class="flex items-center justify-center w-7 h-7 rounded" :class="isToday(day) ? 'bg-white text-black' : ''">{{ format(day, "dd") }}</span>
                            <button class="flex items-center justify-center w-7 h-7 rounded hover:bg-white hover:text-black cursor-pointer group" @click="showNewEvent = true; newEventDate = day">
                                <svg class="w-5 h-5 text-white group-hover:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                                </svg>
                            </button>
                        </div>

                        <div v-for="event in showEventsForDay(day)" :key="event.id" class="event-item mb-2 p-2 bg-stone-800 rounded cursor-pointer" @click="showCard(event)">
                            <strong >{{ event.Title }}</strong><br>
                            Subject: {{ event.Subject }}<br>
                            Type: {{ event.Type }}<br>
                            Progress: {{ event.Progress }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <NewEventComponent :date="newEventDate" @new-event="insertEvent" v-if="showNewEvent" @close="showNewEvent = false"/>
        <CardComponent :card="card" v-if="showCardBool == true" @close="showCardBool = false" @card="handleUpdateCard" @delete="deleteEvent(card.id)"/>

    </div>
</template>