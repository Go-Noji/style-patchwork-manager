/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/page.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/class/FindHtmlElement.ts":
/*!**************************************!*\
  !*** ./src/class/FindHtmlElement.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var FindHtmlElement = /** @class */ (function () {
    /**
     * 補足するルート要素を決定する
     * @param target
     */
    function FindHtmlElement(target) {
        if (target === void 0) { target = null; }
        //補足対象を target が指定されていれば target, 指定されていなければ body タグにする
        this.target = target === null
            ? document.body
            : target;
        //全子要素を保持する
        this.targets = this._findChildren(this.target);
    }
    /**
     * target が null でないことを保証する Type guard
     * HTMLElement.children から取ってきたオブジェクトに対して用いる
     * @param target
     * @private
     */
    FindHtmlElement.prototype._isHTMLElement = function (target) {
        return target !== null;
    };
    /**
     * target 下全ての子孫要素の内、計算済みスタイルで property: value が当たっている要素を一次元配列にして返す
     * @param target
     * @private
     */
    FindHtmlElement.prototype._findChildren = function (target) {
        var _this = this;
        //直接の子要素を取得
        var children = target.children;
        //フィルタにかけた後の配列を用意
        var targets = [];
        //タイプガードにかける
        for (var i = 0, max = children.length; i < max; i = (i + 1) | 0) {
            //タイプガードを効かせるため一旦変数に捕捉
            var child = children.item(i);
            //一致していない場合は弾く
            if (!this._isHTMLElement(child)) {
                continue;
            }
            //追加
            targets.push(child);
        }
        //再起検索をかけて返す
        return targets.reduce(function (prev, current) { return __spreadArrays(prev, _this._findChildren(current)); }, targets);
    };
    /**
     * constructor で設定したルート要素下の property('position' 等) に対して value('fixed' 等) が当たっている要素を全て返す
     * @param property
     * @param value
     */
    FindHtmlElement.prototype.findStyledElements = function (property, value) {
        return this.targets.filter(function (element) { return window.getComputedStyle(element).getPropertyValue(property) === value; });
    };
    return FindHtmlElement;
}());
/* harmony default export */ __webpack_exports__["default"] = (FindHtmlElement);


/***/ }),

/***/ "./src/page.ts":
/*!*********************!*\
  !*** ./src/page.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _class_FindHtmlElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./class/FindHtmlElement */ "./src/class/FindHtmlElement.ts");
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

var runStyling = function (instance) {
    //position: fixed が当たっている要素を取得
    var targets = __spreadArrays(instance.findStyledElements('position', 'fixed'), instance.findStyledElements('position', 'sticky'));
    //全て消す
    for (var i = 0, max = targets.length; i < max; i = (i + 1) | 0) {
        targets[i].style.visibility = 'hidden';
    }
    console.log('run');
};
/**
 * DOMContentLoaded 完了後に呼ばれる
 * Chrome Extension は既にDOMContentLoaded イベントが発火し終えた後に呼ばれる可能性があるため関数化
 */
