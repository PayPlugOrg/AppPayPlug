import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the ActivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {

  activationForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private alertService: AlertServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.authService.getSessionToken();

    this.activationForm = this.formBuilder.group({
      document: ['', Validators.compose([Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9]+'), Validators.required])],
      codigo: ['', Validators.compose([Validators.maxLength(8), Validators.minLength(8), Validators.required])],
      senha: ['', Validators.compose([Validators.maxLength(6), Validators.minLength(6), Validators.pattern('[0-9]+'), Validators.required])]
    });
  }

  doActivation() {
    
    this.submitAttempt = true;

    if(!this.activationForm.valid) {

      let alert = this.alertService.alertCtrl.create({
        title: 'Informações incorretas!',
        subTitle: 'Por favor, verifique os campos e tente novamente.',
        buttons: ['OK']
      });
      alert.present();
      
    } else {
      this.alertService.showLoader('Ativando usuário...');
      this.authService.register(this.activationForm.value, 'ativacao').then((result) => {
        this.alertService.loading.dismiss();
        this.alertService.presentToast(result);
        this.navCtrl.popToRoot();
      }, (err) => {
        console.error(err);
        this.alertService.loading.dismiss();
        this.alertService.presentToast(err);
      });
    }
  }

  resend(method: string) {
    
  }

}
