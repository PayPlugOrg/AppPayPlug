import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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

  user = {
    Id: '',
    Nome: '',
    CpfCnpj: '',
    Celular: '',
    Email: '',
    SaldoTotal: '',
    SaldoDisponivelSaque: '',
    NomeMoeda: '',
    MoedaSimbolo: '',
    NumeroCartao: '',
    TitularCartao: '',
    DataCartao: '',
    Endereco: '',
    DataNascimento: '',
    IsBloqueado: false
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthServiceProvider
  ) {
    this.getUserData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  getUserData() {
    this.authService.getUserInfo().then((result) => {
      console.log('[user name] ' + result['Nome']);
      
      for(let o in result) {
        this.user[o] = result[o];
      }
    });
  }

}