var afterDOMLoaded = function () {
    //要素発見用クラスを用意
    var findHtmlElements = new _class_FindHtmlElement__WEBPACK_IMPORTED_MODULE_0__["default"](document.getElementById('main'));
    //起動から 1.5 秒間後に自動起動
    setTimeout(function () {
        //runStyling(findHtmlElements);
    }, 1500);
    //メッセージパッシングを受け取る
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.type) {
            case 'run':
                runStyling(findHtmlElements);
                break;
        }
    });
};
//DOMContentLoaded イベントが既に発火している場合は即時に初期化関数を呼ぶ
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
}
else {
    afterDOMLoaded();
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzL0ZpbmRIdG1sRWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkE7SUFxREU7OztPQUdHO0lBQ0gseUJBQW1CLE1BQWlDO1FBQWpDLHNDQUFpQztRQUNsRCxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEtBQUssSUFBSTtZQUMzQixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDZixDQUFDLENBQUMsTUFBTSxDQUFDO1FBRVgsV0FBVztRQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJ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TUFBTTtTQUNUO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRiw4Q0FBOEM7QUFDOUMsSUFBRyxRQUFRLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtJQUNwQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLENBQUM7Q0FDL0Q7S0FDSTtJQUNILGNBQWMsRUFBRSxDQUFDO0NBQ2xCIiwiZmlsZSI6InBhZ2UuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGFnZS50c1wiKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbmRIdG1sRWxlbWVudCB7XHJcblxyXG4gIC8qKlxyXG4gICAqIOijnOi2s+OBmeOCi+ODq+ODvOODiOimgee0oOOCkuaxuuWumuOBmeOCi1xyXG4gICAqIOOBk+OBruODq+ODvOODiOimgee0oOOBruimquOAgeWFhOW8n+imgee0oOOBr+OBk+OBruOCr+ODqeOCueOBruWvvuixoeOBq+OBquOCieOBquOBhFxyXG4gICAqL1xyXG4gIHByaXZhdGUgdGFyZ2V0OiBIVE1MRWxlbWVudCB8IG51bGw7XHJcblxyXG4gIC8qKlxyXG4gICAqIOS4iuiomOODq+ODvOODiOimgee0oOS4i+OBruWFqOWtkOWtq+imgee0oOOCkuS4gOasoeWFg+mFjeWIl+OBp+S/neaMgeOBmeOCi1xyXG4gICAqL1xyXG4gIHByaXZhdGUgdGFyZ2V0czogQXJyYXk8SFRNTEVsZW1lbnQ+O1xyXG5cclxuICAvKipcclxuICAgKiB0YXJnZXQg44GMIG51bGwg44Gn44Gq44GE44GT44Go44KS5L+d6Ki844GZ44KLIFR5cGUgZ3VhcmRcclxuICAgKiBIVE1MRWxlbWVudC5jaGlsZHJlbiDjgYvjgonlj5bjgaPjgabjgY3jgZ/jgqrjg5bjgrjjgqfjgq/jg4jjgavlr77jgZfjgabnlKjjgYTjgotcclxuICAgKiBAcGFyYW0gdGFyZ2V0XHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBwcml2YXRlIF9pc0hUTUxFbGVtZW50KHRhcmdldDogYW55KTogdGFyZ2V0IGlzIEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiAgdGFyZ2V0ICE9PSBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdGFyZ2V0IOS4i+WFqOOBpuOBruWtkOWtq+imgee0oOOBruWGheOAgeioiOeul+a4iOOBv+OCueOCv+OCpOODq+OBpyBwcm9wZXJ0eTogdmFsdWUg44GM5b2T44Gf44Gj44Gm44GE44KL6KaB57Sg44KS5LiA5qyh5YWD6YWN5YiX44Gr44GX44Gm6L+U44GZXHJcbiAgICogQHBhcmFtIHRhcmdldFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfZmluZENoaWxkcmVuKHRhcmdldDogSFRNTEVsZW1lbnQpOiBBcnJheTxIVE1MRWxlbWVudD4ge1xyXG4gICAgLy/nm7TmjqXjga7lrZDopoHntKDjgpLlj5blvpdcclxuICAgIHZhciBjaGlsZHJlbiA9IHRhcmdldC5jaGlsZHJlbjtcclxuXHJcbiAgICAvL+ODleOCo+ODq+OCv+OBq+OBi+OBkeOBn+W+jOOBrumFjeWIl+OCkueUqOaEj1xyXG4gICAgY29uc3QgdGFyZ2V0czogQXJyYXk8SFRNTEVsZW1lbnQ+ID0gW107XHJcblxyXG4gICAgLy/jgr/jgqTjg5fjgqzjg7zjg4njgavjgYvjgZHjgotcclxuICAgIGZvciAobGV0IGkgPSAwLCBtYXggPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBtYXg7IGkgPSAoaSArIDEpIHwgMCkge1xyXG4gICAgICAvL+OCv+OCpOODl+OCrOODvOODieOCkuWKueOBi+OBm+OCi+OBn+OCgeS4gOaXpuWkieaVsOOBq+aNleaNiVxyXG4gICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuLml0ZW0oaSk7XHJcblxyXG4gICAgICAvL+S4gOiHtOOBl+OBpuOBhOOBquOBhOWgtOWQiOOBr+W8vuOBj1xyXG4gICAgICBpZiAoICEgdGhpcy5faXNIVE1MRWxlbWVudChjaGlsZCkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy/ov73liqBcclxuICAgICAgdGFyZ2V0cy5wdXNoKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+WGjei1t+aknOe0ouOCkuOBi+OBkeOBpui/lOOBmVxyXG4gICAgcmV0dXJuIHRhcmdldHMucmVkdWNlKChwcmV2LCBjdXJyZW50KSA9PiBbLi4ucHJldiwgLi4udGhpcy5fZmluZENoaWxkcmVuKGN1cnJlbnQpXSwgdGFyZ2V0cyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDoo5zotrPjgZnjgovjg6vjg7zjg4jopoHntKDjgpLmsbrlrprjgZnjgotcclxuICAgKiBAcGFyYW0gdGFyZ2V0XHJcbiAgICovXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHRhcmdldDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbCkge1xyXG4gICAgLy/oo5zotrPlr77osaHjgpIgdGFyZ2V0IOOBjOaMh+WumuOBleOCjOOBpuOBhOOCjOOBsCB0YXJnZXQsIOaMh+WumuOBleOCjOOBpuOBhOOBquOBkeOCjOOBsCBib2R5IOOCv+OCsOOBq+OBmeOCi1xyXG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQgPT09IG51bGxcclxuICAgICAgPyBkb2N1bWVudC5ib2R5XHJcbiAgICAgIDogdGFyZ2V0O1xyXG5cclxuICAgIC8v5YWo5a2Q6KaB57Sg44KS5L+d5oyB44GZ44KLXHJcbiAgICB0aGlzLnRhcmdldHMgPSB0aGlzLl9maW5kQ2hpbGRyZW4odGhpcy50YXJnZXQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY29uc3RydWN0b3Ig44Gn6Kit5a6a44GX44Gf44Or44O844OI6KaB57Sg5LiL44GuIHByb3BlcnR5KCdwb3NpdGlvbicg562JKSDjgavlr77jgZfjgaYgdmFsdWUoJ2ZpeGVkJyDnrYkpIOOBjOW9k+OBn+OBo+OBpuOBhOOCi+imgee0oOOCkuWFqOOBpui/lOOBmVxyXG4gICAqIEBwYXJhbSBwcm9wZXJ0eVxyXG4gICAqIEBwYXJhbSB2YWx1ZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBmaW5kU3R5bGVkRWxlbWVudHMocHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IEFycmF5PEhUTUxFbGVtZW50PiB7XHJcbiAgICByZXR1cm4gdGhpcy50YXJnZXRzLmZpbHRlcihlbGVtZW50ID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpID09PSB2YWx1ZSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgRmluZEh0bWxFbGVtZW50cyBmcm9tICcuL2NsYXNzL0ZpbmRIdG1sRWxlbWVudCc7XHJcblxyXG5jb25zdCBydW5TdHlsaW5nID0gKGluc3RhbmNlOiBGaW5kSHRtbEVsZW1lbnRzKSA9PiB7XHJcbiAgLy9wb3NpdGlvbjogZml4ZWQg44GM5b2T44Gf44Gj44Gm44GE44KL6KaB57Sg44KS5Y+W5b6XXHJcbiAgY29uc3QgdGFyZ2V0cyA9IFsuLi5pbnN0YW5jZS5maW5kU3R5bGVkRWxlbWVudHMoJ3Bvc2l0aW9uJywgJ2ZpeGVkJyksIC4uLmluc3RhbmNlLmZpbmRTdHlsZWRFbGVtZW50cygncG9zaXRpb24nLCAnc3RpY2t5JyldO1xyXG5cclxuICAvL+WFqOOBpua2iOOBmVxyXG4gIGZvciAobGV0IGkgPSAwLCBtYXggPSB0YXJnZXRzLmxlbmd0aDsgaSA8IG1heDsgaSA9IChpICsgMSkgfCAwKSB7XHJcbiAgICB0YXJnZXRzW2ldLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKCdydW4nKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBET01Db250ZW50TG9hZGVkIOWujOS6huW+jOOBq+WRvOOBsOOCjOOCi1xyXG4gKiBDaHJvbWUgRXh0ZW5zaW9uIOOBr+aXouOBq0RPTUNvbnRlbnRMb2FkZWQg44Kk44OZ44Oz44OI44GM55m654Gr44GX57WC44GI44Gf5b6M44Gr5ZG844Gw44KM44KL5Y+v6IO95oCn44GM44GC44KL44Gf44KB6Zai5pWw5YyWXHJcbiAqL1xyXG5jb25zdCBhZnRlckRPTUxvYWRlZCA9ICgpID0+IHtcclxuICAvL+imgee0oOeZuuimi+eUqOOCr+ODqeOCueOCkueUqOaEj1xyXG4gIGNvbnN0IGZpbmRIdG1sRWxlbWVudHMgPSBuZXcgRmluZEh0bWxFbGVtZW50cyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpKTtcclxuXHJcbiAgLy/otbfli5XjgYvjgokgMS41IOenkumWk+W+jOOBq+iHquWLlei1t+WLlVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgLy9ydW5TdHlsaW5nKGZpbmRIdG1sRWxlbWVudHMpO1xyXG4gIH0sIDE1MDApO1xyXG5cclxuICAvL+ODoeODg+OCu+ODvOOCuOODkeODg+OCt+ODs+OCsOOCkuWPl+OBkeWPluOCi1xyXG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcclxuICAgIHN3aXRjaCAocmVxdWVzdC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3J1bic6XHJcbiAgICAgICAgcnVuU3R5bGluZyhmaW5kSHRtbEVsZW1lbnRzKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbi8vRE9NQ29udGVudExvYWRlZCDjgqTjg5njg7Pjg4jjgYzml6LjgavnmbrngavjgZfjgabjgYTjgovloLTlkIjjga/ljbPmmYLjgavliJ3mnJ/ljJbplqLmlbDjgpLlkbzjgbZcclxuaWYoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGFmdGVyRE9NTG9hZGVkKTtcclxufVxyXG5lbHNlIHtcclxuICBhZnRlckRPTUxvYWRlZCgpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=