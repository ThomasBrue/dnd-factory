import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  HostListener,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ComponentRef,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { DynamicComponent } from './dynamic/dynamic.component';

import { IndexService } from './dynamic/index.service';
import { InsertionCrossComponent } from './insertion-cross/insertion-cross.component';
import { SelectionBoxComponent } from './selection-box/selection-box.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'dnd-factory';

  @ViewChild('myIdSelectBox') mySelectionBox: ElementRef;

  public xPosition = 20;
  public yPosition = 20;

  private componentRef: ComponentRef<any>;
  private componentRefArray: ComponentRef<any>[] = [];

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  @ViewChild('insertionCross', { read: ViewContainerRef })
  insertionCross: ViewContainerRef;
  @ViewChildren('app-dynamic') public dynamicComponentArray: QueryList<any>;
  private counter = 0;

  myString = 'defaultString';
  myArray: string[] = ['item1', 'item2', 'item3', 'item4'];

  myArrayFromChild: string[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public indexService: IndexService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.indexService.toDeleteComponent.subscribe((uid) => {
      if (this.componentRefArray && this.componentRefArray.length) {
        for (let i = 0; i < this.componentRefArray.length; i++) {
          if (this.componentRefArray[i].instance.uid === uid) {
            this.componentRefArray[i].destroy();
            this.componentRefArray.splice(i, 1);
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        InsertionCrossComponent
      );
    setTimeout(() => {
      this.container.createComponent(componentFactory);
    }, 0);
  }

  addComponent(compInput: string = ''): void {
    if (this.indexService.crossVisible) {
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);

      this.componentRefArray.push(
        this.container.createComponent(componentFactory)
      );

      this.indexService.currentSelectedItemUID = this.counter;

      this.componentRefArray[this.componentRefArray.length - 1].instance.uid =
        this.counter++;

      this.indexService.crossVisible = false;
    }
  }

  removeComponent() {
    if (this.componentRefArray && this.componentRefArray.length) {
      this.componentRefArray[this.componentRefArray.length - 1].destroy();
      //   this.componentRef.destroy();
      this.componentRefArray.pop();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Backspace':
        this.indexService.mainArray[
          this.indexService.currentSelectedItemUID
        ].individualTrigger.next();

        for (let i = 0; i < this.indexService.mainArray.length; i++) {
          if (
            this.indexService.mainArray[i].uid ===
            this.indexService.currentSelectedItemUID
          ) {
            if (!this.indexService.mainArray[i].latexOutput) {
              this.indexService.removeComponent(
                this.indexService.mainArray[i].uid
              );
            }
          }
        }
        break;
    }

    this.addComponent();

    if (this.indexService.mainArray[this.indexService.currentSelectedItemUID]) {
      this.indexService.mainArray[
        this.indexService.currentSelectedItemUID
      ].individualTrigger.next();
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    if (this.indexService.mainArray[this.indexService.currentSelectedItemUID]) {
      this.indexService.mainArray[
        this.indexService.currentSelectedItemUID
      ].individualTrigger.next();
    }
  }

  // @HostListener('document:mousedown', ['$event'])
  @HostListener('document:click', ['$event'])
  handleClickEvent(event: KeyboardEvent) {
    console.log('CLICK: ', event);

    if (!this.indexService.crossVisible) {
      this.indexService.crossVisible = true;
    }

    if (this.indexService.clickedOnElement) {
      this.indexService.crossVisible = false;
      this.indexService.clickedOnElement = false;
    }

    /* console.log(
      'nativeElement ',
      this.componentRefArray[0].location.nativeElement.children[0].getBoundingClientRect()
    ); */
  }
}
