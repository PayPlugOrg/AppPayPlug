import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Component, ViewChild } from '@angular/core';
import { LoadingController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login'
import { ListPage } from '../pages/list/list';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  loading: any;
  pages: Array<{title: string, component: any}>;
  nome: any = null;

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
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
    console.log(this.authService.user['nome']);
    this.nome = this.authService.user['nome'];
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
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
