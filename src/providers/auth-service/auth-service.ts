import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertServiceProvider } from '../alert-service/alert-service';
import { Events } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/



@Injectable()
export class AuthServiceProvider {

  token: string = '';

  user = { nome: '', nascimento: '', email: '', celular: '', indicacao: '', documento: '', tipo_documento: 'CPF' }
  userInfo: any;

  dev: boolean = true;

  apiUrl = 'api';//'api'; http://177.52.170.238:84/v1';

  constructor(
    public http: Http,
    public alertService: AlertServiceProvider,
    public events: Events,
    private fb: Facebook,
    private googlePlus: GooglePlus
  ) {
  }

  login(user) {
    this.user = user;
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(this.apiUrl + '/Tokens/New?email=' + user['nome'] + '&dataFormat=json&password=' + user['senha'] + '&duration=200', null, { headers: headers })
        .subscribe(res => {
          if (res.json()) {
            resolve(res.json());
          } else {
            reject("Erro ao fazer login. Usuário não encontrado ou senha incorreta");
          }
        }, (err) => {
          reject(err);
        });
    });
  }

  getSessionToken() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var password = this.dev ? "1234" : "890098";

      //Requisição do Token de sessão para inserção do usuário
      this.http.post(this.apiUrl + '/Tokens/New?email=camaradecomercio@payplug.com.br&dataFormat=json&password=' + password + '&duration=5', null, { headers: headers })
        .subscribe(res => {
          if (res.json().Success) {
            this.token = res.json().Token;
          } else {
            reject(res);
          }
        }, (err) => {
          reject(err);
        });
    });
  }

  passwordReset(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.apiUrl + '/Users/SendLiberationPassword?identifier=' + data.email + '&dataFormat=json';

      this.http.post(consulta, null, { headers: headers }).subscribe(res => {

        resolve(res.json());
      }, (err) => {

        reject(err);
      });
    })
  }

  getUserInfo(userInfo = localStorage.getItem('login')) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      var consulta = this.apiUrl + '/Users/Info?token=' + localStorage.getItem('token') + '&id=' + userInfo + '&dataFormat=json';

      this.http.post(consulta, null, { headers: headers }).subscribe(res => {
        if (this.tokenExpired(res.json()['Message'])) {
          this.alertService.presentToast('Sua sessão expirou');
          reject(res.json()['Message']);
        } else {
          this.userInfo = res.json();
          resolve(res.json());
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  private tokenExpired(message): boolean {
    if (message == 'Authentication failed.') {
      this.logout();
      return true;
    }
    return false;
  }

  getUserData() {
    let user1 = {
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
    this.getUserInfo().then((result) => {

      localStorage.setItem('username', result['Nome']);
      localStorage.setItem('id', result['Id']);
      localStorage.setItem('cpf', result['CpfCnpj']);

      for (let o in result) {
        user1[o] = result[o];
      }
    });
    return user1;
  }

  register(user, operacao) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.apiUrl + '/Users/Save?token=' + this.token + '&fullName=' + user['name'] + '&cpfCnpj=' + user['document'] + '&EmpresaCnpj=' + '&cellphone=' + user['cellphone'] + '&email=' + user['email'] + '&coin=1&dataNascimento=' + user['born'] + '&cpfCnpjIndicacao=' + '&dataFormat=json';
      if (operacao == 'ativacao') {
        consulta = this.apiUrl + '/Users/AtivarUsuario?token=' + this.token + '&identifier=' + user['document'] + '&codigo=' + user['codigo'] + '&senha=' + user['senha'] + '&dataFormat=json';
      }


      //Requisição de inserção do novo usuário
      this.http.post(consulta, null, { headers: headers })
        .subscribe(res => {

          if (res.json().Id && res.json().Codigo && operacao == 'criacao') {
            resolve("Usuário criado com sucesso!");
          } else if (res.json().Success == false && operacao == 'criacao') {
            reject("Alguma informação já está cadastrada na base de dados. " + res.json().Message);
          } else if (res.json().Codigo == null && operacao == 'criacao') {
            reject("Usuário já cadastrado. Verifique suas informações!");
          } else if (res.json().Success && operacao == 'ativacao') {
            resolve(res.json().Message);
          } else {
            reject(res.json().Message)
          }
        }, (err) => {
          reject(err);
        });
    });
  }

  logout() {
    this.events.publish('app:logout', '');
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('fbToken')) {
        this.fb.logout()
          .then(res => {
            localStorage.removeItem('fbToken');
            console.log('Saiu com sucessos', res)
          })
          .catch(e => {
            console.log('Error logout from Facebook', e);
          });
      }
      if (localStorage.getItem('gToken')) {
        localStorage.removeItem('gToken');
        this.googlePlus.logout()
          .then(res => {
            console.log(res + ' saiu google');
          })
          .catch(err => { 
            this.googlePlus.trySilentLogin().then(res => {
              console.log(res)
            }).catch(err => console.error(err));
          });
      }
      //localStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      resolve("logout");
    });
  }

  getCards(identification) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.apiUrl + '/Users/GetCartoes?token=' + localStorage.getItem('token') + '&id=' + identification + '&dataFormat=json';

      this.http.post(consulta, null, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  newCard(cardData) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.apiUrl + '/Cartao/AdicionarCartao?token=' + localStorage.getItem('token') + '&idUsuario=' + cardData['billedId'] + '&Numero=' + cardData['cardNumber'] + '&NomeTitular=' + cardData['holder'] + '&DataValidade=' + cardData['valid'] + '-01' + '&TipoCartao=' + cardData['cardType'] + '&dataFormat=json';

      this.http.post(consulta, null, { headers: headers })
        .subscribe(res => {

          resolve(res.json());
        }, (err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  paymentAuthenticate(password: string) {

    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      var consulta = this.apiUrl + '/Users/ValidarSenhaLiberacao?token=' + localStorage.getItem('token') + '&password=' + password + '&dataFormat=json';

      this.http.post(consulta, null, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        })
    })
  }

  doBilling(idCartao, billingValue, password, source?) {

    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (!source)
        source = localStorage.getItem('login');

      var consulta = this.apiUrl + '/Cartao/CobrarComCartao?token=' + localStorage.getItem('token') + '&idCartao=' + idCartao + '&valor=' + billingValue + '&IdUsuarioOrigem=' + source + '&dataFormat=json' + '&senha=' + password;

      this.http.post(consulta, null, { headers: headers })
        .subscribe(res => {

          resolve(res.json());
        }, (err) => {

          reject(err);
        });
    });
  }

  doTransfer(idTo, value, password) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.apiUrl + '/Transactions/Save?token=' + localStorage.getItem('token') + '&idFrom=' + localStorage.getItem('login') + '&idTo=' + idTo + '&idType=3' + '&value=' + value + '&liberationPassword=' + password + '&dataFormat=json';


      this.http.post(consulta, null, { headers: headers })
        .subscribe(res => {

          resolve(res.json());
        }, (err) => {

          reject(err);
        });
    });
  }

  getLatestOperations(number) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.apiUrl + '/Users/LatestOperations?token=' + localStorage.getItem('token') + '&estadoTransacao=1,2,3,7' + '&qtdRegistros=' + number + '&dataFormat=json';


      this.http.post(consulta, null, { headers: headers }).subscribe(res => {

        resolve(res.json());
      }, (err) => {

        reject(err);
      })
    });
  }

  getReceipt(identifier) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.apiUrl + '/Comprovante/GerarComprovante?token=' + localStorage.getItem('token') + '&Identifier=' + identifier + '&desc=pagamentoviaappionic&dataFormat=json';

      this.http.post(consulta, null, { headers: headers })
        .subscribe(res => {

          resolve(res.json());
        }, (err) => {

          let alert = this.alertService.alertCtrl.create({
            title: 'Erro!',
            subTitle: err,
            buttons: ['OK']
          });
          alert.present();
          reject(err);
        });
    });
  }

}
