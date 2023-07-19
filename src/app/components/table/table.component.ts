import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, startWith } from 'rxjs';
import { TransportEventName } from '../../app.models';
import { DataMediatorService } from '../../services/data-mediator.service';
import { TransporterService } from '../../services/transporter.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  items$ = this.getItems$();
  additionalIds$ = this.getAdditionalIds$();

  constructor(
    private readonly dataMediatorService: DataMediatorService,
    private readonly transporterService: TransporterService,
  ) {}

  private getItems$() {
    return this.transporterService.get$(TransportEventName.ArrayItems);
  }

  private getAdditionalIds$() {
    return this.transporterService.get$(TransportEventName.AdditionalIds).pipe(
      map(ids => this.stringToArray(ids)),
      startWith([]),
    );
  }

  private stringToArray(string: string) {
    return string.split(',').map(item => item.trim());
  }
}
