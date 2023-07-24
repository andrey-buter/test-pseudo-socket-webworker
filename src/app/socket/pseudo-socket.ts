import { interval, map, ReplaySubject, Subscription, switchMap, withLatestFrom } from 'rxjs';
import { SocketConfig } from '../app.models';
import { TestDataGenerator } from '../utils/item-generator';

export class PseudoSocket {
  private socketConfig$ = new ReplaySubject<SocketConfig>(1)

  private subscription?: Subscription;

  private data$ = this.socketConfig$.pipe(
    switchMap(({timer}) => interval(timer)),
    withLatestFrom(this.socketConfig$),
    map(([_, config]) => this.generateData(config.size))
  )

  setConfig(config: SocketConfig) {
    this.socketConfig$.next(config);
  }

  connect() {
    if (this.subscription && !this.subscription.closed) {
      throw new Error("Already connected");
    }

    this.subscription = this.data$.subscribe();
  }

  disconnect() {
    this.subscription?.unsubscribe();
  }

  private generateData(size: number) {
    return TestDataGenerator.generateArray(size);
  }

  getData$() {
    return this.data$;
  }
}
