import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ModDashboardComponent } from './pages/mod-dashboard/mod-dashboard.component';
import { adminGuard } from './guards/admin-guard';
import { moderadorGuard } from './guards/moderador-guard';

export const routes: Routes = [
    {path:"", pathMatch:"full", redirectTo:"login"},
    {path:"login", component:LoginComponent},
    {path:"home", component:HomeComponent},
    {path:"admin-dashboard", component:AdminDashboardComponent, canActivate:[adminGuard]},
    {path:"mod-dashboard", component:ModDashboardComponent, canActivate:[moderadorGuard]},
    

];
