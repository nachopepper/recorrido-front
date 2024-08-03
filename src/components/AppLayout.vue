<template>
    <div>
        <q-layout container style="height: 100vh" class="shadow-2 rounded-borders">
            <div class="row justify-around q-pa-md">
                <div class="col-5">
                    <q-select v-model="model" :options="array_of_weeks"
                        option-label="name" label="Seleccionar Semana" />
                </div>
                <div class="col-5">
                    <q-select filled v-model="model_services" :options="services" label="Recorrido.cl">
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section avatar>
                                    <q-icon :name="scope.opt.icon" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </div>
            </div>

            <q-page-container>
                <q-page>
                    <slot name="main-content" :model="model"></slot>
                </q-page>
            </q-page-container>
        </q-layout>
    </div>
</template>

<script setup>
import router from "@/router";
import moment from "moment";
import { ref, onMounted, watch } from "vue";
import { useDate } from "@/composables/useDate.ts";
const { model_week: model } = useDate()


// const model = ref({
//     start_week,
//     end_week,
//     name: `Semana: ${start_week} - ${end_week}`
// });

const model_services = ref({
    label: 'Editar asignaciones',
    description: 'Permite editar asignaciones',
    icon: 'local_shipping'
});

const services = [
    {
        label: 'Editar asignaciones',
        description: 'Permite editar asignaciones',
        icon: 'local_shipping',
        route: '/'
    },
    {
        label: 'Ver asignaciones',
        description: 'Permite ver asignaciones',
        icon: 'description',
        route: '/show'
    }
];

const array_of_weeks = ref([]);



onMounted(() => {
    for (let i = 0; i <= 5; i++) {
        const start_week = moment().add(i, 'weeks').startOf('week').format('YYYY/MM/DD');
        const end_week = moment().add(i, 'weeks').endOf('week').format('YYYY/MM/DD');

        array_of_weeks.value.push({ start_week, end_week, name: 'Semana: ' + start_week + ' ' + end_week });
    }
});

watch(
    () => model_services,
    async () => {
        router.push(model_services.value.route);
    },
    { deep: true }
);
</script>