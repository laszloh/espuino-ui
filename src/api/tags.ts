import { useQuery } from "@sveltestack/svelte-query";
import type { Tag, Tags } from "../types";
import { AXIOS } from "./endpoints";

const fetchTagList = async (): Promise<Tags> => {
    const resp = await AXIOS.get("/tagList");
    return resp.data;
};

const fetchCurrentTag = async (): Promise<Tag> => {
    const resp = await AXIOS.get("/currentTag");
    return resp.data;
};

export const useTagList = () => {
    return useQuery(["tag", "list"], fetchTagList, {
        staleTime: Infinity,
    });
};

export const useCurrentTag = () => {
    return useQuery(["tag", "current"], fetchCurrentTag, {
        staleTime: 1000,
    });
};
