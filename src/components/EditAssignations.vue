<template>
    <div class="row" v-if="loading">
        <div class="col-12">
            Loading...
        </div>
    </div>
    <div v-else class="row" v-for="(availability, date) in availabilities_group_by_dates" :key="date">
        <div class="col-12 q-pa-md items-start q-gutter-md">
            <q-card flat bordered class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
                <q-card-section>
                    <div class="text-h6">{{ moment(date, 'YYYY-MM-DD').format('dddd D [de] MMMM') }}</div>
                    <div class="q-pa-md"><q-btn @click="update" color="secondary" icon-right="local_shipping"
                            label="Actualizar">
                            <q-tooltip class="bg-indigo" :offset="[10, 10]">
                                Se actualizará el recorrido para todos los días
                            </q-tooltip>
                        </q-btn></div>
                </q-card-section>
                <q-card-section class="row">
                    <div class="col-4 q-pa-md" v-for="(a, i) in availability" :key="i">
                        <div class="row justify-center" v-if="i === 0 || i === 1 || i === 2">
                            <div class="col-12">
                                <q-btn @click="selectAllDay(availability, a.user_id, true)" width="20px" color="primary"
                                    icon-right="check_box" label="Seleccionar todos" />
                            </div>
                            <div class="col-12 q-pa-md">
                                <q-btn @click="selectAllDay(availability, a.user_id, false)" color="red"
                                    icon-right="check_box_outline_blank " label="Deseleccionar todos" />
                            </div>
                        </div>
                        <q-markup-table :loading="loading">
                            <thead>
                                <tr>
                                    <th v-if="i % 3 == 0" class="text-center">Hora </th>
                                    <th class="text-center">{{ a.user_name }}</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td v-if="i % 3 == 0" class="text-center"
                                        :style="{ backgroundColor: setColor(availability, a.assignation_id) }">{{
                                            a.start_time + '-' + a.end_time }}</td>
                                    <td class="text-center">
                                        <q-checkbox @click="() => console.log('asdsa')"
                                            v-model="selected[a.availability_id]" />
                                    </td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-actions>
                    <div class="row">
                        <div class="col-12">
                        </div>
                    </div>
                </q-card-actions>
            </q-card>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import { ref, defineProps, watch, onMounted } from 'vue';
import { useAsync } from "../composables/useAsync.ts";
import { SUCESS_COLOR_TABLE, ERROR_COLOR_TABLE } from "../constants/index";

const { asyncRequest, results, error, loading } = useAsync();

const props = defineProps({
    weeks_params: {
        type: Object,
        required: true
    }
})

const selected = ref({});
const availabilities_group_by_dates = ref([]);
const availabilities = ref([]);
const hours_per_user = ref({});

const selectAllDay = (availability, user_id, enabled) => {
    availability.filter(val => val.user_id === user_id).forEach(val => {
        selected.value = {
            ...selected.value,
            [val.availability_id]: enabled
        }
    })
    availabilities.value = availabilities.value.map(val => {
        return {
            ...val,
            enabled
        }
    })
}

const setColor = (availability, assignation_id) => {
    const groupedData = availability.filter(val => val.assignation_id == assignation_id).reduce((result, item) => {
        // Usa la fecha como clave para agrupar
        const dateKey = item.assignation_id;

        // Si no existe un grupo para esa fecha, crea uno
        if (!result[dateKey]) {
            result[dateKey] = [];
        }

        // Añade el objeto al grupo correspondiente
        result[dateKey].push(item);

        return result;
    }, {});

    const hasSome = Object.keys(groupedData).some(date =>
        groupedData[date].some(item => item.enabled)
    );

    return hasSome ? SUCESS_COLOR_TABLE : ERROR_COLOR_TABLE;
}

const fetchAvailabilities = async () => {
    selected.value = {};
    hours_per_user.value = {};
    const params = '?start_week=' + props.weeks_params.start_week + '&end_week=' + props.weeks_params.end_week;
    await asyncRequest("get", "/availabilities" + params);

    if (error.value) {
        console.error("API Error:", error.value);
        return;
    }

    availabilities_group_by_dates.value = results.value?.availabilities_group_by_dates || [];
    availabilities.value = results.value?.availabilities || [];

    availabilities.value.forEach(val => {
        if (!hours_per_user.value[val.user_id]) {
            hours_per_user.value = {
                ...hours_per_user.value,
                [val.user_id]: 0
            }
        }
        if (val.enabled) {
            hours_per_user.value = {
                ...hours_per_user.value,
                [val.user_id]: hours_per_user.value[val.user_id] + 1
            };
        }
        selected.value[val.id] = val.enabled;
    });

};

const update = async () => {
    const params = '?start_week=' + props.weeks_params.start_week + '&end_week=' + props.weeks_params.end_week;
    const test = {};
    const data = { data: [], test, hours_per_user: hours_per_user.value };
    for (const [key, value] of Object.entries(selected.value)) {
        const availability = availabilities.value.find(val => val.id == key);
        data.data.push({ id: key, enabled: value, user_id: availability.user_id, assignation_id: availability.assignation_id });
        if (!test[availability.assignation.date]) {
            test[availability.assignation.date] = {};
        }
        if (!test[availability.assignation.date][availability.assignation_id]) {
            test[availability.assignation.date][availability.assignation_id] = {};
        }
        test[availability.assignation.date][availability.assignation_id] = { ...test[availability.assignation.date][availability.assignation_id], [availability.user_id]: value }

    }
    selected.value = {};

    await asyncRequest("post", "/availabilities/update_multiple" + params, data);

    if (error.value) {
        console.error("API Error:", error.value);
        return;
    }

    await fetchAvailabilities();
}

onMounted(async () => {
    await fetchAvailabilities();
});

watch(
    () => props.weeks_params,
    async () => {
        await fetchAvailabilities();
    },
    { deep: true }
);
</script>