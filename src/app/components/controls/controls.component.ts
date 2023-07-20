import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { RawAdditionalIds, SocketConfig, TransportEventName } from '../../app.models';
import { DataMediatorService } from '../../services/data-mediator.service';
import { TransporterService } from '../../services/transporter.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent implements OnInit, OnDestroy {
  private defaultConfig: SocketConfig & { ids: RawAdditionalIds } = {
    timer: 1000,
    size: 10,
    ids: '',
  };

  readonly screenUpdateFrequency60HzInMs = 50;

  form = new FormGroup({
    timer: new FormControl<SocketConfig['timer']>(this.defaultConfig.timer, { nonNullable: true }),
    size: new FormControl<SocketConfig['size']>(this.defaultConfig.size, { nonNullable: true }),
    ids: new FormControl<RawAdditionalIds>(this.defaultConfig.ids, { nonNullable: true }),
  });

  private destroy$ = new Subject<void>();

  constructor(
    private readonly dataMediatorService: DataMediatorService,
    private readonly transporterService: TransporterService,
  ) {
    this.form.get('timer')?.addValidators(Validators.min(this.screenUpdateFrequency60HzInMs));
    this.form.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(formValue => {
      this.transporterService.send({
        name: TransportEventName.AdditionalIds,
        value: formValue.ids || '',
      });
      this.sendSocketConfig();
    });
  }

  ngOnInit() {
    this.sendSocketConfig();
  }

  private sendSocketConfig() {
    const data = <SocketConfig>this.form.value;
    this.transporterService.send({
      name: TransportEventName.SocketConfig,
      value: {
        size: data.size,
        timer: data.timer,
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
