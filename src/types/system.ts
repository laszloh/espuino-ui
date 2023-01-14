import type { ModuleNamespace } from "vite/types/hot";

export interface Settings {
  general: {
    volume_start_percent: number;
    volume_max_speaker_percent: number;
    volume_max_headphones_percent: number;
    led_restart_percent: number;
    led_night_percent: number;
    power_saving_minutes: number;
    battery_warning_voltage: number;
    battery_low_voltage: number;
    battery_high_voltage: number;
    battery_interval_minutes: number;
  };
  wifi: {
    ssid: string;
    password: string;
    hostname: string;
  };
  ftp: {
    enabled: boolean;
    username: string;
    password: string;
  };
  mqtt: {
    enabled: boolean;
    host: string;
    port: number;
    username: string;
    password: string;
  };
}

export function defaultSettings(): Settings {
  return {
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
  };
}

export enum PlayMode {
  play = 0,
  pause,
  idle,
}

// structure to hold the current player state
export interface PlayerState {
  mode: PlayMode;
  currentTrackNumber: number;
  title: string;
  numberofTracks: number;
  volume: number;
}

export interface SystemState {
  brightness: number;
  rssi: number;
  battery: number;
  charging: boolean;
}
