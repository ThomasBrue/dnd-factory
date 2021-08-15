import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicComponent } from './dynamic/dynamic.component';
import { InsertionCrossComponent } from './insertion-cross/insertion-cross.component';
import { SelectionBoxComponent } from './selection-box/selection-box.component';

@NgModule({
  declarations: [AppComponent, DynamicComponent, InsertionCrossComponent, SelectionBoxComponent],
  imports: [BrowserModule, BrowserAnimationsModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
