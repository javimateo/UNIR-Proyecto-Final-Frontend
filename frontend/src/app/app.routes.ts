import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportedProductsComponent } from './pages/moderator/reported-products/reported-products';
import { ModeratorHomeComponent } from './pages/moderator/moderator-home';
import { ReportDetailComponent } from './pages/moderator/report-detail/report-detail';
import { IncidentsComponent } from './pages/moderator/incidents/incidents';
import { HistoryComponent } from './pages/moderator/history/history';
import { NotificationComponent } from './pages/moderator/notification/notification';
import { PaymentComponent } from './pages/payment/payment';

export const routes: Routes = [

  {path:"",redirectTo:"home",pathMatch:"full"},

  {path:"home",component:HomeComponent},

  {path:"login",component:LoginComponent},

  {path:"moderator",component:ModeratorHomeComponent},

  {path:"reported-products",component:ReportedProductsComponent},

  {path:"report-detail", component:ReportDetailComponent},
  
  {path:'incidents', component:IncidentsComponent},

  {path:"history", component:HistoryComponent},

  {path:'notification', component:NotificationComponent},

  {path: 'payment', component: PaymentComponent},
  

];