//拡張機能のバージョン
import {Coordinate, Define, Preset, Style} from "@/settings/interface";

export const version = 0.1;

//拡張機能で扱うカラーセット
export const COLORS = {
  red: '#f44336',
  pink: '#E91E63',
  purple: '#f44336',
  deepPurple: '#9C27B0',
  indigo: '#673AB7',
  blue: '#3F51B5',
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
