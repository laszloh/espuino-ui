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
  pause = 0,
  play,
}

export enum RepeatMode {
  none = 0,
  track,
  playlist,
  track_n_playlist,
}

// structure to hold the current player state
export interface PlayerState {
  play: PlayMode;
  currentTrackNumber: number;
  playlist: string;
  numberofTracks: number;
  volume: number;
  repeat: RepeatMode;
  position: number;
}

export interface SystemState {
  brightness: number;
  rssi: number;
  battery: number;
  charging: boolean;
  info : {
    version : {
      espuino: string;
      git: string;
      idf: string;
    }
    heap: {
      max: number;
			free: number;
			max_alloc: number;
    }
    psram: {
      avaliable: boolean;
      max: number;
			free: number;
			max_alloc: number;
    }
    wifi: {
      ip: string;
      rssi: number;
    }
    hall: {
      avaliable: boolean;
			NullFieldValue: number;
			actual: number;
			diff: number;
			LastWaitForState: number;
			waited: number;
    }
  }
}
