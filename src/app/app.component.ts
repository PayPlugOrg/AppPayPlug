import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Component, ViewChild } from '@angular/core';
import { LoadingController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login'
import { FAQPage } from '../pages/list/list';
import { AboutPage } from '../pages/about/about';
import { TransferPage } from '../pages/transfer/transfer';
import { UserPage } from '../pages/user/user';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { RegisterPage } from '../pages/register/register';
import { ActivationPage } from '../pages/activation/activation';
import { Events } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { ExtractPage } from '../pages/extract/extract';
import { BillingIdentificationPage } from '../pages/billing-identification/billing-identification';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  loading: any;
  publicPages: Array<{ title: string, component: any, alert?: any, icon: string }>;
  privatePages: Array<{ title: string, component: any, alert?: any, icon: string }>;
  nome: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private authService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    private alertService: AlertServiceProvider,
    public events: Events,
    public menu: MenuController
  ) {
    this.events.subscribe('app:logout', () => {
      console.log('app:logout');
      this.nome = "";
    });
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.publicPages = [
      { title: 'Entrar', component: LoginPage, icon: 'home' },
      { title: 'Registrar-se', component: RegisterPage, icon: 'person-add' },
      { title: 'Ativar Conta', component: ActivationPage, icon: 'checkbox' },
      { title: 'Recuperar Senha', component: LoginPage, alert: 'password', icon: 'unlock' },
      { title: 'Termos e Condições', component: LoginPage, alert: 'terms', icon: 'document' },
      { title: 'Perguntas Frequentes', component: FAQPage, icon: 'chatbubbles' },
      { title: 'Sobre', component: AboutPage, icon: 'information-circle' },
      { title: 'Limpar Cache', component: LoginPage, alert: 'clear', icon: 'undo' },
      { title: 'Sair', component: LoginPage, alert: 'logout', icon: 'log-out' }
    ];
    this.privatePages = [
      { title: 'Início', component: HomePage, icon: 'home' },
      { title: 'Indicar Usuário', component: RegisterPage, icon: 'person-add' },
      { title: 'Transferência', component: BillingIdentificationPage, icon: 'swap' },
      { title: 'Sobre', component: AboutPage, icon: 'information-circle' },
      { title: 'Recuperar Senha', component: LoginPage, alert: 'password', icon: 'unlock' },
      { title: 'Minhas Informações', component: UserPage, icon: 'contact' },
      { title: 'Extrato', component: ExtractPage, icon: 'checkmark-circle' },
      { title: 'Perguntas Frequentes', component: FAQPage, icon: 'chatbubbles' }
    ];
  }

  public logout() {
    this.alertService.showLoader('Encerrando sessão...');
    this.alertService.enableMenu(true, 'unauthenticated');
    this.alertService.enableMenu(false, 'authenticated');
    this.authService.logout().then(() => {
      this.nav.setRoot(LoginPage);
      this.alertService.loading.dismiss();
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Encerrando sessão...'
    });
    this.loading.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString('#2a365b');
      this.splashScreen.hide();
    });
  }

  ionOpen() {
    if (this.alertService.menuIsEnabled('authenticated')) {
      let username = localStorage.getItem('username');
      if (username)
        this.nome = username.split(' ')[0];
    }
  }

  openPage(page) {


    if (page.alert) {
      if (page.alert == 'password') {
        
        let alert = this.alertService.alertCtrl.create({
          title: 'Recuperar Senha',
          message: 'Deseja recuperar sua senha de liberação? Informe seu e-mail cadastrado para continuar.',
          inputs: [
            {
              name: 'email',
              placeholder: 'E-mail'
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancelar',
              handler: data => {
                console.log('Reset cancelado');
              }
            },
            {
              text: 'Recuperar',
              handler: data => {
                this.authService.passwordReset(data).then((result) => {
                  let alert2 = this.alertService.alertCtrl.create({
                    title: 'E-mail enviado!',
                    subTitle: 'Uma nova senha foi gerada automaticamente e enviada para ' + data.email + '.',
                    buttons: ['Ok']
                  });
                  if (result['Success']) {
                    alert2.present();
                  } else {
                    alert2.setTitle('Falha na recuperação!');
                    alert2.setSubTitle("Entre em contato com o suporte para mais informações. Abra a tela 'Sobre' para ter acesso aos contatos.");
                    alert2.present();
                  }
                }, (err) => {
                  console.error(err);
                });
              }
            }
          ]
        });
        alert.present();
      } else if (page.alert == 'logout') {
        let alert = this.alertService.alertCtrl.create({
          title: 'Sair',
          message: "Deseja encerrar o aplicativo? Clicando em 'Sair e Apagar' o aplicativo será encerrado e os dados do aplicativo no celular serão apagadas. Clicando em 'Apenas sair', o aplicativo será encerrado e seus dados pemanecerão.",
          buttons: [
            {
              text: 'Sair e Apagar',
              role: 'cancel',
              handler: () => {
                localStorage.clear();
                this.platform.exitApp();
              }
            },
            {
              text: 'Apenas sair',
              handler: () => {
                this.platform.exitApp();
              }
            }
          ]
        });
        alert.present();
      } else if (page.alert == 'clear') {
        let alert = this.alertService.alertCtrl.create({
          title: 'Limpar Cache',
          message: 'Deseja apagar os dados do aplicativo no celular? Ao confirmar, o aplicativo será reinicializado.',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancelar',
              handler: () => {
                console.log('Limpeza cancelada');
              }
            },
            {
              text: 'Apagar',
              handler: () => {
                localStorage.clear();
              }
            }
          ]
        });
        alert.present();
      } else if (page.alert == 'terms') {
        let alert = this.alertService.alertCtrl.create({
          title: 'Termos e Condições',
          subTitle: 'Ao usar o aplicativo...',
          buttons: ['Fechar']
        });
        alert.present();
      }

    } else if(page.title ==  'Transferência') {
      let params = {
        operation: 'Transferência'
      };
      this.nav.push(page.component, params);
    } else if (page.title == 'Entrar') {
      this.nav.setRoot(page.component);
    } else if (page.title == 'Início') {
      this.nav.setRoot(page.component);
    } else if(page.title == 'Indicar Usuário') {
      let params = {
        title: page.title,
      };
      this.nav.push(page.component, params);
    } else {
      this.nav.push(page.component);
    }
  }
}
