import { useQuery } from "@sveltestack/svelte-query";
import type { Tag, Tags } from "../types";
import { AXIOS } from "./endpoints";

const fetchTagList = async (page: number): Promise<Tags> => {
    const resp = await AXIOS.get("/tagList?page=" + page);
    return resp.data;
};

const fetchCurrentTag = async (): Promise<Tag> => {
    const resp = await AXIOS.get("/currentTag");
    return resp.data;
};

export const useTagList = (page: number) => {
    return useQuery(["tag", "list", page], () => fetchTagList(page), {
        staleTime: Infinity,
        keepPreviousData: true,
    });
};

export const useCurrentTag = () => {
    return useQuery(["tag", "current"], fetchCurrentTag, {
        staleTime: 1000,
    });
};
