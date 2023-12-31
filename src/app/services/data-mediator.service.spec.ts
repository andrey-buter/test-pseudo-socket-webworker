import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArrayItemsEvent, TransportEventName, WebWorkerMessageId } from '../app.models';
import { ArrayItem, RawArrayItem } from '../utils/array-item.class';
import { TestDataGenerator } from '../utils/item-generator';
import { WebWorkerFactoryService } from '../web-worker/web-worker-factory.service';
import { DataMediatorService } from './data-mediator.service';
import { TransporterService } from './transporter.service';

describe('DataMediatorService', () => {
  let service: DataMediatorService;
  let mockTransporterService: jest.Mocked<TransporterService>;
  let mockWebWorkerFactoryService: jest.Mocked<WebWorkerFactoryService>;
  let mockWorker: Worker;

  const testItem: RawArrayItem = Object.freeze({
    id: 'testId',
    int: 10,
    float: TestDataGenerator.getRandomFloat(),
    color: 'red',
    child: Object.freeze({
      id: 'childId',
      color: 'blue',
    }),
  });

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

  it('should send processed event data of [DataMediatorService.itemsToDisplay] last array items to transporterService when onMessage is called', () => {
    service.init();
    const lastId = 'lastId';
    const testEventData = new Array(DataMediatorService.itemsToDisplay).fill({...testItem});
    testEventData.push({ ...testItem, id: lastId });
    const testEvent = {
      data: testEventData,
    } as unknown as MessageEvent;

    mockWorker.onmessage?.(testEvent);

    const sentData = mockTransporterService.send.mock.calls[0][0] as ArrayItemsEvent;
    expect(sentData.name).toEqual(TransportEventName.ArrayItems);
    expect(sentData.value.length).toEqual(DataMediatorService.itemsToDisplay);
    expect(sentData.value[sentData.value.length - 1].id).toEqual(lastId);
  });

  it('should send processed event data of ArrayItem[] to transporterService when onMessage is called', () => {
    service.init();
    const testEvent = {
      data: [{ ...testItem }],
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
