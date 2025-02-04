import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonicModule, FormsModule]
})
export class RegisterComponent implements OnInit {
  router = inject(Router);
  email: string = '';
  password: string = '';
  name: string = ''; // Agregar un campo para el nombre del usuario

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Aquí puedes inicializar cualquier dato si es necesario
    console.log('Componente de registro inicializado');
  }

  // Método para registrar un nuevo usuario
  signup() {
    this.authService.signup(this.email, this.password, this.name) // Pasar el nombre al método signup
      .then(() => {
        this.router.navigate(['/login']);
        console.log('Usuario registrado:', this.email);
      })
      .catch(error => {
        console.error('Error al registrar:', error);
      });
  }
}