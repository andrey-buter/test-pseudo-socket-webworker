import { Injectable } from '@angular/core';

// duplicate service without import.meta for jest tests
@Injectable()
export class WebWorkerFactoryService {
  getWorker() {
    return new Worker('');
  }
}
