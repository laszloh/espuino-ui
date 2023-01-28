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
    client_id: string;
    host: string;
    port: number;
    username: string;
    password: string;
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
