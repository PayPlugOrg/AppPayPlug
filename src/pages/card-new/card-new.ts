import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the CardNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card-new',
  templateUrl: 'card-new.html',
})
export class CardNewPage {
  
  private newCardValidation: FormGroup;
  private submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public alertService: AlertServiceProvider,
    public authService: AuthServiceProvider
  ) {
    this.newCardValidation = this.formBuilder.group({
      cardNumber: ['', Validators.compose([Validators.required])],
      valid: ['', Validators.compose([Validators.required])],
      holder: ['', Validators.compose([Validators.required])]
    });
  }

  changeCardType(type: string) {

  }

  newCard() {

    this.submitAttempt = true;

    if(!this.newCardValidation.valid) {
      let alert = this.alertService.alertCtrl.create({
        title: 'Informações incorretas!',
        subTitle: 'Por favor, verifique os campos e tente novamente.',
        buttons: ['Ok']
      });
    } else {
      this.alertService.showLoader('Cadastrando novo cartão...');
      this.authService.newCard(this.newCardValidation.value).then((result) => {
        console.log(result);
        this.alertService.loading.dismiss();
        this.viewCtrl.dismiss();
      },(err) => {
        console.error(err);
        this.alertService.loading.dismiss();
        this.alertService.presentToast(err);
        this.viewCtrl.dismiss();
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
