import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class FAQPage {
  
  diseases = [
    { title: "Efetuando uma Venda", 
    description: "- Informe o valor;  - Selecione a forma de captura; - Caso do cartão: efetue a leitura do cartão do usuário;  - Solicite ao usuário que informe a senha de liberação;  - Caso informar conta manualmente: solicite ao usuário que informe os dados para processar operação;  - Solicite ao usuário que informe a senha de liberação - Aguarde a emissão do comprovante;" },
    
    { title: "Para cancelar um operação", 
    description: "1 - Em Extrato, selecione a venda que deseja cancelar; 3 - Informe a senha de lideração do terminal (6 dígitos numéricos). 3 - Informe o motivo do cancelamento (opcional);" },

    { title: "Venda por SMS", 
    description: "1 - Efetue o processo de venda informando a conta do usuário; 2 - Escolha a opção SMS; 3 - Será enviado um SMS para o cliente, esse processo pode demorar pois depende de disponibilidade da operadora de celular; !A transação só será concluída após a aprovação pelo usuário; !O comprovante ficará com status de aguardando o pagamento até a operação ser liberada;" },
    
    { title: "Alterar senha de acesso", 
    description: "Para alterar acesse www.payplug.org em informação de conta 'Alterar senha de Acesso'; Ou entre em contato com nosso suporte; Alterar senha de liberação: Para alterar a senha acesse www.payplug.org em informação de conta 'Alterar senha de Liberação'; Ou entre em contato com nosso suporte; " },

    { title: "Extrato", 
    description: "São listadas as últimas opeações em sua conta, para um extrato detalhado acesse  www.payplug.org/extrato" }
  ];
  shownGroup = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }
}
