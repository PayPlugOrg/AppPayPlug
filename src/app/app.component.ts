import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Component, ViewChild } from '@angular/core';
import { LoadingController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login'
import { ListPage } from '../pages/list/list';
import { AboutPage } from '../pages/about/about';
import { TransferPage } from '../pages/transfer/transfer';
import { UserPage } from '../pages/user/user';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  loading: any;
  publicPages: Array<{title: string, component: any, icon: string}>;
  privatePages: Array<{title: string, component: any, icon: string}>;
  nome: any;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private authService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    private alertService: AlertServiceProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.publicPages = [
      { title: 'Home', component: LoginPage, icon:'home' },
      { title: 'Sobre', component: AboutPage, icon: 'information-circle' },
      { title: 'Perguntas Frequentes', component: ListPage, icon: 'chatbubbles' }
    ];
    this.privatePages = [
      { title: 'Home', component: HomePage, icon:'home' },
      { title: 'Transferência', component: TransferPage, icon:'swap' },
      { title: 'Minhas Informações', component: UserPage, icon:'contact' },
      { title: 'Extratos', component: ListPage, icon:'trending-up' }
    ];
  }

  public logout() {
    this.alertService.showLoader('Encerrando sessão...');
    this.alertService.enableMenu(true, 'unauthenticated');
    this.alertService.enableMenu(false, 'authenticated');
    this.authService.logout().then(() => {
      this.nav.setRoot(LoginPage);
      this.alertService.loading.dismiss();
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Encerrando sessão...'
    });
    this.loading.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString('#2a365b');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title == 'Home') {
      this.nav.setRoot(page.component);
    } else {
      this.nav.push(page.component);
    }
  }
}
