import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ReceiptPage } from '../receipt/receipt';

/**
 * Generated class for the ExtractPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-extract',
  templateUrl: 'extract.html',
})
export class ExtractPage {

  operations: {} = new Array;
  numberOperations: number = 10;
  operationType: string = "finalized";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public alertProvider: AlertServiceProvider,
    public modalCtrl: ModalController
  ) {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ExtractPage');
    this.getOperations();
  }

  getOperations() {
    this.authService.getLatestOperations(this.numberOperations).then((result) => {
      console.log(result);
      this.operations = result;
      console.log(this.operations[0]['IdFrom']);
    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExtractPage');
  }

  openDetail(operation) {
    let alert = this.alertProvider.alertCtrl.create({
      title: 'Datalhes',
      message: `
          <h6>Data: ` + operation.TransactionDate + `</h6>
          <h6>Operação: ` + operation.Operation + `</h6>
          <h6>Usuário: ` + operation.IdTo + `</h6>
          <h6>Valor: ` + operation.Value + `</h6>
          <h6>Situação: ` + operation.Status + `</h6>
          <h6>Identificador: ` + operation.Identifier + `</h6>
          `,
      buttons: [
        {
          text: 'Fechar',
          handler: () => {
            console.log('Fechar clicked');
          }
        },
        {
          text: 'Comprovante',
          handler: () => {
            let receiptModal = this.modalCtrl.create(ReceiptPage, {identifier:operation.Identifier}); 
            receiptModal.present();
            console.log('Comprovante clicked');
          }
        }
      ]
    });
    alert.present();
  }

}
