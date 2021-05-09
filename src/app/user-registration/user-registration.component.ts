import { Component, OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  registerForm = this.formBuilder.group({
    correo: '',
    password: '',
    password2: '',
    nombre: '',
    apellidos: ''
  });

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
  // Process checkout data here
    console.warn('Registration completed', this.registerForm.value);
    this.registerForm.reset();
  }

}
