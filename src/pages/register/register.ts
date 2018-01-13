import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  loading: any;
  user = {nome:'', nascimento:'', email:'', celular:'', indicacao:'', documento:'', tipo_documento:'CPF'}
  registerForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private alertService: AlertServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.authService.getSessionToken();
    this.registerForm = this.formBuilder.group({
      nome: [],
      nascimento: [],
      email: [],
      celular: [],
      indicacao: [],
      documento: [],
      tipo_documento: []
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  changeLabel(value) {
    this.user.tipo_documento = value;
  }

  doSignup() {
    this.alertService.showLoader('Registrando usuário...');
    this.authService.register(this.user, 'criacao').then((result) => {
      this.alertService.loading.dismiss();
      this.alertService.presentToast(result);
      this.navCtrl.popToRoot();
    }, (err) => {
      this.alertService.loading.dismiss();
      this.alertService.presentToast(err);
    });
  }

}
