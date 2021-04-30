import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicComponent } from './dynamic/dynamic.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
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

  private counter = 1;

  myString = 'defaultString';
  myArray: string[] = ['item1', 'item2', 'item3', 'item4'];

  myArrayFromChild: string[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  add(compInput: string = ''): void {
    // create the component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      DynamicComponent
    );

    // add the component to the view
    const componentRef = this.container.createComponent(componentFactory);

    // pass some data to the component
    componentRef.instance.index = this.counter++;
    componentRef.instance['compInput'] = compInput;

    componentRef.instance.newStringEvent.subscribe((val: string) => {
      console.log('myString: ', val);
      this.myString = val;

      console.log('myArray: ', this.myArray);
      this.myArray.push(val);
      this.myArray = [...this.myArray];
    });
  }
}
