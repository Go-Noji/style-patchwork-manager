export default class FindHtmlElement {

  /**
   * 補足するルート要素を決定する
   * このルート要素の親、兄弟要素はこのクラスの対象にならない
   */
  private target: HTMLElement | null;

  /**
   * 上記ルート要素下の全子孫要素を一次元配列で保持する
   */
  private targets: Array<HTMLElement>;

  /**
   * target が null でないことを保証する Type guard
   * HTMLElement.children から取ってきたオブジェクトに対して用いる
   * @param target
   * @private
   */
  private _isHTMLElement(target: any): target is HTMLElement {
    return  target !== null;
  }

  /**
   * target 下全ての子孫要素の内、計算済みスタイルで property: value が当たっている要素を一次元配列にして返す
   * @param target
   * @private
   */
  private _findChildren(target: HTMLElement): Array<HTMLElement> {
    //直接の子要素を取得
    var children = target.children;

    //フィルタにかけた後の配列を用意
    const targets: Array<HTMLElement> = [];

    //タイプガードにかける
    for (let i = 0, max = children.length; i < max; i = (i + 1) | 0) {
      //タイプガードを効かせるため一旦変数に捕捉
      const child = children.item(i);

      //一致していない場合は弾く
      if ( ! this._isHTMLElement(child)) {
        continue;
      }

      //追加
      targets.push(child);
    }

    //再起検索をかけて返す
    return targets.reduce((prev, current) => [...prev, ...this._findChildren(current)], targets);
  }

  /**
   * 補足するルート要素を決定する
   * @param target
   */
  public constructor(target: HTMLElement | null = null) {
    //補足対象を target が指定されていれば target, 指定されていなければ body タグにする
    this.target = target === null
      ? document.body
      : target;

    //全子要素を保持する
    this.targets = this._findChildren(this.target);
  }

  /**
   * constructor で設定したルート要素下の property('position' 等) に対して value('fixed' 等) が当たっている要素を全て返す
   * @param property
   * @param value
   */
  public findStyledElements(property: string, value: string): Array<HTMLElement> {
    return this.targets.filter(element => window.getComputedStyle(element).getPropertyValue(property) === value);
  }

}
