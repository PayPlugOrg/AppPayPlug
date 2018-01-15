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

  private loading: any;
  private user = {nome:'', nascimento:'', email:'', celular:'', indicacao:'', documento:'', tipo_documento:'CPF'}
  private registerForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private alertService: AlertServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.authService.getSessionToken();
    this.registerForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]+')])],
      nascimento: ['', Validators.compose([])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')])],
      celular: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(15), Validators.pattern('[0-9]+')])],
      indicacao: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]+')])],
      documento: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), Validators.pattern('[0-9]+')])],
      tipo_documento: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  changeLabel(value) {
    this.registerForm.controls['tipo_documento'].setValue(value);
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
