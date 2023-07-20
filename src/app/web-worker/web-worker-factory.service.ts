import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebWorkerFactoryService {
  getWorker() {
    return new Worker(new URL('./app.worker', import.meta.url), { type: 'module' });
  }
}
