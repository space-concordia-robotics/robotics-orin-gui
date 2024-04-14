import { Routes } from '@angular/router';
import {VideoServerComponent} from "./video-server/video-server.component";
import {VideoClientComponent} from "./video-client/video-client.component";

export const routes: Routes = [
  {path : 'server', component:VideoServerComponent},
  {path : 'video-client', component:VideoClientComponent}
];
