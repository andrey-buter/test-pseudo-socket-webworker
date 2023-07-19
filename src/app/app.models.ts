import { ArrayItem } from './array-item.class';

export interface SocketConfig {
  size: number;
  timer: number;
  // ids: string;
}

export type WebWorkerMessage = WebWorkerConfigMessage | WebWorkerTerminateMessage;

export enum WebWorkerMessageId {
  setConfig = 'setConfig',
  terminate = 'terminate',
}

export interface WebWorkerConfigMessage {
  id: WebWorkerMessageId.setConfig;
  value: SocketConfig;
}

export interface WebWorkerTerminateMessage {
  id: WebWorkerMessageId.terminate;
}

export enum TransportEventName {
  AdditionalIds,
  ArrayItems,
  SocketConfig,
}

export type RawAdditionalIds = string;

export interface AdditionalIdsEvent {
  name: TransportEventName.AdditionalIds;
  value: RawAdditionalIds;
}

export interface ArrayItemsEvent {
  name: TransportEventName.ArrayItems;
  value: ArrayItem[];
}

export interface SocketConfigEvent {
  name: TransportEventName.SocketConfig;
  value: SocketConfig;
}

export type TransportEvent = AdditionalIdsEvent | ArrayItemsEvent | SocketConfigEvent;
