import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard/main', pathMatch: 'full' },
      {
        path: 'predio',
        loadChildren: () =>
          import('./apps/predio/predio.module').then((m) => m.PredioModule),
      },
      {
        path: 'fiscalizacion',
        loadChildren: () =>
          import('./apps/fiscalizacion/fiscalizacion.module').then((m) => m.FiscalizacionModule),
      },
      
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'advance-table',
        loadChildren: () =>
          import('./advance-table/advance-table.module').then(
            (m) => m.AdvanceTableModule
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./calendar/calendar.module').then((m) => m.CalendarsModule),
      },
      {
        path: 'predio',
        loadChildren: () =>
          import('./apps/predio/predio.module').then((m) => m.PredioModule),
      },
      
      {
        path: 'contribuyente',
        loadChildren: () =>
          import('./apps/contribuyente/contribuyente.module').then(
            (m) => m.ContribuyenteModule
          ),
      },
      
      {
        path: 'caja',
        loadChildren: () =>
          import('./apps/caja/caja.module').then(
            (m) => m.CajaModule
          ),
      },

      {
        path: 'apps',
        loadChildren: () =>
          import('./apps/apps.module').then((m) => m.AppsModule),
      },
      {
        path: 'email',
        loadChildren: () =>
          import('./email/email.module').then((m) => m.EmailModule),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./forms/forms.module').then((m) => m.FormsModule),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./charts/charts.module').then((m) => m.ChartsModule),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./tables/tables.module').then((m) => m.TablesModule),
      },
      {
        path: 'data-tables',
        loadChildren: () =>
          import('./data-tables/data-tables.module').then(
            (m) => m.DataTablesModule
          ),
      },
      {
        path: 'data-tables',
        loadChildren: () =>
          import('./data-tables/data-tables.module').then(
            (m) => m.DataTablesModule
          ),
      },
      {
        path: 'ui',
        loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
      },
      {
        path: 'media',
        loadChildren: () =>
          import('./media/media.module').then((m) => m.MediaModule),
      },
      {
        path: 'widget',
        loadChildren: () =>
          import('./widget/widget.module').then((m) => m.WidgetModule),
      },
      {
        path: 'advanced',
        loadChildren: () =>
          import('./advanced-component/advanced-component.module').then(
            (m) => m.AdvancedComponentModule
          ),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./icons/icons.module').then((m) => m.IconsModule),
      },
      {
        path: 'extra-pages',
        loadChildren: () =>
          import('./extra-pages/extra-pages.module').then(
            (m) => m.ExtraPagesModule
          ),
      },
      {
        path: 'maps',
        loadChildren: () =>
          import('./maps/maps.module').then((m) => m.MapsModule),
      },
      {
        path: 'multilevel',
        loadChildren: () =>
          import('./multilevel/multilevel.module').then(
            (m) => m.MultilevelModule
          ),
      },
      
    ],
  },

  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
