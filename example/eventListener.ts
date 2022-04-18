import type { BaseLocalStorageType } from "./types";


const initStorageEvent = (storage: BaseLocalStorageType) => {
  const originStorage = storage;


  
  Storage.prototype.setItem = function (key, value) {
    originStorage.setItem(key, value);

    console.log(key,value);
    

    const setItemEvent = new CustomEvent("setItemEvent", {
      detail: {
        value,
        oldValue: null,
      },
    });

    // 派发事件对象
    window.dispatchEvent(setItemEvent);

    return value;
  };
};

export {
    initStorageEvent
};

