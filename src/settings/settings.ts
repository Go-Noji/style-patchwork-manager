import {Coordinate, Define, Preset, Style} from "@/settings/interface";

//拡張機能のバージョン
export const VERSION = '0.1';

export type COLOR_KEYS = 'red' | 'pink' | 'purple' | 'deepPurple' | 'indigo' | 'blue' | 'lightBlue' | 'cyan' | 'teal' | 'green' | 'lightGreen' | 'lime' | 'yellow' | 'amber' | 'orange' | 'deepOrange' | 'brown' | 'grey' | 'blueGray';

//拡張機能で扱うカラーセット
export const COLORS: {[key in COLOR_KEYS]?: string} = {
  red: '#f44336',
  pink: '#E91E63',
  purple: '#9C27B0',
  deepPurple: '#673AB7',
  indigo: '#3F51B5',
  blue: '#2196F3',
  lightBlue: '#03A9F4',
  cyan: '#00BCD4',
  teal: '#009688',
  green: '#4CAF50',
  lightGreen: '#8BC34A',
  lime: '#CDDC39',
  yellow: '#FFEB3B',
  amber: '#FFC107',
  orange: '#FF9800',
  deepOrange: '#FF5722',
  brown: '#795548',
  grey: '#9E9E9E',
  blueGray: '#607D8B'
};

//プリセットの初期値
export const DEFAULT_PRESET: Preset = {
  title: 'Default preset',
  url: '',
  color: 'red',
  style: '',
  defines: []
};

//定義の初期値
export const DEFAULT_DEFINE: Define = {
  coordinates: [],
  styles: []
};

//適用条件の初期値
export const DEFAULT_DEFINE_COORDINATE: Coordinate = {
  type: 'tag',
  key: 'div',
  values: null
};

//適用スタイルの初期値
export const DEFAULT_DEFINE_STYLE: Style = {
  property: 'display',
  values: 'none',
};

//Google のデータ保存先デフォルト値
export const DEFAULT_STORAGE_AREA = 'sync';

//sync ストレージにおける最大値
export const STORAGE_LIMIT_SYNC = 8000;

//local ストレージにおける最大値
export const STORAGE_LIMIT_LOCAL = 5242080;
