import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebWorkerService {
  getWorker() {
    // return new Worker(new URL('./app.worker', import.meta.url), { type: 'module' });
    return new Worker('')
  }
}
