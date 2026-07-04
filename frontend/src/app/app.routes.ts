import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

import { ReportedProductsComponent } from './pages/moderator/reported-products/reported-products';
import { ModeratorHomeComponent } from './pages/moderator/moderator-home';
import { ReportDetailComponent } from './pages/moderator/report-detail/report-detail';
import { IncidentsComponent } from './pages/moderator/incidents/incidents';
import { HistoryComponent } from './pages/moderator/history/history';
import { NotificationComponent } from './pages/moderator/notification/notification';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ModDashboardComponent } from './pages/mod-dashboard/mod-dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { adminGuard } from './guards/admin-guard';
import { moderadorGuard } from './guards/moderador-guard';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [  
    {path:"", pathMatch:"full", redirectTo:"login"},
    {path:"login", component:LoginComponent, canActivate:[guestGuard]},
    {path:"home", component:HomeComponent, canActivate:[authGuard]},
    {path:"anuncio/nuevo", component:ItemFormComponent, canActivate:[authGuard]},
    {path:"anuncio/editar/:id", component:ItemFormComponent, canActivate:[authGuard]},
    {path:"anuncio/:id", component:ItemDetailComponent, canActivate:[authGuard]},
    {path:"dashboard", component:UserDashboardComponent, canActivate:[authGuard]},
    {path:"admin-dashboard", component:AdminDashboardComponent, canActivate:[adminGuard]},
    {path:"mod-dashboard", component:ModeratorHomeComponent, canActivate:[moderadorGuard]},
  {path:"moderator",component:ModeratorHomeComponent},

  {path:"reported-products",component:ReportedProductsComponent},

  {path:"report-detail", component:ReportDetailComponent},
  
  {path:'incidents', component:IncidentsComponent},

  {path:"history", component:HistoryComponent},

  {path:'notification', component:NotificationComponent},
];


