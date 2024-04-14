
import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {DecimalPipe} from "@angular/common";

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [
    GoogleMap,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatLabel,
    CdkDrag,
    DecimalPipe
  ],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})

export class MapsComponent implements OnInit,AfterViewInit{

  coordinatesForm = new FormControl('');
  map : google.maps.Map | undefined
  center = {lat: 45.497406, lng: -73.577102};

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

  ngOnInit() {
    // this.boxPosition
    this.initMap()
  }
    ngAfterViewInit(){
    this.loadBox();
    this.loadContainer();
  }
  constructor() {
  }

  private loadBox(){
    const {left, top} = this.box!!.nativeElement.getBoundingClientRect();
    this.boxPosition = {left, top};
  }
   private loadContainer(){
    const left = this.boxPosition!!.left - this.left;
    const top = this.boxPosition!!.top - this.top;
    const right = left + 2000;
    const bottom = top + 1300;
    this.containerPos = { left, top, right, bottom };
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
    return (
      this.mouse!!.x > this.containerPos!!.left + offsetLeft &&
      this.mouse!!.x < this.containerPos!!.right - offsetRight &&
      this.mouse!!.y > this.containerPos!!.top + offsetTop &&
      this.mouse!!.y < this.containerPos!!.bottom - offsetBottom
      );
  }
  async initMap() {
    // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  this.map = new Map(document.getElementById('map') as HTMLElement, {
        center: this.center,
        zoom: 14,
        mapId: '4504f8b37365c3d0',
    });
 }
  addCoordinates() {
    let coords = this.coordinatesForm.getRawValue()!.split(',')
    //TODO : Error input handling

    if (coords != undefined) {
      let latitude = parseFloat(coords.at(0)!)
      let longitude = parseFloat(coords.at(1)!)

      let position = {
        lat : latitude,
        lng : longitude
      }
      const map = this.map
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
      gmpDraggable: true,
      // content: this.buildContent(property),
      position: position,
      title: "Marker",
    });
      // Display information about this marker
      const infoWindow = new google.maps.InfoWindow({
          //@ts-ignore
          content: `${position.lat},${position.lng}`,
      });
      // Add a click listener for this marker.
      marker.addListener('click', () => {
            infoWindow.close();
            let content = `${marker.position?.lat},${marker.position?.lng},`
            infoWindow.setContent(content);
            infoWindow.open(marker.map, marker);
        });
    }
  }

}

