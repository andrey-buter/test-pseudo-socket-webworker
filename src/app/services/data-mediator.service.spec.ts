import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransportEventName } from '../app.models';
import { DataMediatorService } from './data-mediator.service';
import { TransporterService } from './transporter.service';
import { WebWorkerService } from '../web-worker/web-worker.service';

describe('DataMediatorService', () => {
  let service: DataMediatorService;
  let mockTransporterService: jest.Mocked<TransporterService>;
  let mockWebWorkerService: jest.Mocked<WebWorkerService>;
  let mockWorker: Worker;

  beforeEach(() => {
    mockTransporterService = {
      send: jest.fn(),
      get$: jest.fn().mockReturnValue(of(TransportEventName.SocketConfig)),
    } as unknown as jest.Mocked<TransporterService>;

    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
    } as unknown as Worker;

    mockWebWorkerService = {
      getWorker: jest.fn().mockReturnValue(mockWorker),
    } as unknown as jest.Mocked<WebWorkerService>;

    TestBed.configureTestingModule({
      providers: [
        DataMediatorService,
        { provide: TransporterService, useValue: mockTransporterService },
        { provide: WebWorkerService, useValue: mockWebWorkerService },
      ],
    });

    service = TestBed.inject(DataMediatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send configuration to worker when init is called', () => {
    service.init();
    expect(mockWebWorkerService.getWorker).toHaveBeenCalled();
    expect(mockTransporterService.get$).toHaveBeenCalledWith(TransportEventName.SocketConfig);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      id: 'setConfig',
      value: 'mockConfig',
    });
  });

  fit('should send message to worker when terminate is called', () => {
    service.init();
    service.terminate();
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ id: 'terminate' });
    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should send event data to transporterService when onMessage is called', () => {
    service.init();
    const testEvent: MessageEvent = {
      data: {
        id: 'testId',
        value: 'testValue',
      },
    } as unknown as MessageEvent;

    mockWorker.onmessage?.(testEvent);

    expect(mockTransporterService.send).toHaveBeenCalledWith({
      name: 'ArrayItems',
      value: testEvent.data,
    });
  });

  it('should send processed event data to transporterService when onMessage is called', () => {
    service.init();
    const testEvent: MessageEvent = {
      data: [{
        id: 'testId',
        int: 10,
        float: 0.5,
        color: 'red',
        child: {
          id: 'childId',
          color: 'blue',
        }
      }],
    } as unknown as MessageEvent;

    mockWorker.onmessage?.(testEvent);

    expect(mockTransporterService.send).toHaveBeenCalled();
    const sentData = mockTransporterService.send.mock.calls[0][0];
    expect(sentData.name).toEqual('ArrayItems');
    // The ArrayItem class is not defined here, so you may want to add more checks for the value field
  });
});
