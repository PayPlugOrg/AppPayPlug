import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { AlertServiceProvider } from '../alert-service/alert-service';

/*
  Generated class for the CardProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CardProvider {

  public cards: Array<{}> = new Array;
  public billedId: string = "";

  constructor(
    public http: HttpClient,
    public authProvider: AuthServiceProvider,
    public alertProv: AlertServiceProvider
  ) {
    console.log('Hello CardProvider Provider');
  }

  public getCards(identification): Array<{}> {
    this.cards = new Array;
      this.authProvider.getCards(identification).then((result) => {
        let i: number = 0;

        for(i=0; i < Object.keys(result).length ; i++) {
          
          var card = {
            idCartao: result[i]['Id'],
            idUsuario: result[i]['IdUsuario'],
            tipoCartao: result[i]['TipoCartao'],
            numero: result[i]['Numero'],
            bandeira: result[i]['Bandeira'],
            mediaUrl: ''
          }
          
          if(result[i]['Bandeira'] == 'Visa') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/Visa.png';
          } else if(result[i]['Bandeira'] == 'MasterCard') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/MasterCard.png';
          } else if(result[i]['Bandeira'] == '') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/PayPlug.png';
          } else if(result[i]['Bandeira'] == 'Amex') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/Amex.png';
          } else if(result[i]['Bandeira'] == 'Bitcoin') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/Bitcoin.png';
          }

          this.cards.push(card);
        }
        this.billedId = card.idUsuario;
      }, (err) => {
        console.log("erro: " + err);
        //this.alertProv.showLoader(err);
        this.alertProv.presentToast(err);
      });
      return this.cards;
  }

}
