import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { CifrardescifrarService } from '../_services/cifrardescifrar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: '',
    firstName: null,
    lastName: null,
    binancePublic: null,
    binanceSecret: null,
    krakenPublic: null,
    krakenSecret: null
  };
  msgNombreUsuarioLongitud:string = 'El nombre de un usuario tiene que tener entre 3 y 20 caracteres';
  msgEmailUsuario:string = 'El correo NO es válido';
  msgContrasenaUsuarioLongitud:string = 'La contraseña tiene que tener entre 6 o más caracteres';
  msgNombreLongitud:string = 'El nombre NO puede contener más que 25 caracteres';
  msgClaveAPIError:string = 'Clave API NO válida';
  msgCampoObligatorio:string = 'Campo obligatorio';
  msgContrasenasDistintas:string = 'La contraseña NO coincide con la primera';
  msgContrasenasIguales:string = 'Las contraseñas coinciden correctamente';

  isSuccessful:boolean = false;
  isSignUpFailed:boolean = false;
  errorMessage:string = '';

  constructor(private authService: AuthService, private cifrarDescifrarService: CifrardescifrarService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const username = this.form.username;
    const email = this.form.email;
    const password = this.form.password;
    const firstName = this.form.firstName;
    const lastName = this.form.lastName;
    const binancePublic = this.cifrarDescifrarService.encryptUsingAES256(this.form.binancePublic).toString();
    const binanceSecret = this.cifrarDescifrarService.encryptUsingAES256(this.form.binanceSecret).toString();
    const krakenPublic = this.cifrarDescifrarService.encryptUsingAES256(this.form.krakenPublic).toString();
    const krakenSecret = this.cifrarDescifrarService.encryptUsingAES256(this.form.krakenSecret).toString();

    this.authService.register(username, email, password, firstName, lastName, binancePublic, binanceSecret, krakenPublic, krakenSecret).subscribe(
      data => {
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
