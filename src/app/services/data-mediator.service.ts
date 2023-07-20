import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TransportEventName, WebWorkerMessage, WebWorkerMessageId } from '../app.models';
import { ArrayItem, RawArrayItem } from '../array-item.class';
import { WebWorkerFactoryService } from '../web-worker/web-worker-factory.service';
import { TransporterService } from './transporter.service';

@Injectable({
  providedIn: 'root',
})
export class DataMediatorService {
  private worker?: Worker;
  private readonly destroy$ = new Subject();
  private readonly itemsToDisplay = 10;

  constructor(
    private transporterService: TransporterService,
    private webWorkerService: WebWorkerFactoryService,
  ) {}

  init() {
    if (typeof Worker !== 'undefined') {
      this.worker = this.webWorkerService.getWorker();

      this.worker.onmessage = this.onMessage.bind(this);
      this.postSocketConfig();
    } else {
      throw new Error('Web Workers are not supported in this environment.');
    }
  }

  private postSocketConfig() {
    this.transporterService
      .get$(TransportEventName.SocketConfig)
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.worker?.postMessage({
          id: WebWorkerMessageId.setConfig,
          value: config,
        });
      });
  }

  private onMessage(event: MessageEvent) {
    this.transporterService.send({
      name: TransportEventName.ArrayItems,
      value: this.handleRawItems(<RawArrayItem[]>event.data, this.itemsToDisplay),
    });
  }

  private handleRawItems(array: RawArrayItem[], count: number) {
    return array.slice(count * -1).map(item => new ArrayItem(item));
  }

  private postMessage(message: WebWorkerMessage) {
    this.worker?.postMessage(message);
  }

  terminate() {
    this.postMessage({
      id: WebWorkerMessageId.terminate,
    });
    this.worker?.terminate();
  }
}
