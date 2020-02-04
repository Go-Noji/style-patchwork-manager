import {reactive} from "@vue/composition-api";
import {COLORS, DEFAULT_STORAGE_AREA, VERSION} from "@/settings/settings";
import {Preset} from "@/settings/interface";

//保存先
type Storage = 'sync' | 'local';

/**
 * Storage 型のタイプガード
 * @param value
 */
const isStorage = (value: any): value is Storage => {
  return value === 'sync' || value === 'local';
};

//chrome.storage.sync.get で得られるデータの型
interface Setting {
  storage: Storage,
  enable: boolean
}

/**
 * 上記 Setting のタイプがート
 * @param value
 */
const isSetting = (value: any): value is Setting => {
  if (typeof value !== 'object') {
    return false;
  }
  else if ( ! isStorage(value.storage)) {
    return false;
  }
  else if (typeof value.enable !== 'boolean') {
    return false;
  }

  return true;
};

/**
 * Preset 型の配列か判定する
 * @param value
 */
const isPresets = (value: any): value is Preset[] => {
  //配列でなければ異常
  if ( ! (value instanceof Array)) {
    return false;
  }

  //各値を検査
  for (let i = 0, presetMax = value.length; i < presetMax; i = (i + 1) | 0) {
    //検査対象を変数化
    const targetPreset = value[i];

    //title が存在しない
    if (targetPreset.title === undefined || typeof targetPreset.title !== "string") {
      return false;
    }

    //url が存在しない
    if (targetPreset.url === undefined || typeof targetPreset.url !== "string") {
      return false;
    }

    //color が存在しない、もしくは定義外
    if (targetPreset.color === undefined || typeof targetPreset.color !== "string" || ! Object.keys(COLORS).some(key => key === targetPreset.color)) {
      return false;
    }

    //style が無い
    if (targetPreset.style === undefined || typeof targetPreset.style !== "string") {
      return false;
    }

    //Define が存在しない
    if (targetPreset.defines === undefined || ! (targetPreset.defines instanceof Array)) {
      return false;
    }

    //各 Define を検査
    for (let j = 0, defineMax = targetPreset.defines.length; j < defineMax; j = (j + 1) | 0) {
      //検査対象を変数化
      const targetDefine = targetPreset.defines[j];

      //coordinates が存在しない
      if (targetDefine.coordinates === undefined || ! (targetDefine.coordinates instanceof Array)) {
        return false;
      }

      //styles が存在しない
      if (targetDefine.styles === undefined || ! (targetDefine.styles instanceof Array)) {
        return false;
      }

      //各 Coordinates を検査
      for (let k = 0, coordinateMax = targetDefine.coordinates.length; k < coordinateMax; k = (k + 1) | 0) {
        //検査対象を変数化
        const targetCoordinate = targetDefine.coordinates[k];

        //type が正しくない
        if (targetCoordinate.type !== 'style' && targetCoordinate.type !== 'augment' && targetCoordinate.type !== 'tag') {
          return false;
        }

        //key が無い
        if (targetCoordinate.key === undefined || typeof targetCoordinate.key !== "string") {
          return false;
        }

        //values が無い
        if (targetCoordinate.values === undefined || (typeof targetCoordinate.values !== "string" && targetCoordinate.values !== null)) {
          return false;
        }
      }


      //各 style を検査
      for (let k = 0, styleMax = targetDefine.styles.length; k < styleMax; k = (k + 1) | 0) {
        //検査対象を変数化
        const targetStyle = targetDefine.styles[k];

        //property が無い
        if (targetStyle.property === undefined || typeof targetStyle.property !== "string") {
          return false;
        }

        //values が無い
        if (targetStyle.values === undefined || typeof targetStyle.values !== "string") {
          return false;
        }
      }
    }
  }

  //正常判定
  return true;
};

/**
 * Preset を Chrome から取得する
 */
