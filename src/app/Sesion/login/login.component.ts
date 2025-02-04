import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports:[IonicModule, FormsModule]
})
export class LoginComponent implements OnInit {
  route = inject(Router);
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Aquí puedes inicializar cualquier dato si es necesario
  }

  // Método para iniciar sesión
  login() {
    this.authService.login(this.email, this.password)
      .then(user => {
        this.route.navigate(['/view/home']);
        console.log('Usuario logueado:', user);
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
      });
  }

  // Método para iniciar sesión con Google
  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(user => {
        this.route.navigate(['/view/home']);
        console.log('Usuario logueado con Google:', user);
      })
      .catch(error => {
        console.error('Error al iniciar sesión con Google:', error);
      });
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout()
      .then(() => {
        console.log('Usuario cerrado sesión');
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}

