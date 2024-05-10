import { compileNgModule } from '@angular/compiler';
import { Injectable } from '@angular/core';
import * as ROSLIB from 'roslib';

@Injectable({
  providedIn: 'root'
})
export class RosService {
  private ros: ROSLIB.Ros;
  private leftBatteryVoltageSubscriber: ROSLIB.Topic;
  private rightBatteryVoltageSubscriber: ROSLIB.Topic;
  private autonomyStatusSubscriber : ROSLIB.Topic;
  private currentCoordinatesSubscriber : ROSLIB.Topic;


  constructor() {
    // Initialize ROS connection
    this.ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090' // TODO: Should probably be moved to .env
    });

    // Create subscriber for battery voltage topic
    this.leftBatteryVoltageSubscriber = new ROSLIB.Topic({
      ros: this.ros,
      name: '/battery_voltage_left',
      messageType: 'std_msgs/Float32'
    });

    this.rightBatteryVoltageSubscriber = new ROSLIB.Topic({
      ros: this.ros,
      name: '/battery_voltage_right',
      messageType: 'std_msgs/Float32'
    });

    // Create subscriber for autonomy status topic
    this.autonomyStatusSubscriber = new ROSLIB.Topic({
      ros: this.ros,
      name: '/SIL_Color',
      messageType: 'std_msgs/String'
    })
    this.currentCoordinatesSubscriber = new ROSLIB.Topic({
      ros: this.ros,
      name : '/gps_data',
      messageType : 'sensor_msgs/msg/NavSatFix'
    })
  }

  connectToRos() {
    this.ros.on('connection', () => {
      console.log('Connected to ROS');
    });

    this.ros.on('error', (error: any) => {
      console.error('Error connecting to ROS:', error);
    });

    this.ros.on('close', () => {
      console.log('Disconnected from ROS');
    });
  }

  // Method to subscribe to battery voltage topic
  subscribeToLeftBatteryVoltage(callback: (data: number) => void) {
    this.leftBatteryVoltageSubscriber.subscribe((message: any) => {
      const float32Message = message as { data: number };
      const roundedValue = parseFloat(float32Message.data.toFixed(1));
      callback(roundedValue);
    });
  }

  subscribeToRightBatteryVoltage(callback: (data: number) => void) {
    this.rightBatteryVoltageSubscriber.subscribe((message: any) => {
      const float32Message = message as { data: number };
      const roundedValue = parseFloat(float32Message.data.toFixed(1));
      callback(roundedValue);
    });
  }

  subscribeToAutonomyStatus(callback: (data: string) => void) {
    this.autonomyStatusSubscriber.subscribe((message: any) => {
      const silColorHex = message.data;
      callback(silColorHex);
    });
  }
  subscribeToRoverCoordinates(callback: (data: any) => void) {
    this.currentCoordinatesSubscriber.subscribe((message: any) => {
      callback(message);
    });
  }
}

