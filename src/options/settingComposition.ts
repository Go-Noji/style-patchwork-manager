import {reactive} from "@vue/composition-api";
import {COLORS, DEFAULT_STORAGE_AREA, VERSION} from "@/settings/settings";
import {isPreset, Preset} from "@/settings/interface";

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
  for (let i = 0, max = value.length; i < max; i = (i + 1) | 0) {
    if (isPreset(value[i])) {
      continue;
    }

    //Preset に問題あり
    return false;
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
  const exportFileString = async (): Promise<string> => {
    //返す値
    let json = '{"preset":[],"enable":true,"storage":"sync","version":"'+state.version+'"}';

    try {
      //設定の取得を試みる
      const setting = await (() => new Promise<string>((resolve, reject) => {
        chrome.storage[state.storage].get({
          presets: '[]'
        }, (items) => {
          //取得した情報の型を検査
          if (typeof items.presets !== 'string') {
            reject({});
            return;
          }

          //返す
          resolve(JSON.stringify({presets: items.presets, enable: state.enable, storage: state.storage, version: state.version}));
        });
      }))();

      //json を作成
      json = setting;
    }
    catch (e) {
      state.error = 'エクスポートに失敗しました';
      return '';
    }

    //返す
    return json;
  };

  /**
   * ファイルをインポートする
   * @param json
   */
  const importFileString = async (json: string) => {
    try {
      //JSON をパース
      const data = JSON.parse(json);

      //プリセットが存在しない場合はエラー
      if (data.presets === undefined || ! isPresets(JSON.parse(data.presets))) {
        state.error = 'インポートファイルが不正です';
        return;
      }

      //storage 設定が存在しなかった場合はエラー
      if (data.storage === undefined || ! isStorage(data.storage)) {
        state.error = 'インポートファイルが不正です';
        return;
      }

      //enable 設定が存在しなかった場合はエラー
      if (data.enable === undefined || typeof data.enable !== 'boolean') {
        state.error = 'インポートファイルが不正です';
        return;
      }

      //バージョンがかわっていたらここで何か処理をする

      //設定の更新を試みる
      await (() => new Promise<string>(resolve => {
        //設定の変更を試みる
        chrome.storage.sync.set({storage: data.storage, enable: data.enable}, () => {
          //変更先
          const storage: Storage = data.storage;

          //変更を試みる
          chrome.storage[storage].set({presets: data.presets}, () => {
            resolve();
          });
        });
      }))();
    }
    catch (e) {
      state.error = '更新に失敗しました';
    }
  };

  //返す
  return {state, getSettings, changeStorage, changeEnable, exportFileString, importFileString};
};
