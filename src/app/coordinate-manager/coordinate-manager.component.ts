import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatError, MatFormField, MatInput} from "@angular/material/input";
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import { MatTableDataSource } from '@angular/material/table';
import {ErrorStateMatcher} from "@angular/material/core";
import {NgForOf} from "@angular/common";

export interface CoordinateElement {
  name: string;
  latitude: FormControl;
  longitude: number;
  status: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Coordinates{
  lat : number,
  lng : number;
}

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
    MatLabel,
    MatError,
    NgForOf
  ],
  templateUrl: './coordinate-manager.component.html',
  styleUrl: './coordinate-manager.component.css'
})

export class CoordinateManagerComponent implements OnInit{
  displayedColumns: string[] = ['name', 'latitude', 'longitude', 'status'];
  dataSource = new MatTableDataSource<CoordinateElement>();

  // coordinatesFrom = new FormGroup({
  //   latitudeFormControl : new FormControl('45.496082',
  //     [Validators.required, Validators.min(-90), Validators.max(90)]),
  //   longitudeFormControl : new FormControl('-73.569916',
  //     [Validators.required, Validators.min(-180), Validators.max(180)])
  // })

  @Output() newCoordinates = new EventEmitter<Coordinates>()

  coordsForm : FormGroup
  matcher = new MyErrorStateMatcher();

   coordinates: CoordinateElement[] = [
  // {name: "GPS1",  latitude: this.latitudeFormControl, longitude: 0, status: 'Inactive'}
  ];
  getCoords(){
    return this.coordsForm.get('Coordinates') as FormArray
  }
  getRows(){
    return this.coordsForm.get('rows') as FormArray
  }
   ngOnInit() {
      this.coordsForm = this.fb.group({
        rows : this.fb.array([]),
      })

     for (let i = 0; i < 3; i++) {
      this.getRows().push(
        this.fb.group({
          latitude : new FormControl('45.496082',
      [Validators.required, Validators.pattern("^-?(?:90(?:\\.0+)?|[1-8]?\\d(?:\\.\\d+)?|0(?:\\.\\d+)?)$")]),
          longitude : new FormControl('-73.569916',
      [Validators.required, Validators.pattern("^-?(?:180(?:\\.0+)?|[1-8]?\\d(?:\\.\\d+)?|0(?:\\.\\d+)?)$")])
        })
      )}
   }

  constructor(public dialogRef: MatDialogRef<CoordinateManagerComponent>,private fb:FormBuilder) {
    this.dataSource.data = this.coordinates
  }
  addCoordinates(index : number){
    if(this.getRows().at(index).invalid){
      console.log('Something is wrong here...')
    }

    console.log(this.getRows().at(index))
    // let coords : Coordinates = {
      // lat : parseFloat(this.latitudeFormControl.getRawValue()!!),
      // lng : parseFloat(this.longitudeFormControl.getRawValue()!!)
    // }
    // console.log(coords)
    // coordinates.push(  {name: "GPS1",  latitude: 0, longitude: 0, status: 'Inactive'})

    // data.push()
    // this.dataSource.data = coordinates
    // this.newCoordinates.emit(coords)
    // this.longitudeFormControl.disable()
  }

  protected readonly onkeyup = onkeyup;
}
