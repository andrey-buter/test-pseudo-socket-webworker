import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import { TransportEvent } from '../app.models';

@Injectable({
  providedIn: 'root',
})
export class TransporterService {
  private readonly data$ = new Subject<TransportEvent>();

  send(event: TransportEvent) {
    this.data$.next(event);
  }

  get$<T extends TransportEvent['name'], Event extends Extract<TransportEvent, { name: T }>>(
    name: T,
  ): Observable<Event['value']> {
    return this.data$.pipe(
      filter((data): data is Event => data.name === name),
      map(({ value }) => value),
    );
  }
}
