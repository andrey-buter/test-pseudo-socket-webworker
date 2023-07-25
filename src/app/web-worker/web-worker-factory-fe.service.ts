import { Injectable } from '@angular/core';

@Injectable()
export class WebWorkerFactoryFeService {
  getWorker() {
    return new Worker(new URL('./app.worker', import.meta.url), { type: 'module' });
  }
}
