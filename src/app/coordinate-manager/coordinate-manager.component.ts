import {ChangeDetectorRef, Component} from '@angular/core';
import {MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatFormField, MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import { MatTableDataSource } from '@angular/material/table';

export interface CoordinateElement {
  name: string;
  latitude: number;
  longitude: number;
  status: string;
}
let coordinates: CoordinateElement[] = [
  {name: "GPS1",  latitude: 1.22123, longitude: 1.0079, status: 'Inactive'},
  {name: "GPS1",  latitude: 1.22123, longitude: 1.0079, status: 'Inactive'},
  {name: "GPS1",  latitude: 1.22123, longitude: 1.0079, status: 'Inactive'},

];

@Component({
  selector: 'app-coordinate-manager',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatHeaderRow,
    MatCell,
    MatRow,
    MatHeaderCell,
    MatColumnDef,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatLabel
  ],
  templateUrl: './coordinate-manager.component.html',
  styleUrl: './coordinate-manager.component.css'
})

export class CoordinateManagerComponent {
  displayedColumns: string[] = ['name', 'latitude', 'longitude', 'status'];
  coordinatesForm : FormControl
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<CoordinateElement>();

  constructor() {
    this.dataSource.data = coordinates
  }
  addCoordinates(){
    coordinates.push(  {name: "GPS1",  latitude: 1.22123, longitude: 1.0079, status: 'Inactive'})

    // data.push()
    this.dataSource.data = coordinates
  }

  protected readonly onkeyup = onkeyup;
}
