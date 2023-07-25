import { ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { SocketConfig } from '../app.models';
import { TestDataGenerator } from '../utils/item-generator';
import { PseudoSocket } from './pseudo-socket';

describe('PseudoSocket', () => {
  let pseudoSocket: PseudoSocket;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    pseudoSocket = new PseudoSocket();
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should set the socket configuration', () => {
    const config = { timer: 1000, size: 10 };
    const configSubject = new ReplaySubject<SocketConfig>(1);

    pseudoSocket = new PseudoSocket();
    (pseudoSocket as any).socketConfig$ = configSubject;

    testScheduler.run(({ expectObservable }) => {
      const expectedConfig = config;

      pseudoSocket.setConfig(config);

      expectObservable(configSubject).toBe('x', { x: expectedConfig });
    });
  });

  it('should connect to the data stream', () => {
    const config = { timer: 1000, size: 10 };

    pseudoSocket.setConfig(config);
    pseudoSocket.connect();

    expect((pseudoSocket as any).subscription).toBeDefined();
    expect((pseudoSocket as any).subscription.closed).toBe(false);
  });

  it('should throw an error when trying to connect while already connected', () => {
    const config = { timer: 1000, size: 10 };

    pseudoSocket.setConfig(config);
    pseudoSocket.connect();

    expect(() => pseudoSocket.connect()).toThrowError('Already connected');
  });

  it('should disconnect from the data stream', () => {
    const config = { timer: 1000, size: 10 };

    pseudoSocket.setConfig(config);
    pseudoSocket.connect();
    pseudoSocket.disconnect();

    expect((pseudoSocket as any).subscription.closed).toBe(true);
  });

  it('should return the data stream', (done) => {
    const config: SocketConfig = { timer: 1000, size: 10 };
    const testData = TestDataGenerator.generateArray(10);

    jest
      .spyOn(TestDataGenerator, 'generateArray')
      .mockReturnValue(testData);

    pseudoSocket.setConfig(config);
    const data$ = pseudoSocket.getData$();

    expect(data$).toBeDefined();
    data$.subscribe(val => {
      expect(val).toEqual(testData);
      done();
    });
  });
});
