import { Routes } from '@angular/router';
import {VideoServerComponent} from "./video-server/video-server.component";
import {VideoClientComponent} from "./video-client/video-client.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
  {path : '', component:DashboardComponent},
  {path : 'server', component:VideoServerComponent},
  {path : 'client', component:VideoClientComponent}
];
