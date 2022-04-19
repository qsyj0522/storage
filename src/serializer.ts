import { toRawType } from "./utils";

export interface Serializer<T> {
  read?(raw: string): T;
  write(value: T): string;
}

export type SerializerRecoradKey =
  | "boolean"
  | "object"
  | "number"
  | "any"
  | "string"
  | "map"
  | "set"
  | "date";

export type SerializerRecorad = Record<SerializerRecoradKey, Serializer<any>> | {};

export const StorageSerializers: SerializerRecorad = {
  boolean: {
    read: (v: any) => v === "true",
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) =>
      JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
};


export function serializerHandler<T>(value, serializers?:SerializerRecorad): Serializer<T> {


  const type = toRawType(value);


  const handler =  (serializers && serializers[type]) || StorageSerializers[type] || StorageSerializers["any"];

  return handler;
}
