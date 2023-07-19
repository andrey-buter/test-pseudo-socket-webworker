import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TransportEventName, WebWorkerMessage, WebWorkerMessageId } from '../app.models';
import { ArrayItem, RawArrayItem } from '../array-item.class';
import { WebWorkerService } from '../web-worker/web-worker.service';
import { TransporterService } from './transporter.service';

@Injectable({
  providedIn: 'root',
})
export class DataMediatorService {
  private worker?: Worker;
  private readonly destroy$ = new Subject();
  private readonly itemsToDisplay = 10;

  constructor(private transporterService: TransporterService, private webWorkerService: WebWorkerService) {}

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
      value: (<RawArrayItem[]>event.data).slice(this.itemsToDisplay * -1).map(item => new ArrayItem(item)),
    });
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
