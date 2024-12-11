export interface todayWeather {
  ID: number;
  ICON: string;
  POP: string;
  PTY: string;
  PCP: string;
  REH: string;
  SKY: string;
  TMP: string;
  TIME: string;
  TMN: string;
  TMX: string;
}
export interface Location {
  lat: number;
  lng: number;
  x: number;
  y: number;
  regionName?: string;
  addressName?: string;
}
export interface Locations {
  [key: string]: string; // key는 string, value도 string
}

export interface threeDayWeather {
  taMin1: number;
  taMax1: number;
  taMin2: number;
  taMax2: number;
  taMin3: number;
  taMax3: number;
  wf1Am: string;
  wf1Pm: string;
  wf2Am: string;
  wf2Pm: string;
  wf3Am: string;
  wf3Pm: string;
}

export interface weekendWeatherData {
  [key: string]: number | string;
}
