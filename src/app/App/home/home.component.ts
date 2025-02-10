import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { sunny } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  imports: [IonicModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  route = inject(Router);
  isDarkTheme = false;
  constructor(private authService: AuthService) { 
    addIcons({
      sunny
    });
  }



  ngOnInit() {
    // Aquí puedes realizar cualquier inicialización necesaria
    console.log('Componente Home inicializado');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    } else {
      document.body.classList.toggle('dark-theme', prefersDark);
    }
  }


  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
