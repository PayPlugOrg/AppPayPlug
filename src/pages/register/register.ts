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
  private user = {name:'', born:'', email:'', cellphone:'', indication:'', document:'', tipo_documento:'CPF'}
  private registerForm: FormGroup;
  submitAttempt: boolean = false;
  private title = "Registre-se";
  public checked : boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private alertService: AlertServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.authService.getSessionToken();
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-ZA-zÀ-ú ]+')])],
      born: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      cellphone: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(15), Validators.pattern('[+]?[0-9]+')])],
      indication: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]+')])],
      document: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), Validators.pattern('[0-9]+')])]
      //tipo_documento: ['', Validators.compose([Validators.required])]
    });
    if(navParams.get('title')) {
      var cpf = localStorage.getItem('cpf');
      this.title = navParams.get('title');
      this.registerForm.controls['indication'].setValue(cpf);
      this.checked = true;
    }
  }

  ionViewDidLoad() {
  }

  changeLabel(value) {
    //this.registerForm.controls['tipo_documento'].setValue(value);
    this.user.tipo_documento = value;
  }

  doSignup() {

    this.submitAttempt = true;

    if(!this.registerForm.valid) {

      let alert = this.alertService.alertCtrl.create({
        title: 'Informações incorretas!',
        subTitle: 'Por favor, verifique os campos e tente novamente.',
        buttons: ['OK']
      });
      alert.present();
      
    } else {
      this.alertService.showLoader('Registrando usuário...');
      this.authService.register(this.registerForm.value, 'criacao').then((result) => {
        this.alertService.loading.dismiss();
        this.alertService.presentToast(result);
        this.navCtrl.popToRoot();
      }, (err) => {
        this.alertService.loading.dismiss();
        this.alertService.presentToast(err);
      });
    }
  }

}
