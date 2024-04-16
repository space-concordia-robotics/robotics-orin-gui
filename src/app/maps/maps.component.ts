
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

export class MapsComponent implements OnInit{

  coordinatesForm = new FormControl('');
  map : google.maps.Map | undefined
  center = {lat: 45.497406, lng: -73.577102};

  ngOnInit() {
    // this.boxPosition
    this.initMap()
  }
  constructor() {
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

