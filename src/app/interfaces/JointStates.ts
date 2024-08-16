export interface Header {
    seq: number;
    stamp: {
      secs: number;
      nsecs: number;
    };
    frame_id: string;
  }
  
export interface JointStates {
    header: Header;
    position: number[];
    velocity: number[];
    effort: number[];
}