import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {CoordinateService} from "./services/coordinate-service";
import {ROSLIB_Service} from "./services/roslibjs-service";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), CoordinateService,ROSLIB_Service,provideAnimationsAsync()]
};
