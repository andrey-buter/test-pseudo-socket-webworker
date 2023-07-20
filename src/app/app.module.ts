import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ControlsComponent } from './components/controls/controls.component';
import { TableComponent } from './components/table/table.component';
import { AppErrorStateMatcher } from './agular-material/touched-error-state.matcher';

@NgModule({
  declarations: [AppComponent, ControlsComponent, TableComponent],
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule, MatInputModule, MatTableModule],
  providers: [{ provide: ErrorStateMatcher, useClass: AppErrorStateMatcher }],
  bootstrap: [AppComponent],
})
export class AppModule {}
