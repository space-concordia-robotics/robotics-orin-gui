
import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {DecimalPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {CoordinateManagerComponent, Coordinates} from "../coordinate-manager/coordinate-manager.component";

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
    DecimalPipe,
    MatButton
  ],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})

export class MapsComponent implements OnInit{

  coordinatesForm = new FormControl('');
  map : google.maps.Map | undefined
  center = {lat: 45.497406, lng: -73.577102};

  openDialog(){
      const dialogRef = this.dialog.open(CoordinateManagerComponent)
      dialogRef.componentInstance.newCoordinates.subscribe(result =>{
        this.addCoordinates(result)
      })
   }
  ngOnInit() {
    // this.boxPosition
    this.initMap().then(r => {
    })
  }

  constructor(public dialog: MatDialog) {

  }

  async initMap() {
    // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  this.map = new Map(document.getElementById('map') as HTMLElement, {
        center: this.center,
        zoom: 17,
        mapId: '4504f8b37365c3d0',
    });
  const map = this.map

  const parser = new DOMParser();
  const pinSvgString = '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#7837FF"></rect><path d="M46.0675 22.1319L44.0601 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9402 33.2201L9.93262 33.8723" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 47.0046V44.8933" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 9V11.1113" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 43.3597L37.9186 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 12.6442L18.0816 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.93262 22.1319L11.9402 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M46.0676 33.8724L44.0601 33.2201" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 12.6442L37.9186 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 43.3597L18.0816 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28 39L26.8725 37.9904C24.9292 36.226 23.325 34.7026 22.06 33.4202C20.795 32.1378 19.7867 30.9918 19.035 29.9823C18.2833 28.9727 17.7562 28.0587 17.4537 27.2401C17.1512 26.4216 17 25.5939 17 24.7572C17 23.1201 17.5546 21.7513 18.6638 20.6508C19.7729 19.5502 21.1433 19 22.775 19C23.82 19 24.7871 19.2456 25.6762 19.7367C26.5654 20.2278 27.34 20.9372 28 21.8649C28.77 20.8827 29.5858 20.1596 30.4475 19.6958C31.3092 19.2319 32.235 19 33.225 19C34.8567 19 36.2271 19.5502 37.3362 20.6508C38.4454 21.7513 39 23.1201 39 24.7572C39 25.5939 38.8488 26.4216 38.5463 27.2401C38.2438 28.0587 37.7167 28.9727 36.965 29.9823C36.2133 30.9918 35.205 32.1378 33.94 33.4202C32.675 34.7026 31.0708 36.226 29.1275 37.9904L28 39Z" fill="#FF7878"></path></svg>';
  const pinSvg = parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement;

    const roverMarker = new AdvancedMarkerElement({
        map,
        position: { lat: 45.497406, lng: -73.577102},
        gmpDraggable : true,
        content: pinSvg,
        title: 'A marker using a custom SVG image.',
    });

       // Add a click listener for each marker, and set up the info window.
      const infoWindow = new google.maps.InfoWindow({
          //@ts-ignore
          content: `Here is the rover !`,
      });
      roverMarker.addListener('click', () => {
            infoWindow.close();
            // let content = `Rover is at : ${roverMarker.position?.lat},${roverMarker.position?.lng},`
            // infoWindow.setContent(content);
            infoWindow.open(roverMarker.map, roverMarker);
        });
  //

    }



  addCoordinates(coords : any) {
    console.log(coords)

    const map = this.map
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      gmpDraggable: true,
      // content: this.buildContent(property),
      position: coords,
      title: "Marker",
    });
    // Display information about this marker
    const infoWindow = new google.maps.InfoWindow({
        //@ts-ignore
        content: `${marker.position.lat},${marker.position.lng}`,
    });
    // Add a click listener for this marker.
    marker.addListener('click', () => {
          infoWindow.close();
          infoWindow.open(marker.map, marker);
      });
  }

}

