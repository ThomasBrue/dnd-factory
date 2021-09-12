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
import { ButtonsService } from './buttons/buttons.service';

import { InsertionCrossComponent } from './insertion-cross/insertion-cross.component';
import { SelectionBoxComponent } from './selection-box/selection-box.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'dnd-factory';

  public xPosition = 20;
  public yPosition = 20;

  private componentRef: ComponentRef<any>;
  private componentRefArray: ComponentRef<any>[] = [];

  myString = 'defaultString';
  myArray: string[] = ['item1', 'item2', 'item3', 'item4'];

  myArrayFromChild: string[] = [];

  isOverLapping = false;
  dragActive = false;

  startX = 0;
  startY = 0;

  deltaX = 0;
  deltaY = 0;

  windowWidth = 0;
  documentContainerWidth = 804;
  documentContainerLeft = 79;
  documentContainerTop = 130;

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @ViewChild(InsertionCrossComponent)
  insertionCross: InsertionCrossComponent = new InsertionCrossComponent(null);

  @ViewChildren(DynamicComponent)
  dynamicComponentArray: QueryList<DynamicComponent>;
  private counter = 0;
  @ViewChild(SelectionBoxComponent)
  selectionBox: SelectionBoxComponent = new SelectionBoxComponent();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public indexService: IndexService,
    public buttonsService: ButtonsService,
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
    this.windowWidth = window.innerWidth;
    this.setDocumentContainerPosition();
  }
  disableScrolling() {
    let x = window.scrollX;
    let y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  }

  enableScrolling() {
    window.onscroll = function () {};
  }

  addComponent(compInput: string = ''): void {
    if (this.indexService.crossVisible) {
      this.disableScrolling();
      const currentScrollPositionY = document.documentElement.scrollTop;

      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);

      this.componentRefArray.push(
        this.container.createComponent(componentFactory)
      );

      this.indexService.currentSelectedItemUID = this.counter;

      this.componentRefArray[this.componentRefArray.length - 1].instance.uid =
        this.counter++;

      this.indexService.crossVisible = false;

      this.indexService.currentSelectedCurserInItemUID = this.counter - 1;

      setTimeout(() => {
        this.indexService.setCursorInMathfield();
      }, 0);

      setTimeout(() => {
        this.enableScrolling();
      }, 10);
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
        for (let i = 0; i < this.indexService.mainArray.length; i++) {
          if (this.indexService.mainArray[i].isSelected) {
            this.indexService.removeComponent(
              this.indexService.mainArray[i].uid
            );
          }
        }

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
      default:
        this.addComponent();
    }

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

  @HostListener('document:click', ['$event'])
  handleClickEvent(event: MouseEvent) {
    //not in use yet
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickDownEvent(event: MouseEvent) {
    this.isOverLapping = false;
    this.dragActive = true;

    if (this.indexService.mouseDownOnElement) {
      this.indexService.crossVisible = false;
    }

    let adjustedInsertionPointAllowed = true;
    let myX = 0;
    if (
      event.clientX + window.scrollX >= this.documentContainerLeft &&
      event.clientX + window.scrollX <=
        this.documentContainerLeft + this.documentContainerWidth
    ) {
      myX = event.clientX + window.scrollX;
    } else if (
      event.clientX + window.scrollX >
      this.documentContainerLeft + this.documentContainerWidth
    ) {
      myX = this.documentContainerLeft + this.documentContainerWidth;
      adjustedInsertionPointAllowed = false;
    } else {
      myX = this.documentContainerLeft + 11;
      adjustedInsertionPointAllowed = false;
    }

    let myY = 0;
    if (event.clientY + window.scrollY >= this.documentContainerTop) {
      myY = event.clientY + window.scrollY;
    } else {
      myY = this.documentContainerTop + 11;
      adjustedInsertionPointAllowed = false;
    }

    if (adjustedInsertionPointAllowed && !this.indexService.clickedOnElement) {
      this.insertionCross.positionTop = myY - 11;
      this.insertionCross.positionLeft = myX - 11;

      if (!this.indexService.mouseDownOnElement) {
        this.indexService.crossVisible = true;
        this.indexService.setCursorInMathfield(-1);
        console.log('resetttt is selected');
      } else {
        this.indexService.setCursorInMathfield();
      }

      this.indexService.insertionPoint = {
        x: myX - 11,
        y: myY - 11,
      };
    } else if (this.indexService.clickedOnElement) {
      this.indexService.crossVisible = false;
    }

    this.startX = event.clientX + window.scrollX;
    this.startY = event.clientY + window.scrollY;

    this.selectionBox.ankerPointLeft = event.clientX + window.scrollX;
    this.selectionBox.ankerPointTop = event.clientY + window.scrollY;

    this.componentRefArray.forEach((item) => {
      item.instance.deltaX =
        event.clientX -
        item.location.nativeElement.children[0].getBoundingClientRect().left;
      item.instance.deltaY =
        event.clientY -
        item.location.nativeElement.children[0].getBoundingClientRect().top;
    });

    if (!this.indexService.mouseDownOnElement) {
      this.indexService.resetSelectionOfAll();
    }
  }

  @HostListener('document:mousemove', ['$event']) mousemove(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.dragActive) {
      if (this.indexService.mouseDownOnElement) {
        this.selectionBox.isVisible = false;
        this.indexService.crossVisible = false;
      } else {
        this.selectionBox.isVisible = true;
      }

      const diffX = event.pageX - this.startX;
      const diffY = event.pageY - this.startY;

      if (diffX >= 0 && diffY >= 0) {
        this.selectionBox.myWidth = diffX;
        this.selectionBox.myHeight = diffY;
      } else if (diffX >= 0 && diffY < 0) {
        this.selectionBox.myWidth = diffX;
        this.selectionBox.myHeight = Math.abs(diffY);
        this.selectionBox.ankerPointTop = event.clientY + window.scrollY;
      } else if (diffY >= 0 && diffX < 0) {
        this.selectionBox.myHeight = diffY;
        this.selectionBox.myWidth = Math.abs(diffX);
        this.selectionBox.ankerPointLeft = event.clientX + window.scrollX;
      } else if (diffX < 0 && diffY < 0) {
        this.selectionBox.myWidth = Math.abs(diffX);
        this.selectionBox.myHeight = Math.abs(diffY);

        this.selectionBox.ankerPointLeft = event.clientX + window.scrollX;
        this.selectionBox.ankerPointTop = event.clientY + window.scrollY;
      }

      if (!this.selectionBox.isVisible) {
        this.componentRefArray.forEach((item) => {
          if (item.instance.itemIsSelected) {
            this.setDragPosition(item, event);
          } else if (item.instance.mouseDownOnItem) {
            this.setDragPosition(item, event);
          }
        });
      }
    }

    if (
      this.componentRefArray &&
      !this.indexService.mouseDownOnElement &&
      this.dragActive
    ) {
      this.indexService.doItemsCollide(
        this.componentRefArray,
        this.selectionBox
      );
    }
  }

  setDragPosition(item, event) {
    let myX = 0;
    if (
      event.clientX + window.scrollX - item.instance.deltaX >=
        this.documentContainerLeft &&
      event.clientX + window.scrollX - item.instance.deltaX <=
        this.documentContainerLeft +
          this.documentContainerWidth -
          item.location.nativeElement.children[0].getBoundingClientRect().width
    ) {
      myX = event.clientX + window.scrollX - item.instance.deltaX;
    } else if (
      event.clientX + window.scrollX - item.instance.deltaX >
      this.documentContainerLeft +
        this.documentContainerWidth -
        item.location.nativeElement.children[0].getBoundingClientRect().width
    ) {
      myX =
        this.documentContainerLeft +
        this.documentContainerWidth -
        item.location.nativeElement.children[0].getBoundingClientRect().width;
    } else {
      myX = this.documentContainerLeft;
    }

    let myY = 0;
    if (
      event.clientY + window.scrollY - item.instance.deltaY >=
      this.documentContainerTop
    ) {
      myY = event.clientY + window.scrollY - item.instance.deltaY;
    } else {
      myY = this.documentContainerTop;
    }

    item.instance.dragPosition = {
      x: myX,
      y: myY,
    };
  }

  @HostListener('document:mouseup', ['$event'])
  handleClickUpEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.indexService.mouseDownOnElement) {
      this.indexService.mouseDownOnElement = false;
    }

    this.dragActive = false;
    this.selectionBox.isVisible = false;

    for (let i = 0; i < this.componentRefArray.length; i++) {
      this.componentRefArray[i].instance.mouseDownOnItem = false;
    }
  }

  setDocumentContainerPosition() {
    setTimeout(() => {
      this.documentContainerLeft =
        (this.windowWidth - this.documentContainerWidth) / 2;
    }, 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.setDocumentContainerPosition();
  }
}
