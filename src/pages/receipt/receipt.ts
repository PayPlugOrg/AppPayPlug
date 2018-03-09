import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { HomePage } from '../home/home';
import { SocialSharing } from '@ionic-native/social-sharing';
import domtoimage from 'dom-to-image';
import fileSaver from 'file-saver';
import { File } from '@ionic-native/file';


/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.html',
})
export class ReceiptPage {

  private identifier: any;
  createdCode = null;
  receipt = {
    Authentication: '',
    ClientCard: '',
    ClientCardFlag: '',
    ClientCardType: '',
    ClientName: '',
    CurrencyValueReal: '',
    CurrencyValueUser: '',
    Description: '',
    Situation: '',
    Store: '',
    SymbolCurrencyReal: '',
    SymbolCurrencyUser: '',
    TransactionDate: ''
  }

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public alertProvider: AlertServiceProvider,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private file: File
  ) {
    this.identifier = navParams.get('identifier');
  }

  ionViewWillEnter() {
    this.authService.getReceipt(this.identifier).then((result) => {
      if (result['Success'] == false) {
        let alert = '';
      } else {
        for (let o in result) {
          this.receipt[o] = result[o];
        }
        this.createQR(result['Authentication']);
      }
      this.alertProvider.loading.dismiss();
    }, (err) => {
      this.alertProvider.presentToast(err);
    });
  }

  createQR(numeroCartao: String) {
    this.createdCode = numeroCartao;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  savebase64AsImageFile(folderpath, filename, content, contentType) {
    // Convert the base64 string in a Blob
    var DataBlob = this.b64toBlob(content, contentType);

    console.log("Starting to write the file :3");

    cordova.plugins.file.resolveLocalFileSystemURL(folderpath, function (dir) {
      console.log("Access to the directory granted succesfully");
      dir.getFile(filename, { create: true }, function (file) {
        console.log("File created succesfully.");
        file.createWriter(function (fileWriter) {
          console.log("Writing content to file");
          fileWriter.write(DataBlob);
        }, function () {
          alert('Unable to save file in path ' + folderpath);
        });
      });
    });
  }

  send(share) {

    if (share == 'sms') {
      console.log(share);
      this.socialSharing.share(`Transacao PayPlug \n Autenticacao: ` +
        this.receipt.Authentication + `\nUsuario: `
        + this.receipt.ClientName + `\nValor: `
        + this.receipt.CurrencyValueUser + `\nData: `
        + this.receipt.TransactionDate
      );
      //this.socialSharing.shareViaSMS("PAYPLUG Test", "");


    } else if (share == 'wpp') {
      console.log(share);
      this.socialSharing.canShareVia('com.whatsapp').then((res) => {
        console.log(res);
        this.socialSharing.shareViaWhatsApp("PAYPLUG Test");
      }).catch((err) => {

        console.error(err);
      });
    } else if (share == 'mail') {
      console.log(share);
      this.socialSharing.canShareViaEmail().then(() => {
        // Sharing via email is possible
        this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
          // Success!
        }).catch((err) => {
          // Error!
          console.error(err);
        });
      }).catch(() => {
        // Sharing via email is not possible
      });
    } else if (share == 'face') {
      // console.log(share);
      // this.socialSharing.canShareVia('com.facebook.facebook').then((res) => {
      //   console.log(res);
      //   this.socialSharing.shareViaFacebook("PAYPLUG Test");
      // }).catch((err) => {
      //   console.error(err);

      // });

      var node = document.getElementById('my-node');
      var img = new Image();
      domtoimage.toJpeg(node, { quality: 0.95 })
        .then(dataUrl => {
          console.log(dataUrl);

          /** Process the type1 base64 string **/
          var myBaseString = dataUrl;

          // Split the base64 string in data and contentType
          var block = myBaseString.split(";");
          // Get the content type
          var dataType = block[0].split(":")[1];// In this case "image/png"
          // get the real base64 content of the file
          var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

          // The path where the file will be created
          var folderpath = "file:///storage/emulated/0/";
          // The name of your file, note that you need to know if is .png,.jpeg etc
          var filename = "myimage.png";

          this.savebase64AsImageFile(folderpath, filename, realData, dataType);

          var link = document.createElement('a');
          link.download = 'my-image-name.jpeg';
          link.href = dataUrl;
          link.click();
        });


    }
  }

  b64toBlob(b64Data, contentType, sliceSize = 512) {
    contentType = contentType || '';

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }



}
