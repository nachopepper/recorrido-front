<template>
    <div class="row" v-if="loading">
        <div class="col-12">
            Loading...
        </div>
    </div>
    <div v-else-if="!loading && assignations" class="row">
        <div class="col-4 q-pa-md">
            <div class="text-h6">Horas</div>
            <q-markup-table>
                <thead>
                    <tr>
                        <th class="text-center">Nombre</th>
                        <th class="text-center">Horas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(hours, index) in assignations.hours_per_user" :key="index">
                        <td class="text-center" :style="{ backgroundColor: assign_color?.[hours.id] ?? '' }">{{
                            hours.name
                        }}</td>
                        <td class="text-center">{{ hours.hours_assigned }}</td>
                    </tr>
                    <tr>
                        <td class="text-center">Sin asignar</td>
                        <td class="text-center">{{ assignations.hours_available }}</td>
                    </tr>
                </tbody>
            </q-markup-table>
        </div>
        <div class="col-4 q-pa-md" v-for="(assignation, date) in assignations.assignations" :key="date">
            <div class="text-h6">{{ moment(date, 'YYYY-MM-DD').format('dddd D [de] MMMM') }}</div>

            <q-table flat bordered :rows="assignation" :columns="columns" row-key="name" :rows-per-page-options="[0]">
                <template v-slot:body-cell-user_name="props">
                    <q-td :props="props" v-if="props.value"
                        :style="{ backgroundColor: assign_color?.[props.row.user_id] ?? '' }">
                        {{ props.value }}
                    </q-td>
                    <q-td v-else>
                        <q-icon color="yellow" name="warning" />
                    </q-td>
                </template>
                <template v-slot:body-cell-start_time="props">
                    <q-td :props="props"
                        :style="{ backgroundColor: props.row.user_name ? SUCESS_COLOR_TABLE : ERROR_COLOR_TABLE }">
                        {{ props.value }}
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref, watch, onMounted } from 'vue';
import { SUCESS_COLOR_TABLE, ERROR_COLOR_TABLE } from "../constants/index";
import { useAsync } from "../composables/useAsync.ts";
import moment from 'moment';

const { asyncRequest, results, error, loading } = useAsync();
const COLORS = ref([]);

const props = defineProps({
    weeks_params: {
        type: Object,
        required: true
    }
});

const columns = [
    {
        name: 'start_time',
        required: true,
        label: 'Hora',
        align: 'center',
        field: row => row.start_time + '-' + row.end_time,
        format: val => `${val}`,
        sortable: false,
        color: 'red'
    },
    { name: 'user_name', align: 'center', label: 'Nombre', field: 'user_name', sortable: false },
]

const assign_color = ref(null);
const assignations = ref(null);

const getRandomElement = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    COLORS.value = COLORS.value.filter((_, index) => index !== randomIndex);
    return arr[randomIndex];
}


const fetchAssignations = async () => {
    COLORS.value = ['#3F51B5', '#00BCD4', '#4CAF50', '#795548', '#4527A0'];

    const params = '?start_week=' + props.weeks_params.start_week + '&end_week=' + props.weeks_params.end_week;
    await asyncRequest("get", "/assignations" + params);

    if (error.value) {
        console.error("API Error:", error.value);
        return;
    }

    assignations.value = results.value;
    assign_color.value = assignations.value.hours_per_user.reduce((acc, val) => {
        return {
            ...acc,
            [val.id]: getRandomElement(COLORS.value)
        }
    }, {});
};

onMounted(async () => {
    await fetchAssignations();
});

watch(
    () => props.weeks_params,
    async () => {
        await fetchAssignations();
    },
    { deep: true }
);

</script>
