import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertServiceProvider } from '../alert-service/alert-service';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let apiUrl = 'http://aplweb.tsemredes.com.br:83/v1';

@Injectable()
export class AuthServiceProvider {
  
  token: string = '';

  user = {nome:'', nascimento:'', email:'', celular:'', indicacao:'', documento:'', tipo_documento:'CPF'}
  userInfo: any;
  
  constructor(
    public http: Http,
    public alertService: AlertServiceProvider
  ) {
    console.log('Hello AuthServiceProvider Provider');
  }

  login(user) {
    this.user = user;
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(user['nome']);
        console.log(user['senha']);
        this.http.post(apiUrl+'/Tokens/New?email=' + user['nome'] + '&dataFormat=json&password=' + user['senha'], null, {headers: headers})
          .subscribe(res => {
            console.log(res.json());
            if(res.json()) {
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

      //Requisição do Token de sessão para inserção do usuário
      this.http.post(apiUrl + '/Tokens/New?email=camaradecomercio@payplug.com.br&dataFormat=json&password=1234&duration=5', null, {headers: headers})
      .subscribe(res => {
        if(res.json().Success) {
          this.token = res.json().Token;
        } else {
          reject(res);
        }
      },(err) => {
        reject(err);
      });
    });
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      var consulta = apiUrl + '/Users/Info?token=' + localStorage.getItem('token') + '&id=' + localStorage.getItem('identifier') + '&dataFormat=json';
      this.http.post(consulta, null, {headers:headers})
      .subscribe(res => { 
        if(this.tokenExpired(res.json()['Message'])) {
          this.alertService.presentToast('Sua sessão expirou');
          console.log(res.json()['Message']);
        } else {
          this.userInfo = res.json();
          resolve(res.json());
        }
      },(err) => {
        console.error(err);
        reject(err);
      });
    });
  }

  private tokenExpired(message): boolean {
    if(message == 'Authentication failed.') {
      this.logout();
      return true;
    }
    return false;
  }

  register(user, operacao) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = apiUrl + '/Users/Save?token=' + this.token + '&fullName=' + user['nome'] + '&cpfCnpj=' + user['documento'] + '&EmpresaCnpj=' + '&cellphone=' + user['celular'] + '&email=' + user['email'] + '&coin=1&dataNascimento=' + user['nascimento'] + '&cpfCnpjIndicacao=' + '&dataFormat=json';
      if(operacao == 'ativacao') {
        consulta = apiUrl + '/Users/AtivarUsuario?token=' + this.token + '&identifier=' + user['documento'] + '&codigo=' + user['codigo'] + '&senha=' + user['senha'] + '&dataFormat=json';
      }
      console.log(consulta);

      //Requisição de inserção do novo usuário
      this.http.post(consulta, null, {headers:headers})
        .subscribe(res => {
          console.log(res.json());
          if(res.json().Id && res.json().Codigo && operacao == 'criacao') {
            resolve("Usuário criado com sucesso!");
          } else if(res.json().Success == false && operacao == 'criacao') {
            reject("Alguma informação já está cadastrada na base de dados. " + res.json().Message);
          } else if(res.json().Codigo == null && operacao == 'criacao') {
            reject("Usuário já cadastrado. Verifique suas informações!");
          } else if(res.json().Success && operacao == 'ativacao') {
            resolve(res.json().Message);
          } else {
            reject(res.json().Message)
          }
        },(err) => {
          reject(err);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      localStorage.clear();
      resolve("logout");
    });
  }
  
}
