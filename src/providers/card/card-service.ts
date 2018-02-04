import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { AlertServiceProvider } from '../alert-service/alert-service';

/*
  Generated class for the CardProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CardServiceProvider {

  public cards: Array<{}> = new Array;
  public billedId: string = "";

  constructor(
    public http: Http,
    public authProvider: AuthServiceProvider,
    public alertProv: AlertServiceProvider
  ) {
  }

  getCards(identification) {
    this.cards = [];
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.authProvider.apiUrl + '/Users/GetCartoes?token=' + localStorage.getItem('token') + '&id=' + identification + '&dataFormat=json';
      //console.log(consulta);
      this.http.post(consulta, null, {headers:headers})
        .subscribe(res => {
          var result = res.json();
          let i: number = 0;

          for(i=0; i < Object.keys(result).length ; i++) {
            
            var card = {
              idCartao: result[i]['Id'],
              idUsuario: result[i]['IdUsuario'],
              tipoCartao: result[i]['TipoCartao'],
              nomeTitular: result[i]['NomeTitular'],
              dataValidade: result[i]['DataValidade'],
              numero: result[i]['Numero'],
              bandeira: result[i]['Bandeira'],
              mediaUrl: ''
            }

            console.log(result[i]);

            if(card.tipoCartao == 'Debito') {
              card.tipoCartao = card.tipoCartao.replace('e','é');
              //console.log("true: " + card.tipoCartao);
            } else if(result[i]['TipoCartao'] == 'Credito') {
              card.tipoCartao = card.tipoCartao.replace('e','é');
              //console.log("true: " + card.tipoCartao);
            }
            
            if(result[i]['Bandeira'] == 'Visa') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/Visa.png';
            } else if(result[i]['Bandeira'] == 'MasterCard') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/MasterCard.png';
            } else if(result[i]['Bandeira'] == '') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/PayPlug.png';
              card.bandeira = 'PayPlug';
            } else if(result[i]['Bandeira'] == 'Amex') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/Amex.png';
            } else if(result[i]['Bandeira'] == 'Bitcoin') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/Bitcoin.png';
            } else if(result[i]['Bandeira'] == 'Diners') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/Diners.png';
            } else if(result[i]['Bandeira'] == 'Discover') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/Discover.png';
            } else if(result[i]['Bandeira'] == 'Elo') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/Elo.png';
            } else if(result[i]['Bandeira'] == 'JCB') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/JCB.png';
            } else if(result[i]['Bandeira'] == 'PayPal') {
              card.mediaUrl = 'assets/imgs/posweb/icon_cards/PayPal.png';
            }

            this.cards.push(card);
          }
          resolve(this.cards);
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteCard(card: any) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var consulta = this.authProvider.apiUrl + '/Cartao/RemoverCartao?token=' + localStorage.getItem('token') + '&IdCartao=' + card + '&DataFormat=json';
      console.log(consulta);
      
      this.http.post(consulta, null, {headers:headers})
        .subscribe(result => {
          console.log(result.json());
          resolve(result.json());
        },(err) =>{
          console.error('[delete cartao] ' + err);
          reject(err);
        });
    });
  }

}
