import { writable } from "svelte/store";
import type { SystemState, PlayerState, Settings, Tag, Tags } from "./types";

// settings store
export const settings = writable<Settings>({
  general: {
    volume_start_percent: 0,
    volume_max_speaker_percent: 0,
    volume_max_headphones_percent: 0,
    led_restart_percent: 0,
    led_night_percent: 0,
    power_saving_minutes: 0,
    battery_warning_voltage: 0,
    battery_low_voltage: 0,
    battery_high_voltage: 0,
    battery_interval_minutes: 0,
  },
  wifi: {
    ssid: "",
    password: "",
    hostname: "",
  },
  ftp: {
    enabled: false,
    username: "",
    password: "",
  },
  mqtt: {
    enabled: false,
    host: "",
    port: 0,
    username: "",
    password: "",
  },
});

// system state store
export const systemState = writable<SystemState>();

// player state store
export const playerState = writable<PlayerState>();

// tag store
export const currentTag = writable<Tag>();
export const tags = writable<Tags>();
