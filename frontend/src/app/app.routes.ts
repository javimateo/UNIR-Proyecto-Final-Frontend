import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ModDashboardComponent } from './pages/mod-dashboard/mod-dashboard.component';
import { adminGuard } from './guards/admin-guard';
import { moderadorGuard } from './guards/moderador-guard';

export const routes: Routes = [
    {path:"", pathMatch:"full", redirectTo:"login"},
    {path:"login", component:LoginComponent},
    {path:"home", component:HomeComponent},
    {path:"anuncio/nuevo", component:ItemFormComponent},
    {path:"anuncio/editar/:id", component:ItemFormComponent},
    {path:"anuncio/:id", component:ItemDetailComponent},
    {path:"admin-dashboard", component:AdminDashboardComponent, canActivate:[adminGuard]},
    {path:"mod-dashboard", component:ModDashboardComponent, canActivate:[moderadorGuard]},
];

