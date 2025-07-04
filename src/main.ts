// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // your root standalone App component
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient,withFetch } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
}).catch((err) => console.error(err)); 
