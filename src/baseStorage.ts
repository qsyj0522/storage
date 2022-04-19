import type { BaseLocalStorageType } from "./types";
import { isNumber } from "./utils";
import { serializerHandler,StorageSerializers } from './serializer'
import type { Serializer } from './serializer'


interface OptionsType {
  expires?: number;
  prefix?: string;
  storage?: BaseLocalStorageType;

}

type TimeStampType = number | undefined;

interface DataFormatterType {
  value: any;
  timestamp?: TimeStampType;
}

interface SetOptionsType {
  isForever: boolean;
  timestamp?: TimeStampType;
}

export {
  BaseLocalStorageType,
  OptionsType,
  TimeStampType,
  DataFormatterType,
  SetOptionsType,
};

export {
  serializerHandler
}



class BaseStorage {
  localStorage: BaseLocalStorageType;
  prefix: string;
  expires: number;
  
  keyValueMap:Map<string,any>

  /**
   *
   * @param { BaseLocalStorageType } storage
   * @param {OptionsType}  options
   */
  constructor(options: OptionsType = {}) {
    const {
      prefix,
      expires,
      storage = window.localStorage,
    } = options;

    this.localStorage = storage;
    this.prefix = prefix ? String(prefix) : undefined;
    this.expires = isNumber(expires) ? expires : undefined;

    // this.keyValueMap = new Map()

  }

  /**
   *
   * @param {String} key 缓存key
   * @returns { T | null } json 对象
   */
  get<T = any>(key: string, readHandler?:Serializer<T>): T | null {
    const value = this.localStorage.getItem(this._jointKey(key));

    if (!value) return null;

    const data: DataFormatterType = JSON.parse(value);

    const handler =  readHandler || serializerHandler<T>(data.value)
    

    if (this._isExpires(data.timestamp)) {
      this.remove(key);
      return null;
    }

  
    return  handler.read(data.value)  || null;
  }
  /**
   *
   * @param {String} key 缓存key
   * @param {*} value 缓存数据
   */
  set(key: string, value: any, options?: SetOptionsType): void {


    const handler = serializerHandler(value)

    this.localStorage.setItem(
      this._jointKey(key),
      this._dataFormatter(handler.write(value), options)
    );
  }

  /**
   * 获取所有 缓存key
   * @returns
   */
  keys(): number[] | never {
    const localKeys = this.localStorage.length;

    if (localKeys === 0) return [];

    let keysArr = [];

    for (let i = 0; i < localKeys; i++) {
      const keyString = this.localStorage.key(i);

      keysArr.push(keyString);
    }

    if (this.prefix) {
      keysArr = keysArr
        .filter((k) => k.indexOf(this.prefix) === 0)
        .map((k) => k.substring(this.prefix.length, k.length));
    }

    return keysArr;
  }

  /**
   * 移除key
   * @param {*} key
   */
  remove(key: string): void {
    this.localStorage.removeItem(this._jointKey(key));
  }

  batchRemove() {}

  /**
   * 清除廍
   */
  removeAll(): void {
    this.localStorage.clear();
  }

  _jointKey(key: string): string {
    if (this.prefix) return this.prefix + key;

    return key;
  }

  /**
   * 默认存贮格式
   * @param {*}  data
   * @returns
   */
  _dataFormatter(data: any, options: SetOptionsType): string {
    const value: DataFormatterType = {
      value: data,
      timestamp: undefined,
    };

    const isForever = options?.isForever || !this.expires;

    if (!isForever) {
      if (options?.timestamp) {
        value.timestamp = options.timestamp;
      } else {
        value.timestamp = new Date().getTime() + this.expires;
      }
    }

    return JSON.stringify(value);
  }

  /**
   * token是否过期
   * @param {Number} timeStamp
   * @returns
   */
  _isExpires(timeStamp: TimeStampType): boolean {
    // 无时间戳 永久保存
    if (!timeStamp) return false;

    if (new Date().getTime() > timeStamp) return true;

    return false;
  }
}







export default BaseStorage;
