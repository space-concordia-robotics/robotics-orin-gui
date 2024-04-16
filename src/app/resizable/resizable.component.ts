import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {DecimalPipe, NgComponentOutlet} from "@angular/common";
import {VideoClientComponent} from "../video-client/video-client.component";
const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  selector: 'app-resizable',
  standalone: true,
  imports: [
    DecimalPipe,
    VideoClientComponent,
    NgComponentOutlet
  ],
  templateUrl: './resizable.component.html',
  styleUrl: './resizable.component.css'
})
export class ResizableComponent{

  @Input('width') public width: number = 300;
  @Input('height') public height: number = 150;
  @Input('left') public left: number = 100;
  @Input('top') public top: number = 100;

  @ViewChild("box") public box: ElementRef | undefined;
  private boxPosition: { left: number; top: number; } | undefined;
  private containerPos: { left: number; top: number; right: number; bottom: number; } | undefined;
  public mouse: { x: number; y: number; } | undefined
  public status: Status = Status.OFF;
  private mouseClick: { x: number; y: number; left: number; top: number; } | undefined

  @Input('component') public component : any|undefined;
  ngAfterViewInit(){
    this.loadBox();
    this.loadContainer();
  }
  private loadBox(){
    const {left, top} = this.box!!.nativeElement.getBoundingClientRect();
    this.boxPosition = {left, top};
    // console.log(this.boxPosition)
  }
   private loadContainer(){
    const left = this.boxPosition!!.left - this.left;
    const top = this.boxPosition!!.top - this.top;
    const right = left + 1980;
    const bottom = top + 1080;
    this.containerPos = { left, top, right, bottom };
    // console.log(this.containerPos)
  }

  setStatus(event: MouseEvent, status: number){
    if(!event.ctrlKey) return
    if(status === 1) event.stopPropagation();
    else if(status === 2) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.left, top: this.top };
    else this.loadBox();
    this.status = status;
  }
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent){
    this.mouse = { x: event.clientX, y: event.clientY };

    if(this.status === Status.RESIZE) this.resize();
    else if(this.status === Status.MOVE) this.move();
  }
  private resize(){
    if(this.resizeCondMeet()){
      this.width = Number(this.mouse!!.x > this.boxPosition!!.left) ? this.mouse!!.x - this.boxPosition!!.left : 0;
      this.height = Number(this.mouse!!.y > this.boxPosition!!.top) ? this.mouse!!.y - this.boxPosition!!.top : 0;
    }
  }
  private resizeCondMeet(){
    return (this.mouse!!.x < this.containerPos!!.right && this.mouse!!.y < this.containerPos!!.bottom);
  }

  private move(){
    if(this.moveCondMeet()){
      this.left = this.mouseClick!!.left + (this.mouse!!.x - this.mouseClick!!.x);
      this.top = this.mouseClick!!.top + (this.mouse!!.y - this.mouseClick!!.y);
    }
  }

  private moveCondMeet(){
    const offsetLeft = this.mouseClick!!.x - this.boxPosition!!.left;
    const offsetRight = this.width - offsetLeft;
    const offsetTop = this.mouseClick!!.y - this.boxPosition!!.top;
    const offsetBottom = this.height - offsetTop;
    return true
    // To be determined on how to operate this
    return (
      this.mouse!!.x > this.containerPos!!.left + offsetLeft &&
      this.mouse!!.x < this.containerPos!!.right - offsetRight &&
      this.mouse!!.y > this.containerPos!!.top + offsetTop &&
      this.mouse!!.y < this.containerPos!!.bottom - offsetBottom
      );
  }
}
