import { first } from 'rxjs';
import { TransportEvent, TransportEventName } from '../app.models';
import { TransporterService } from './transporter.service';

describe('TransporterService', () => {
  let service: TransporterService;
  let testEvent: TransportEvent;

  beforeEach(() => {
    service = new TransporterService();

    testEvent = {
      name: TransportEventName.AdditionalIds,
      value: 'test value',
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send and receive the same event', done => {
    service
      .get$(testEvent.name)
      .pipe(first())
      .subscribe(value => {
        expect(value).toEqual(testEvent.value);
        done();
      });

    service.send(testEvent);
  });
});
