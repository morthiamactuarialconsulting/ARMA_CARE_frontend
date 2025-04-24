import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessionalDashboardComponent } from './components/dashboard/dashboard.component';
import { professionalGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: ProfessionalDashboardComponent,
    canActivate: [() => professionalGuard()]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule { }
