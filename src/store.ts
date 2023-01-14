import axios from "axios";
import { writable, get } from "svelte/store";
import type { SystemState, PlayerState, Settings, Tag, Tags } from "./types";
import { defaultSettings } from "./types";

const API_URL = "/api";

// settings store
const API_SETTINGS = "https://run.mocky.io/v3/bbe6b393-b162-473b-b8dc-69e3c1d56844"; // replace with API_URL + "/settings"

function createSettingsStore() {
  const { subscribe, set } = writable<Settings>(defaultSettings());

  return {
    subscribe,
    init: async () => {
      try {
        const response = await axios.get(API_SETTINGS);
        set(response.data);
      } catch (error) {
        // TODO: do some error handling here
        console.log(error);
      }
    },
    set: async (newSett: Settings) => {
      try {
        const response = await axios.post(API_SETTINGS, newSett);
        // no error until here
        set(response.data);
      } catch (error) {
        // TODO: do some error handling here
        console.log(error);
      }
    },
  };
}

export const settings = createSettingsStore();

// system state store
export const systemState = writable<SystemState>();

// player state store
export const playerState = writable<PlayerState>();

// tag store
export const currentTag = writable<Tag>({
  id: "",
  command: 0,
  pathOrUrl: "",
});

const API_TAGS = "https://run.mocky.io/v3/1aa45660-c69b-43dc-8a64-c05e211cb803"; // replace with API_URL + "/tags"

function createTagsStore() {
  const tagsStore = writable<Tags>();

  return {
    subscribe: tagsStore.subscribe,
    init: async () => {
      try {
        const response = await axios.get(API_TAGS);
        tagsStore.set(response.data);
      } catch (error) {
        // TODO: do some error handling here
        console.log(error);
      }
    },
    insert: async (tag: Tag) => {
      try {
        const newTag = get(tagsStore);
        const response = await axios.post(API_TAGS, [...newTag, tag]);
        tagsStore.set(response.data);
      } catch (error) {
        // TODO: do some error handling here
        console.log(error);
      }
    },
    remove: async (tagId: string) => {
      try {
        const response = await axios.get(API_TAGS);
        tagsStore.set(response.data);
      } catch (error) {
        // TODO: do some error handling here
        console.log(error);
      }
    },
  };
}

export const tags = createTagsStore();
