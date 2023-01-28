import { useQuery } from "@sveltestack/svelte-query";
import type { PlayerState } from "../types";
import { AXIOS } from "./endpoints";

const fetchState = async (): Promise<PlayerState> => {
    const resp = await AXIOS.get("/playerState");
    return resp.data;
};

export const usePlayerState = () => {
    return useQuery(["player", "state"], fetchState, {
        staleTime: 1000,
    });
};
