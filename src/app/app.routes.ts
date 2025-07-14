// src/app/app.routes.ts
import type { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import {RegisteredPatients } from './pages/registered-patients/registered-patients';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'data', component: RegisteredPatients },
  { path: '**', redirectTo: '' }
];
