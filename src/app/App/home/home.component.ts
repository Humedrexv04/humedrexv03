import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [IonicModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  route = inject(Router);
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Aquí puedes realizar cualquier inicialización necesaria
    console.log('Componente Home inicializado');
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.route.navigate(['/login']);
        console.log('Cierre de sesión exitoso');
        // Aquí puedes redirigir al usuario a la página de inicio de sesión o a otra página
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}
