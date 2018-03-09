import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ActivationPage } from '../activation/activation';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: any;
  user = { nome: '', senha: '' };
  data: any;
  isLoggedIn: boolean = false;
  users: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    private alertService: AlertServiceProvider,
    private fb: Facebook,
    private googlePlus: GooglePlus
  ) {
    this.user['nome'] = localStorage.getItem("login");

    fb.getLoginStatus()
      .then(res => {
        console.log("status " + res.status);
        if (res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log("err fb: " + e));
    //Se há token de sessão direciona para o Home do usuário
    if (localStorage.getItem("token") || localStorage.getItem("fbToken") || localStorage.getItem("gToken")) {
      navCtrl.setRoot(HomePage);
      this.alertService.enableMenu(true, 'authenticated');
      this.alertService.enableMenu(false, 'unauthenticated');
    } else {
      this.alertService.enableMenu(true, 'unauthenticated');
      this.alertService.enableMenu(false, 'authenticated');
      this.isLoggedIn = true;
    }
  }

  loginFacebook() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if (res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
          localStorage.setItem("fbToken", res.authResponse.accessToken);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  loginGoogle() {
    this.googlePlus.login({})
      .then(res => {
        console.log(res);
        localStorage.setItem("gToken", res.accessToken);
        this.navCtrl.setRoot(HomePage, { socialInfo: res });
        this.isLoggedIn = true;
      })
      .catch(err => console.error(err));
  }

  getUserDetail(userid) {
    this.fb.api("/" + userid + "/?fields=id,email,name,picture,gender", ["public_profile"])
      .then(res => {
        console.log(res);
        this.navCtrl.setRoot(HomePage, { socialInfo: res });
        this.users = res;
      })
      .catch(e => {
        console.log(e);
      });
  }

  ionViewDidLoad() {
    this.user.nome = localStorage.getItem("login");
  }

  doLogin() {
    this.alertService.showLoader('Validando acesso...');
    this.authService.login(this.user).then((result) => {
      this.alertService.loading.dismiss();
      this.data = result;
      if (this.data) {
        localStorage.setItem('token', this.data.Token);
        localStorage.setItem('login', this.user['nome']);
        this.authService.getUserData();
        this.navCtrl.setRoot(HomePage);
      }
    }, (err) => {
      this.alertService.loading.dismiss();
      this.alertService.presentToast(err);
    });
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  activation() {
    this.navCtrl.push(ActivationPage);
  }

}
