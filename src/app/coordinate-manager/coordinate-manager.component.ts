import { Component } from '@angular/core';
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
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
export interface CoordinateElement {
  name: string;
  latitude: number;
  longitude: number;
  status: string;
}
const ELEMENT_DATA: CoordinateElement[] = [
  {name: "GPS1", latitude: 1.22123, longitude: 1.0079, status: 'H'},
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
    ReactiveFormsModule
  ],
  templateUrl: './coordinate-manager.component.html',
  styleUrl: './coordinate-manager.component.css'
})

export class CoordinateManagerComponent {
  displayedColumns: string[] = ['name', 'latitude', 'longitude', 'status'];
  coordinatesForm : FormControl
  dataSource = ELEMENT_DATA;
}
