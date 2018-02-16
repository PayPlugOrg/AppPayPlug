import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  user: any;
  update: boolean = true;

  private updateForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public formBuilder: FormBuilder
  ) {
    this.user = this.authService.getUserData();
    console.log(this.user);
    this.updateForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-ZA-zÀ-ú ]+')])],
      born: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      cellphone: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(15), Validators.pattern('[+]?[0-9]+')])],
      indication: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]+')])],
      document: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), Validators.pattern('[0-9]+')])]
    });
  }

  ionViewDidEnter(){
   this.updateForm.controls['name'].setValue(this.user['Nome']);
   this.updateForm.controls['born'].setValue(this.user['DataNascimento']);
   this.updateForm.controls['email'].setValue(this.user['Email']);
   this.updateForm.controls['cellphone'].setValue(this.user['Celular']);
   this.updateForm.controls['address'].setValue(this.user['Endereco']);
   console.log(this.updateForm.value);
  }

  updateData() {

  }

}
