import { Injectable } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subject, Observable } from 'rxjs';

// Here you define the type (as in your .msg, but in Typescript)
export interface String {
   data: string;
}

@Injectable({
  providedIn: 'root'
})
export class ROSLIB_Service {
  private _ros: ROSLIB.Ros;
  private _connected = new Subject<boolean>();
  private _chat = new Subject<String>();

  public _gps?: ROSLIB.Topic;

  constructor() {
    this._connected.next(false);

    this._ros = new ROSLIB.Ros({});
    this._ros.connect('ws://127.0.0.1:9090');
    this._ros.on('connection', (event: any) => {
      this._connected.next(true);
    })
    // TODO : Manage the events "disconnect" and "error".
    this.initializeTopics()
    let msg = "hello"
    this._gps?.publish({
      msg
    })
  }
  initializeTopics(){
    this._gps = new ROSLIB.Topic({
      ros : this._ros,
      name : '/listener',
      messageType : 'std_msgs/String'
    })
  }
  get connected(): Observable<boolean> {
    return this._connected.asObservable();
  }
}
