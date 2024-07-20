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
  private gpsSubscriber : ROSLIB.Topic;
  private jointStatesSubscriber: ROSLIB.Topic;

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
    // Create subscriber for GPS topic
    this.gpsSubscriber = new ROSLIB.Topic({
      ros: this.ros,
      name: '/gps_data',
      messageType: 'sensor_msgs/NavSatFix'
    })
    // Create subscriber for joint states topic
    this.jointStatesSubscriber = new ROSLIB.Topic({
      ros: this.ros,
      name: '/joint_states',
      messageType: 'sensor_msgs/JointState'
    });
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

  // Method to subscribe to left battery voltage topic
  subscribeToLeftBatteryVoltage(callback: (data: number) => void) {
    this.leftBatteryVoltageSubscriber.subscribe((message: any) => {
      const float32Message = message as { data: number };
      const roundedValue = parseFloat(float32Message.data.toFixed(1));
      callback(roundedValue);
    });
  }

  // Method to subscribe to right battery voltage topic
  subscribeToRightBatteryVoltage(callback: (data: number) => void) {
    this.rightBatteryVoltageSubscriber.subscribe((message: any) => {
      const float32Message = message as { data: number };
      const roundedValue = parseFloat(float32Message.data.toFixed(1));
      callback(roundedValue);
    });
  }

  // Method to subscribe to autonomy status topic
  subscribeToAutonomyStatus(callback: (data: string) => void) {
    this.autonomyStatusSubscriber.subscribe((message: any) => {
      const silColorHex = message.data;
      callback(silColorHex);
    });
  }
  // Method to subscribe to gps topic
  subscribeToGPS(callback: (data: any) => void) {
    this.gpsSubscriber.subscribe((message: any) => {
      const coordinate = {lat : message.latitude, lng: message.longitude}
      callback(coordinate)
    });
  }
  // Method to subscribe to joint states topic
  subscribeToJointStates(callback: (data: any) => void) {
    this.jointStatesSubscriber.subscribe((message: any) => {
      const jointState = {
        names: message.name,
        positions: message.position
      };
      callback(jointState);
    });
  }
}

