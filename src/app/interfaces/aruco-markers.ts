import { Pose } from "roslib";

export interface Header {
    seq: number;
    stamp: {
      secs: number;
      nsecs: number;
    };
    frame_id: string;
  }
  
export interface ArucoMarker {
    header: Header;
    marker_ids: number[];
    poses: Pose[];
}
  