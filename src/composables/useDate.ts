import { ref } from 'vue';
import moment from 'moment';
const start_week = moment().startOf('week').isoWeekday(1).format('YYYY-MM-DD');
const end_week = moment().endOf('week').isoWeekday(7).format('YYYY-MM-DD');

const model_week = ref({
    start_week,
    end_week,
    name: `Semana: ${start_week} - ${end_week}`
});

export function useDate() {

    return {
        model_week
    }
}
