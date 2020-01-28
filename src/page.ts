import FindHtmlElements from './class/FindHtmlElement';

const runStyling = (instance: FindHtmlElements) => {
  //position: fixed が当たっている要素を取得
  const targets = [...instance.findStyledElements('position', 'fixed'), ...instance.findStyledElements('position', 'sticky')];

  //全て消す
  for (let i = 0, max = targets.length; i < max; i = (i + 1) | 0) {
    targets[i].style.visibility = 'hidden';
  }

  console.log('run');
};

/**
 * DOMContentLoaded 完了後に呼ばれる
 * Chrome Extension は既にDOMContentLoaded イベントが発火し終えた後に呼ばれる可能性があるため関数化
 */
const afterDOMLoaded = () => {
  //要素発見用クラスを用意
  const findHtmlElements = new FindHtmlElements(document.getElementById('main'));

  //起動から 1.5 秒間後に自動起動
  setTimeout(() => {
    //runStyling(findHtmlElements);
  }, 1500);

  //メッセージパッシングを受け取る
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'run':
        runStyling(findHtmlElements);
        break;
    }
  });
};

//DOMContentLoaded イベントが既に発火している場合は即時に初期化関数を呼ぶ
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', afterDOMLoaded);
}
else {
  afterDOMLoaded();
}
