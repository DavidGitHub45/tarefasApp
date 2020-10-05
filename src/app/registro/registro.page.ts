import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';
import { UsuariosService } from '../services/usuarios.service';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

  mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem:'O campo "Nome" é obrigatório.' },
      { tipo: 'minLength', mensagem:'O campo deve ter pelo menos 3 caracteres.' }
    ],
    cpf: [
      { tipo: 'required', mensagem:'O campo "Nome" é obrigatório.' },
      { tipo: 'minLength', mensagem:'O campo deve ter pelo menos 11 caracteres.' },
      { tipo: 'maxLength', mensagem:'O campo deve ter no máximo 14 caracteres.' },
      { tipo: 'invalido', mensagem: 'CPF inválido!'}
    ],
    dataNascimento: [
      { tipo: 'required', mensagem:'O campo "Data de Nascimento" é obrigatório.' }
    ],
    genero: [
      { tipo: 'required', mensagem:'Escolha um gênero.' }
    ],
    celular: [
      { tipo: 'minLength', mensagem:'O campo deve ter pelo menos 10 caracteres.' },
      { tipo: 'maxLength', mensagem:'O campo deve ter pelo menos 16 caracteres.' }
    ],
    email: [
      { tipo: 'required', mensagem:'O campo "E-mail" é obrigatório.' },
      { tipo: 'email', mensagem:'E-mail inválido.' }
    ],
    senha: [
      { tipo: 'required', mensagem:'O campo "Senha" é obrigatório.' },
      { tipo: 'minLength', mensagem:'A senha deve ter pelo menos 6 caracteres.' }
    ],
    confirmaSenha: [
      { tipo: 'required', mensagem:'A confirmação de senha é obrigatória.' },
      { tipo: 'minLength', mensagem:'O campo deve ter pelo menos 3 caracteres.' },
      { tipo: 'comparacao', mensagem: 'A senha deve ser igual à do campo "senha".'}
    ]
  }

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router
    ) {

    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(3)
      ])],
      cpf: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(11), 
        Validators.maxLength(14),
        CpfValidator.cpfValido
      ])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(16)
      ])],
      email: ['', Validators.compose([
        Validators.required, 
        Validators.email])],
      senha: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(6)
      ])],
      confirmaSenha: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(6)
      ])]
    }, {
      validator: ComparacaoValidator('senha', 'confirmaSenha')
    })

  }

  async ngOnInit() {
    await this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listaUsuarios)
  }

  public async salvarFormulario(){
    if(this.formRegistro.valid){
      let usuario = new Usuario();
      usuario.nome = this.formRegistro.value.nome;
      usuario.cpf = this.formRegistro.value.cpf;
      usuario.dataNascimento = new Date(this.formRegistro.value.dataNascimento);
      usuario.genero = this.formRegistro.value.genero;
      usuario.celular = this.formRegistro.value.celular;
      usuario.email = this.formRegistro.value.email;
      usuario.senha = this.formRegistro.value.senha;

      if(this.usuariosService.salvar(usuario)){
        this.exibirAlerta('SUCESSO!', 'Usuário salvo com sucesso!');
        this.router.navigateByUrl('/login');
      }else{
        this.exibirAlerta('ERRO!', 'Erro ao salvar o usuário!');
      }
    }else{
      this.exibirAlerta('ADVERTÊNCIA!', 'Formulário inválido<br/>Verifique os campos do seu formulário!');
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
  }

  
}
