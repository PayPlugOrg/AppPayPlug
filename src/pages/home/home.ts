import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: {};
  nome: any;
  saldo: any;
  loading: any;
  isLoggedIn: boolean = false;

  constructor(
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    private alertService: AlertServiceProvider
  ) {
    //Se não há token de sessão direciona para o Login
    if(!localStorage.getItem("token")) {
      navCtrl.setRoot(LoginPage);
      this.alertService.enableMenu(true, 'unauthenticated');
      this.alertService.enableMenu(false, 'authenticated');
    } else {
      this.alertService.enableMenu(true, 'authenticated');
      this.alertService.enableMenu(false, 'anauthenticated');
      this.isLoggedIn = true;
    }
  }

  ionViewDidLoad() {
    this.authService.getUserInfo().then((result) => {
      this.user = result;
      this.nome = result['Nome'];
      this.saldo = result['SaldoTotal'];
    },(err) => {
      console.log(err);
    });
  }

  openPage(page) {
    this.navCtrl.push(page);
  }

}