export default () => {
  //バージョン、保存先、On / Off 設定、エラーメッセージ
  const state = reactive<{
    version: string,
    storage: Storage,
    bytes: number,
    enable: boolean,
    error: string
  }>({
    version: VERSION,
    storage: DEFAULT_STORAGE_AREA,
    bytes: 0,
    enable: true,
    error: ''
  });

  /**
   * 現在ストレージで使用中のバイト数を更新する
   */
  const _updateStorageBytes = async () => {
    state.bytes = await (() => new Promise<number>(resolve => {
      chrome.storage[state.storage].getBytesInUse(null, bytes => {
        resolve(Number(bytes));
      });
    }))();
  };

  /**
   * 現在の設定を読み込む
   */
  const getSettings = async () => {
    try {
      //設定の取得を試みる
      const setting = await (() => new Promise<Setting>((resolve, reject) => {
        chrome.storage.sync.get({
          storage: DEFAULT_STORAGE_AREA,
          enable: true
        }, (items) => {
          //取得した情報の型を検査
          if ( ! isSetting(items)) {
            reject({});
            return;
          }

          //返す
          resolve(items);
        });
      }))();

      //現在使用中のバイト数を取得する
      await _updateStorageBytes();

      //設定値を書き換える
      state.storage = setting.storage;
      state.enable = setting.enable;
    }
    catch (e) {
      state.error = '更新に失敗しました';
    }

    //返す
    return state;
  };

  /**
   * storage を変更する
   * @param storage
   */
  const changeStorage = async (storage: Storage) => {
    try {
      //現在の保存先と移行先
      const targetStorage: Storage = storage;
      const nowStorage: Storage = storage === 'local' ? 'sync' : 'local';

      //現在のデータをもう片方に移す
      await (() => new Promise(resolve => {
        chrome.storage[nowStorage].get({presets: '[]'}, (items) => {
          chrome.storage[targetStorage].set({presets: items.presets}, resolve);
        });
      }))();

      //保存先設定の更新を試みる
      await (() =>  new Promise(resolve => {
        chrome.storage.sync.set({storage}, () => {
          resolve();
        });
      }))();

      //古い方のデータを削除する
      await (() => new Promise(resolve => {
        chrome.storage[nowStorage].remove('presets', resolve);
      }))();

      //現在使用中のバイト数を取得する
      await _updateStorageBytes();

      //設定を書き換える
      state.storage = storage;
    }
    catch (e) {
      state.error = '更新に失敗しました';
    }
  };

  /**
   * enable を変更する
   * @param enable
   */
  const changeEnable = async (enable: boolean) => {
    try {
      //更新を試みる
      await (() =>  new Promise(resolve => {
        chrome.storage.sync.set({enable}, () => {
          resolve();
        });
      }))();

      //設定を書き換える
      state.enable = enable;
    }
    catch (e) {
      state.error = '更新に失敗しました';
    }
  };

  /**
   * エクスポート用の json 文字列を作成する
   */
  const exportFileString = async () => {
    //返す値
    let json = '{"preset":[]}';

    try {
      //設定の取得を試みる
      const presets = await (() => new Promise<string>((resolve, reject) => {
        chrome.storage[state.storage].get({
          presets: '[]'
        }, (items) => {
          //取得した情報の型を検査
          if (typeof items.preset !== 'string') {
            reject({});
            return;
          }

          //返す
          resolve(items.preset);
        });
      }))();

      //json を作成
      json = JSON.stringify({presets, version: VERSION})
    }
    catch (e) {
      state.error = '更新に失敗しました';
    }

    //返す
    return json;
  };

  /**
   * ファイルをインポートする
   * @param json
   */
  const importFileString = async (json: string) => {
    //JSON をパース
    const data = JSON.parse(json);

    //プリセットが存在しない場合はエラー
    if (data.presets === undefined || ! isPresets(data.presets)) {
      state.error = 'インポートファイルが不正です';
      return;
    }

    //バージョンがかわっていたらここで何か処理をする

    try {
      //設定の更新を試みる
      await (() => new Promise<string>(resolve => {
        chrome.storage[state.storage].set({presets: data.presets}, () => {
          resolve();
        });
      }))();
    }
    catch (e) {
      state.error = '更新に失敗しました';
    }
  };

  //返す
  return {state, getSettings, changeStorage, changeEnable, exportFileString};
};
