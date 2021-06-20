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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'dnd-factory';

  dragPosition = { x: 20, y: 20 };

  public xPosition = 20;
  public yPosition = 20;

  changePosition() {
    this.dragPosition = {
      x: this.dragPosition.x + 50,
      y: this.dragPosition.y + 50,
    };
  }

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

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {}

  ngDoCheck() {}

  addComponent(compInput: string = ''): void {
    // create the component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      DynamicComponent
    );

    // add the component to the view
    //  this.componentRef = this.container.createComponent(componentFactory);

    this.componentRefArray.push(
      this.container.createComponent(componentFactory)
    );

    /*     componentRef.instance.closed.subscribe(() => {
      document.body.removeChild(componentFactory);
      this.applicationRef.detachView(componentRef.hostView);
    }); */

    // pass some data to the component

    this.componentRefArray[this.counter].instance.uid = this.counter++;

    /* this.componentRef.instance.uid = this.counter++;
    this.componentRef.instance['compInput'] = compInput; */

    /*     this.componentRef.instance.newStringEvent.subscribe((val: string) => {
      console.log('myString: ', val);
      this.myString = val;

      console.log('myArray: ', this.myArray);
      this.myArray.push(val);
      this.myArray = [...this.myArray];
    }); */

    console.log('ComponentFactory: ', componentFactory);
    console.log('componentRef: ', this.componentRef);
  }

  removeComponent() {
    console.log('componentRefArray: ', this.componentRefArray);

    if (this.componentRefArray) {
      this.componentRefArray[this.componentRefArray.length - 1].destroy();
      //   this.componentRef.destroy();
      this.componentRefArray.pop();
    }
  }

  //-------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    switch (event.key) {
      case '/': // Division
        console.log('Division');
        /*         this.MQ.MathField(this.mathField).write('\\frac{}{}');
        this.MQ.MathField(this.mathField).keystroke('Up'); */
        break;
    }
  }

  /* myFunction(keyBoardInput: any) {
  this.MQ.MathField(this.mathField).write(keyBoardInput);
  this.MQ.MathField(this.mathField).focus();
}

@HostListener('document:keyup', ['$event'])
handleKeyupEvent(event: KeyboardEvent) {
  console.log('Keyup: ', event.key);

  if (event.key == 'Shift' || event.key == 'Alt' || event.key == 'Control') {
    this.specialKey_1 = '';
    this.specialKey_2 = '';
  }

  */
}
