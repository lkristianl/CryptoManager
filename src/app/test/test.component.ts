import { Component, OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-test',
  template: `
  <div>
    <h1>Registro</h1>

    <form formGroup="registerForm" (ngSubmit)="onSubmit()">

      <div>
        <label for="correo">
          Correo
        </label>
        <input id="correo" type="text" formControlName="correo">
      </div>

      <div>
        <label for="password">
          Contraseña
        </label>
        <input id="password" type="text" formControlName="password">
      </div>

      <div>
        <label for="password2">
          Repetir Contraseña
        </label>
        <input id="password2" type="text" formControlName="password2">
      </div>

      <div>
        <label for="nombre">
          Nombre
        </label>
        <input id="nombre" type="text" formControlName="nombre">
      </div>

      <div>
        <label for="apellidos">
          Apellidos
        </label>
        <input id="apellidos" type="text" formControlName="apellidos">
      </div>

      <button class="button" type="submit">Registrate</button>
    </form>

  </div>
  `,
  styles: [
  ]
})
export class TestComponent implements OnInit {

  registerForm = this.formBuilder.group({
    correo: '',
    password: '',
    password2: '',
    nombre: '',
    apellidos: ''
  });

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
  // Process checkout data here
    console.warn('Registration completed', this.registerForm.value);
    this.registerForm.reset();
  }

}
