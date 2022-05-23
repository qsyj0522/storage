


# Storage 库



#### 安装

```
npm i @qsyjlib/storage
pnpm add @qsyjlib/storage
```





#### 使用

```typescript
// 默认暴露
import storage from '@qsyjlib/storage'
//或
import { BaseStorage } from '@qsyjlib/storage'

```



####  创建 storage 对象

```typescript
import { BaseStorage } from '@qsyjlib/storage'

const storage = new BaseStorage({
  storage: window.localStorage,
  expires: 86400,
  prefix: 'qsyj_',
  isSerializer: true,
  serializers: {
    object: {
      read: v => v,
      write: v => v
    }
  }
})

// types
interface OptionsType {
  expires?: number;   // 过期时间 ，无过期时间 永久缓存
  prefix?: string;  // 前缀
  storage?: BaseLocalStorageType;  // 指定 缓存实例
  serializers?: SerializerRecorad, // 序列化处理
  isSerializers?: boolean // 是否序列化处理
}


```



`isSerializers` 如果不开启序列化处理 ，则 直接采用原值 ,特殊类型等直接存入会丢失，如果开启  `value` 值则会 序列化处理  ,



#### set  写入缓存

`set ` 会自动推断类型 使用哪种序列化处理  如果开启了

```typescript
set(key: string, value: any, options?: SetOptionsType): void


type TimeStampType = number | undefined;
interface SetOptionsType {
   // 是否永久
  isForever: boolean;
  // 时间戳 默认不指定，填入按照指定时间
  timestamp?: TimeStampType;
}

```



#### get  获取指定缓存



包中默认暴露出所有默认的 读取写入 ，不指定  readHandler 如果开启序列化 ，在读取时无法判别 序列处理  默认作为字符串处理  

```typescript

get<T = any>(key: string, readHandler?: Serializer<T>): T | null;

interface Serializer<T> {
  // 读取
  read?(raw: string): T;
  // 写入
  write(value: T): string;
}

```



#### remove 移除指定缓存

``` typescript
remove(key: string): void;
```



#### removeAll 移除全部缓存

清除结果为 keys 取值

```
removeAll(): void;
```

#### batchRemove 批量移除
``` typescript
batchRemove(keys:string[])
```


#### keys

匹配所有前缀  key，没设置前缀 获取全部，同 原 storage

```
keys(): number[] | never[];
```









