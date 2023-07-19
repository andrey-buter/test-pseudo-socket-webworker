import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ControlsComponent } from './components/controls/controls.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [AppComponent, ControlsComponent, TableComponent],
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule, MatInputModule, MatTableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
