// src/app/app.routes.ts
import type { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import {RegisteredPatients } from './pages/registered-patients/registered-patients';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'data', component: RegisteredPatients },
  { path: '**', redirectTo: '' }
];
