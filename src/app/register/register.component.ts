import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    acceptTerms: null,//Add
    binanceSecret: null,
    krakenSecret: null
  };
  msgNombreUsuarioLongitud:string = 'El nombre de un usuario tiene que tener entre 3 y 20 caracteres';
  msgEmailUsuario:string = 'El correo NO es válido';
  msgContrasenaUsuarioLongitud:string = 'La contraseña tiene que tener entre 6 o más caracteres';
  msgNombreLongitud:string = 'El nombre NO puede contener más que 25 caracteres';

  msgCampoObligatorio:string = 'Campo obligatorio';
  
  isSuccessful:boolean = false;
  isSignUpFailed:boolean = false;
  errorMessage:string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, email, password, firstName, lastName, acceptTerms, binanceSecret, krakenSecret } = this.form;

    this.authService.register(username, email, password, firstName, lastName, binanceSecret, krakenSecret).subscribe(//Añadir acceptTerms tocar _services
      data => {
        console.log(data);//borrar este console.log
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
