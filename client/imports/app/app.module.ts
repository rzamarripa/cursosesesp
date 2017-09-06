import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { MyApp } from './app.component';
import { MenuPrincipalComponent} from './menuPrincipal/menuPrincipal';
import { PrincipalComponent} from '../pages/principal/principal';
import { PageNotFoundComponent} from '../pages/pageNotFound/pageNotFound';
import { DepartamentosComponent} from '../pages/departamentos/departamentos';
import { EmpleadosComponent} from '../pages/empleados/empleados';

const appRoutes: Routes = [
  { path: 'departamentos',
    component: DepartamentosComponent
  },
  { path: 'empleados',
    component: EmpleadosComponent
  },
  { path: '',
    component: PrincipalComponent
  },
  { path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations: [
    MyApp,
    MenuPrincipalComponent,
    PrincipalComponent,
    PageNotFoundComponent,
    DepartamentosComponent,
    EmpleadosComponent
  ],
  bootstrap: [
    MyApp
  ],
  imports: [
  	BrowserModule,
    FormsModule,
    AccountsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ]
})

export class AppModule {
  
}