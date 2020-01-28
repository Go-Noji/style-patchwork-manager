//
const run = () => {
  //現在アクティブなタブの取得
  new Promise<chrome.tabs.Tab>(resolve => {
    chrome.tabs.query({active: true}, (tabs: chrome.tabs.Tab[]) => {
      resolve(tabs[0]);
    });
  })

    //タブの取得に成功したら再実行をリクエストする
    .then(tab => {
      chrome.tabs.sendMessage(Number(tab.id), {type: 'run'});
    })
    .catch(reason => {
      console.log(reason);
    })
};

//クリックされたとき
chrome.browserAction.onClicked.addListener(run);
