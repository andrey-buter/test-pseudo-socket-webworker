import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArrayItemsEvent, TransportEventName, WebWorkerMessageId } from '../app.models';
import { ArrayItem, RawArrayItem } from '../array-item.class';
import { WebWorkerFactoryService } from '../web-worker/web-worker-factory.service';
import { DataMediatorService } from './data-mediator.service';
import { TransporterService } from './transporter.service';

function clone<T extends Object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe('DataMediatorService', () => {
  let service: DataMediatorService;
  let mockTransporterService: jest.Mocked<TransporterService>;
  let mockWebWorkerFactoryService: jest.Mocked<WebWorkerFactoryService>;
  let mockWorker: Worker;

  const testItem: RawArrayItem = {
    id: 'testId',
    int: 10,
    float: 0.5,
    color: 'red',
    child: {
      id: 'childId',
      color: 'blue',
    },
  };

  beforeEach(() => {
    global.Worker = jest.fn().mockImplementation(() => {
      return {
        onmessage: null,
        postMessage: jest.fn(),
      };
    });

    mockTransporterService = {
      send: jest.fn(),
      get$: jest.fn().mockReturnValue(of('mockConfig')),
    } as unknown as jest.Mocked<TransporterService>;

    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
    } as unknown as Worker;

    mockWebWorkerFactoryService = {
      getWorker: jest.fn().mockReturnValue(mockWorker),
    } as unknown as jest.Mocked<WebWorkerFactoryService>;

    TestBed.configureTestingModule({
      providers: [
        DataMediatorService,
        { provide: TransporterService, useValue: mockTransporterService },
        { provide: WebWorkerFactoryService, useValue: mockWebWorkerFactoryService },
      ],
    });

    service = TestBed.inject(DataMediatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle unsupported environments', () => {
    // @ts-ignore
    global.Worker = undefined;

    expect(() => service.init()).toThrowError('Web Workers are not supported in this environment.');
  });

  it('should init worker on supported environment', () => {
    service.init();
    expect(mockWebWorkerFactoryService.getWorker).toHaveBeenCalled();
  });

  it('should init worker on supported environment', () => {
    service.init();
    expect(mockWebWorkerFactoryService.getWorker).toHaveBeenCalled();
  });

  it('should send configuration to worker when init is called', () => {
    service.init();
    expect(mockTransporterService.get$).toHaveBeenCalledWith(TransportEventName.SocketConfig);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      id: WebWorkerMessageId.setConfig,
      value: 'mockConfig',
    });
  });

  it('should send event TransportEventName.ArrayItems to transporterService when onMessage is called', () => {
    service.init();
    const testEvent = {
      data: [],
    } as unknown as MessageEvent;

    mockWorker.onmessage?.(testEvent);

    expect(mockTransporterService.send).toHaveBeenCalledWith({
      name: TransportEventName.ArrayItems,
      value: testEvent.data,
    });
  });

  it('should send processed event TransportEventName.ArrayItems to transporterService when onMessage is called', () => {
    service.init();
    const testEvent = {
      data: [],
    } as unknown as MessageEvent;

    mockWorker.onmessage?.(testEvent);

    const sentData = mockTransporterService.send.mock.calls[0][0] as ArrayItemsEvent;
    expect(sentData.name).toEqual(TransportEventName.ArrayItems);
  });

  it('should send processed event data of 10 last array items to transporterService when onMessage is called', () => {
    service.init();
    const lastId = 'lastId';
    const clonedArrayItem = clone(testItem);
    const testEvent = {
      data: [
        { ...clonedArrayItem, id: '1' },
        { ...clonedArrayItem, id: '2' },
        { ...clonedArrayItem, id: '3' },
        { ...clonedArrayItem, id: '4' },
        { ...clonedArrayItem, id: '5' },
        { ...clonedArrayItem, id: '6' },
        { ...clonedArrayItem, id: '7' },
        { ...clonedArrayItem, id: '8' },
        { ...clonedArrayItem, id: '9' },
        { ...clonedArrayItem, id: '10' },
        { ...clonedArrayItem, id: lastId },
      ],
    } as unknown as MessageEvent;

    mockWorker.onmessage?.(testEvent);

    const sentData = mockTransporterService.send.mock.calls[0][0] as ArrayItemsEvent;
    expect(sentData.name).toEqual(TransportEventName.ArrayItems);
    expect(sentData.value.length).toEqual(10);
    expect(sentData.value[sentData.value.length - 1].id).toEqual(lastId);
  });

  it('should send processed event data of ArrayItem[] to transporterService when onMessage is called', () => {
    service.init();
    const testEvent = {
      data: [{ ...clone(testItem) }],
    } as unknown as MessageEvent;

    mockWorker.onmessage?.(testEvent);

    const sentData = mockTransporterService.send.mock.calls[0][0] as ArrayItemsEvent;
    expect(sentData.value[0] instanceof ArrayItem).toBe(true);
  });

  it('should send message to worker when terminate is called', () => {
    service.init();
    service.terminate();
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ id: 'terminate' });
    expect(mockWorker.terminate).toHaveBeenCalled();
  });
});
