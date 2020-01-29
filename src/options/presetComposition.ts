import {reactive} from "@vue/composition-api";
import {Preset} from "@/settings/interface";
import {DEFAULT_PRESET} from "@/settings/settings";

/**
 * Preset を Chrome から取得する
 */
export default () => {
  //プリセット、ローディングフラグ、エラー文字列
  const state = reactive<{presets: Preset[], loading: boolean, error: string}>({
    presets: [],
    loading: false,
    error: ''
  });

  /**
   * 現在のプリセットを presets へ更新して Chrome に登録する
   * @private
   */
  const _registerPreset = async (presets: Preset[]) => {
    await (() =>  new Promise(resolve => {
      chrome.storage.sync.set({presets: JSON.stringify(presets)}, () => {
        resolve();
      });
    }))();
  };

  /**
   * Chrome のストレージとのやり取りを始める準備を行う
   * 具体的にはエラーメッセージを初期化し、操作中フラグを true にする
   * @private
   */
  const _startSync = () => {
    //操作中フラグを true にする
    state.loading = true;

    //エラーメッセージを初期化
    state.error = '';
  };

  /**
   * データを新たに読み込む
   */
  const readPresets = async () => {
    //データの初期化
    _startSync();

    try {
      //Chrome 内のデータを読み込む
      const presets: Preset[] = await (() => new Promise<Preset[]>(resolve => {
        chrome.storage.sync.get({presets: '[]'}, (items: {[key: string]: any}) => {
          resolve(JSON.parse(String(items.presets)));
        });
      }))();

      //登録
      state.presets = presets;
    }
    catch (e) {
      state.error = 'Chrome からデータが読み込めませんでした。';
    }
    finally {
      //操作中フラグを false にする
      state.loading = false;
    }
  };

  /**
   * プリセットの追加
   */
  const createPreset = async () => {
    //データの初期化
    _startSync();

    //新規プリセットを追加し、追加したプリセットのインデックスを返す
    try {
      //更新するプリセットデータ
      const presets = [...state.presets, DEFAULT_PRESET];

      //更新を試みる
      await _registerPreset(presets);

      //state.presets を書き換える
      state.presets = presets;
    }
    catch (e) {
      state.error = 'プリセットの追加に失敗しました';
      return -1;
    }
    finally {
      //操作中フラグを false にする
      state.loading = false;
    }

    //インデックスを返す
    return state.presets.length;
  };

  /**
   * 指定されたプリセットを更新する
   * @param index
   * @param preset
   */
  const updatePreset = async (index: number, preset: Preset) => {
    //データの初期化
    _startSync();

    //更新
    try {
      //対象データが存在しなかったらエラーを発生させる
      if (state.presets[index] === undefined) {
        throw Error('');
      }

      //更新後のプリセットを作成
      const presets = [...state.presets];
      presets.splice(index, 1, preset);

      //更新を試みる
      await _registerPreset(presets);

      //state.presets を書き換える
      state.presets = presets;
    }
    catch (e) {
      state.error = '更新に失敗しました。';
      return false;
    }
    finally {
      //操作中フラグを false にする
      state.loading = false;
    }

    //成功を返す
    return true;
  };

  /**
   * 指定されたプリセットを削除
   * @param index
   */
  const deletePreset　= async (index: number) => {
    //データの初期化
    _startSync();

    //削除
    try {
      //対象データが存在しなかったらエラーを発生させる
      if (state.presets[index] === undefined) {
        throw Error('');
      }

      //更新後のプリセットを作成
      const presets = [...state.presets];
      presets.splice(index, 1);

      //更新を試みる
      await _registerPreset(presets);

      //state.presets を書き換える
      state.presets = presets;
    }
    catch (e) {
      state.error = '削除に失敗しました。';
      return false;
    }
    finally {
      //操作中フラグを false にする
      state.loading = false;
    }

    //成功を返す
    return true;
  };

  //返す
  return {state, readPresets, createPreset, updatePreset, deletePreset};
};