import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  HostListener,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { DynamicComponent } from './dynamic/dynamic.component';

import { IndexService } from './dynamic/index.service';

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

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private counter = 0;

  myString = 'defaultString';
  myArray: string[] = ['item1', 'item2', 'item3', 'item4'];

  myArrayFromChild: string[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public indexService: IndexService
  ) {}

  addComponent(compInput: string = ''): void {
    // create the component factory
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);

    // add the component to the view
    const componentRef = this.container.createComponent(componentFactory);

    /*     componentRef.instance.closed.subscribe(() => {
      document.body.removeChild(componentFactory);
      this.applicationRef.detachView(componentRef.hostView);
    }); */

    // pass some data to the component
    componentRef.instance.uid = this.counter++;
    componentRef.instance['compInput'] = compInput;

    componentRef.instance.newStringEvent.subscribe((val: string) => {
      console.log('myString: ', val);
      this.myString = val;

      console.log('myArray: ', this.myArray);
      this.myArray.push(val);
      this.myArray = [...this.myArray];
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    this.indexService.keyInput(event.key);
  }
}
