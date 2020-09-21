import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public formLogin: FormGroup;

  public mensagens_validacao = {
    email: [
      {tipo: 'required', mensagem: 'O campo "email" é obrigatório.'},
      {tipo: 'email', mensagem: 'Email inválido!'}
    ],
    senha: [
      {tipo: 'required', mensagem: 'O campo "senha" é obrigatório.'},
      {tipo: 'minLenght', mensagem: 'A senha deve ter pelo menos 6 caracteres.'}
    ]
  }

  constructor(private formBuilder: FormBuilder) {
    this.formLogin = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
   }

  ngOnInit() {
  }

  public login (){
    if(this.formLogin.valid){
      console.log('Formulário válido.')
    }else{
      console.log('Formulário inválido.')
    }
  }
}
