//スタイルを当てる条件
import {COLOR_KEYS, COLORS} from "@/settings/settings";

//COLORS のキーであるか判定する
export const isColorKeys = (value: string): value is COLOR_KEYS => {
  return Object.keys(COLORS).some(color => color === value);
};

//スタイルを当てる条件
export interface Coordinate {
  type: 'style' | 'augment' | 'tag',
  key: string,
  values: string | null
}

/**
 * value が Coordinate 型であるか判定する
 * @param value
 */
export const isCoordinate = (value: any): value is Coordinate => {
  //value がオブジェクトか判定
  if (typeof value !== 'object') {
    return false;
  }

  //type が正しくない
  if (value.type !== 'style' && value.type !== 'augment' && value.type !== 'tag') {
    return false;
  }

  //key が無い
  if (value.key === undefined || typeof value.key !== "string") {
    return false;
  }

  //values が無い
  if (value.values === undefined || (typeof value.values !== "string" && value.values !== null)) {
    return false;
  }

  //問題無し
  return true;
};

//CSS スタイル
export interface Style {
  property: string,
  values: string
}

/**
 * value が Style 型であるか判定する
 * @param value
 */
export const isStyle = (value: any): value is Style => {
  //value がオブジェクトか判定
  if (typeof value !== 'object') {
    return false;
  }

  //property が無い
  if (value.property === undefined || typeof value.property !== "string") {
    return false;
  }

  //values が無い
  if (value.values === undefined || typeof value.values !== "string") {
    return false;
  }

  //問題無し
  return true;
};

//どの条件でなんのスタイルを当てるか
export interface Define {
  coordinates: Coordinate[],
  styles: Style[]
}

/**
 * value が Define 型であるか判定する
 * @param value
 */
export const isDefine = (value: any): value is Define => {
  //value がオブジェクトか判定
  if (typeof value !== 'object') {
    return false;
  }

  //coordinates が存在しない
  if (value.coordinates === undefined || ! (value.coordinates instanceof Array)) {
    return false;
  }

  //styles が存在しない
  if (value.styles === undefined || ! (value.styles instanceof Array)) {
    return false;
  }

  //各 Coordinates を検査
  for (let i = 0, max = value.coordinates.length; i < max; i = (i + 1) | 0) {
    //Coordinates を検査
    if (isCoordinate(value.coordinates[i])) {
      continue;
    }

    //Coordinates 異常検知
    return false;
  }

  //各 Style を検査
  for (let i = 0, max = value.styles.length; i < max; i = (i + 1) | 0) {
    //Style を検査
    if (isStyle(value.styles[i])) {
      continue;
    }

    //Style 異常検知
    return false;
  }

  //問題無し
  return true;
};

//サイトごとに設定できる Define 集
export interface Preset {
  title: string,
  url: string,
  color: string,
  style: string,
  defines: Define[]
}

/**
 * value が Preset 型であるか判定する
 * @param value
 */
export const isPreset = (value: any): value is Preset => {
  //value がオブジェクトか判定
  if (typeof value !== 'object') {
    return false;
  }

  //title が存在しない
  if (value.title === undefined || typeof value.title !== "string") {
    return false;
  }

  //url が存在しない
  if (value.url === undefined || typeof value.url !== "string") {
    return false;
  }

  //color が存在しない、もしくは定義外
  if (value.color === undefined || typeof value.color !== "string" || ! Object.keys(COLORS).some(key => key === value.color)) {
    return false;
  }

  //style が無い
  if (value.style === undefined || typeof value.style !== "string") {
    return false;
  }

  //Define が存在しない
  if (value.defines === undefined || ! (value.defines instanceof Array)) {
    return false;
  }

  //各 Define を検査
  for (let i = 0, max = value.defines.length; i < max; i = (i + 1) | 0) {
    //Define を検査
    if (isDefine(value.defines[i])) {
      continue;
    }

    //Define 異常検知
    return false;
  }

  //問題なし
  return true;
}


