import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebWorkerFactoryService {
  // jest tests fix - https://github.com/kulshekhar/ts-jest/issues/1174#issuecomment-1223067199
  getWorker() {
    return new Worker(new URL('./app.worker', import.meta.url), { type: 'module' });
  }
}
