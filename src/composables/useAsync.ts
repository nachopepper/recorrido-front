import axios from 'axios';
import { ref, readonly } from 'vue';

export function useAsync() {
 
    const results = ref([]);
    const error = ref(null);
    const loading = ref(false);

    const http = axios.create({
        baseURL: process.env.VUE_APP_API_BASE_URL,
        timeout: 10000,
    });

    const asyncRequest = async (method, API_URL, data = null) => {
        try {
            loading.value = true;
            const config = {
                method: method,
                url: API_URL,
                data,
            };
            const response = await http(config);
            results.value = response.data;
        } catch (err) {
            error.value = err;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const resetErrorValue = () => {
        error.value = null;
    };

    const setLoadingValue = (value) => {
        loading.value = value;
    };

    return {
        asyncRequest,
        resetErrorValue,
        setLoadingValue,
        results: readonly(results),
        loading: readonly(loading),
        error: readonly(error),
    };
}
