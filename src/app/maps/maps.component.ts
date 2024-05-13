
import { Component, OnInit} from '@angular/core';
import {GoogleMap, MapAdvancedMarker} from "@angular/google-maps";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {DecimalPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {CoordinateManagerComponent, Coordinates} from "../coordinate-manager/coordinate-manager.component";

// import {CoordinateService} from "../services/coordinate-service";
import { RosService } from '../services/ros.service';

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

  map : google.maps.Map
  center = {lat: 45.497406, lng: -73.577102};
  markers : google.maps.marker.AdvancedMarkerElement[]
  rover_marker : google.maps.marker.AdvancedMarkerElement

  // Creates the dialog that contains the coordinate manager window.
  openDialog(){
      const dialogRef = this.dialog.open(CoordinateManagerComponent,{
        width : '50%',
        // height : '100%'
        }
      )
   }
  ngOnInit() {
    // Initialize maps
    this.initMap().then(r => {
      // Get the gps coordinates from the gpsService, and add move the rover on the map
      this.rosService.subscribeToGPS(coordinate  => {
          console.log(coordinate)
          this.updateRoverMarker(coordinate)
      })
    })
    // this.initMap().then(r => {
    //   // Get the gps coordinates from the storage, and add them to the map
    //   this.coordinateService.coordinates_value.subscribe(value  => {
    //   if(value != null){
    //     for (const coordinate of (JSON.parse(value) as Coordinates[])) {
    //       console.log(coordinate)
    //       this.addCoordinates(coordinate)
    //     }
    //   }
    //   })
    // })
  }

  // constructor(public dialog: MatDialog, private coordinateService : CoordinateService, private roslibService : ROSLIB_Service) {
  constructor(public dialog: MatDialog, private rosService: RosService) {
    this.markers = []
  }

  async initMap() {

    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    this.map = new Map(document.getElementById('map') as HTMLElement, {
        center: this.center,
        zoom: 17,
        mapId: '4504f8b37365c3d0',
    });

    const rover_marker_img = document.createElement('img');
    rover_marker_img.src = 'assets/images/robot.png'
    rover_marker_img.width = 40;
    rover_marker_img.height = 40;

    this.rover_marker = new AdvancedMarkerElement({
          map : this.map,
          position: this.center,
          gmpDraggable : false,
          content: rover_marker_img,
    });
    // Add a click listener for each marker, and set up the info window.
    const infoWindow = new google.maps.InfoWindow({
          //@ts-ignore
          content: `CERES ^_^`,
    });
    this.rover_marker.addListener('click', () => {
      infoWindow.close();
      infoWindow.open(this.rover_marker.map, this.rover_marker);
    });
  }
  /*
  Function for adding a single coordinate to the existing map. Pins are set to a custom blue theme. Clicking on a marker
  reveals the coordinates for that marker. The markers should NOT be draggable, to prevent accidental user input.
   */
  addCoordinates(coordinate : Coordinates) {
    // Glyph refers to the dot at the middle of the waypoint
    const pinBackground = new google.maps.marker.PinElement({
    background: '#327ba8',
    borderColor : '#3232a8',
    glyphColor : '#ffffff'
    });

    // Create the marker that will be added to the map for this coordinate
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map : this.map,
      gmpDraggable: false,
      position: {
        lat : coordinate.latitude,
        lng : coordinate.longitude,
      },
      content : pinBackground.element,
      title: "Marker",
    });

    // Display information about this marker
    const infoWindow = new google.maps.InfoWindow({
        content: `${marker.position!!.lat},${marker.position!!.lng}`,
    });
    // Add a click listener for this marker.
    marker.addListener('click', () => {
          infoWindow.close();
          infoWindow.open(marker.map, marker);
    });
  }

  updateRoverMarker(coordinate : google.maps.LatLng) {
    this.rover_marker.position = coordinate;
  }
}

