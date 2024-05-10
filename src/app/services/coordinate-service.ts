import {BehaviorSubject} from 'rxjs';
import {Injectable} from "@angular/core";
@Injectable({providedIn: 'root'})
export class CoordinateService {
 coordinates_value = new BehaviorSubject(this.coordinates);

 set coordinates(value) {
   this.coordinates_value.next(value); // this will make sure to tell every subscriber about the change.
   localStorage.setItem('coordinates', value!!);
 }

 get coordinates() {
   return localStorage.getItem('coordinates');
 }
}
