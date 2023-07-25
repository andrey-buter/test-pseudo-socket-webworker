import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { DataMediatorService } from './services/data-mediator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private dataMediatorService: DataMediatorService) {}

  ngOnInit() {
    this.dataMediatorService.init();
  }

  ngOnDestroy() {
    this.dataMediatorService.terminate();
  }
}
