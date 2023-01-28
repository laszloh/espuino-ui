import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@sveltestack/svelte-query";
import type { Settings, SystemState } from "../types";
import { AXIOS } from "./endpoints";

const fetchState = async (): Promise<SystemState> => {
    const resp = await AXIOS.get("/systemState");
    return resp.data;
};

const fetchSettings = async (): Promise<Settings> => {
    const resp = await AXIOS.get("/systemSettings");
    return resp.data;
};

const postSettings = async (settings: Settings): Promise<Settings> => {
    const resp = await AXIOS.post("/systemSettings", settings);
    return resp.data;
};

export const useSystemState = () => {
    return useQuery(["system", "state"], fetchState, {
        staleTime: 1000,
    });
};

export const useSystemSettings = () => {
    return useQuery(["system", "settings"], fetchSettings, {
        staleTime: Infinity,
    });
};

export const useUpdateSystemSettings = () => {
    return useMutation(postSettings, {
        onSuccess: () => {
            invalidateSystemQueries();
        },
    });
};

export const invalidateSystemQueries = () => {
    const queryClient = useQueryClient();
    return queryClient.invalidateQueries(["system"]);
};
