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
} from '@angular/core';
import { DynamicComponent } from './dynamic/dynamic.component';

import { IndexService } from './dynamic/index.service';
import { InsertionCrossComponent } from './insertion-cross/insertion-cross.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'dnd-factory';

  // dragPosition = { x: 20, y: 20 };

  public xPosition = 20;
  public yPosition = 20;

  /*   changePosition() {
    this.dragPosition = {
      x: this.dragPosition.x + 50,
      y: this.dragPosition.y + 50,
    };
  } */

  private componentRef: ComponentRef<any>;
  private componentRefArray: ComponentRef<any>[] = [];

  /*   onDragEnded(event) {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);

    this.xPosition = boundingClientRect.x - parentPosition.left;
    this.yPosition = boundingClientRect.y - parentPosition.top;

    console.log(
      'x: ' + (boundingClientRect.x - parentPosition.left),
      'y: ' + (boundingClientRect.y - parentPosition.top)
    );
  }

  getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  } */

  //-------------------------------------------------------------------------

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @ViewChild('insertionCross', { read: ViewContainerRef })
  insertionCross: ViewContainerRef;

  /*     @ViewChildren('comp', { read: ViewContainerRef })
  public dynComponents: QueryList<ViewContainerRef>;
 */
  @ViewChildren('app-dynamic') public dynamicComponentArray: QueryList<any>;

  @ViewChildren('viewRef', { read: ViewContainerRef })
  public viewRefs: QueryList<any>;

  private counter = 0;

  myString = 'defaultString';
  myArray: string[] = ['item1', 'item2', 'item3', 'item4'];

  myArrayFromChild: string[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public indexService: IndexService
  ) {}

  ngOnInit() {
    //  var d = document.getElementById('yourDivId');

    /*     this.insertionCross.style.position = "absolute";
    this.insertionCross.style.left = x_pos+'px';
    this.insertionCross.style.top = y_pos+'px';
    this.insertionCross.nativeElement.setAttribute('highlight', '');

    let el = this.element.nativeElement;
    el.setAttribute('style', 'color: white; background: red'); */

    // this.insertionCross.

    /*     this.insertionCross.style.position = "absolute";
    this.insertionCross.style.left = x_pos+'px';
    this.insertionCross.style.top = y_pos+'px'; */

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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      InsertionCrossComponent
    );
    setTimeout(() => {
      this.container.createComponent(componentFactory);
    }, 0);
  }

  ngDoCheck() {}
  @HostListener('document:click', ['$event'])
  clickout(event) {
    console.log('TARGET: ', event);

    /* if(this.eRef.nativeElement.contains(event.target)) {
      this.text = "clicked inside";
    } else {
      this.text = "clicked outside";
    } */
  }

  addComponent(compInput: string = ''): void {
    if (this.indexService.crossVisible) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        DynamicComponent
      );

      this.componentRefArray.push(
        this.container.createComponent(componentFactory)
      );

      this.indexService.currentSelectedItemUID = this.counter;

      this.componentRefArray[
        this.componentRefArray.length - 1
      ].instance.uid = this.counter++;

      this.indexService.crossVisible = false;

      console.log('ComponentFactory: ', componentFactory);
      console.log('componentRef: ', this.componentRef);
    }
  }

  removeComponent() {
    console.log('componentRefArray: ', this.componentRefArray);

    if (this.componentRefArray && this.componentRefArray.length) {
      console.log('111_removeComponent: ', this.componentRefArray);

      this.componentRefArray[this.componentRefArray.length - 1].destroy();
      //   this.componentRef.destroy();
      this.componentRefArray.pop();
    }
    console.log('222_removeComponent: ', this.componentRefArray);
  }

  //-------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    console.log('ac_key: ', event.key);

    switch (event.key) {
      case '/': // Division
        console.log('Division');
        /*         this.MQ.MathField(this.mathField).write('\\frac{}{}');
        this.MQ.MathField(this.mathField).keystroke('Up'); */
        break;
      case 'Backspace':
        console.log('__backspace');

        this.indexService.mainArray[
          this.indexService.currentSelectedItemUID
        ].individualTrigger.next();

        for (let i = 0; i < this.indexService.mainArray.length; i++) {
          if (
            this.indexService.mainArray[i].uid ===
            this.indexService.currentSelectedItemUID
          ) {
            console.log(
              'ac_currentSelectedItemUID: ',
              this.indexService.currentSelectedItemUID
            );

            console.log(
              'ac_latexOutput: ',
              this.indexService.mainArray[i].latexOutput
            );

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
  }
}
