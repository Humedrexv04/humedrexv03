import { Component, OnInit, Input } from '@angular/core';
import { PlantService } from '../../../Services/plant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { Plant } from '../../../Models/plant.mode';
import { AuthService } from '../../../Services/auth.service'; // Importar el servicio de autenticación

@Component({
  selector: 'app-plant-detail',
  imports: [IonicModule, NgIf],
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.css']
})
export class PlantDetailComponent implements OnInit {
  @Input() plant!: Plant; // Asegúrate de que esta propiedad esté definida
  userId: string | null = null; // Cambia esto por el ID del usuario actual
  plantId!: string; // ID de la planta a mostrar

  constructor(private plantService: PlantService, private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    if (!this.plant) {
      this.plantId = this.route.snapshot.paramMap.get('id') || ''; // Obtener el ID de la planta de la ruta

      try {
        const currentUser  = await this.authService.getCurrentUser (); // Obtener el usuario actual
        if (currentUser ) {
          this.userId = currentUser .uid; // Asigna el ID del usuario
        } else {
          console.error('No hay usuario autenticado');
          return; // Salir si no hay usuario autenticado
        }
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        return; // Salir si hay un error
      }

      // Solo llama a loadPlantDetails si userId no es null
      if (this.userId) {
        this.loadPlantDetails();
      } else {
        console.error('No se puede cargar los detalles de la planta sin un userId válido');
      }
    }
  }

  loadPlantDetails(): void {
    console.log('Cargando detalles de la planta...');
    console.log('userId:', this.userId);
    console.log('plantId:', this.plantId);
  
    this.plantService.getPlantDetails(this.userId!, this.plantId) // Usa el operador de aserción no nula
      .then(data => {
        this.plant = data; // Asigna los detalles de la planta
        console.log('Detalles de la planta cargados:', this.plant);
      })
      .catch(error => {
        console.error('Error al cargar los detalles de la planta:', error);
        // Aquí puedes mostrar un mensaje al usuario o redirigir a otra página
      });
  }

  // Método para eliminar la planta
  deletePlant(): void {
    if (this.plantId && this.userId) {
      this.plantService.deletePlant(this.userId, this.plantId)
        .then(() => {
          console.log('Planta eliminada con éxito');
          this.router.navigate(['/view/plant-list']); // Redirigir a la lista de plantas
        })
        .catch(error => {
          console.error('Error al eliminar la planta:', error);
          // Aquí puedes mostrar un mensaje al usuario
        });
    }
  }

  // Método para volver a la lista de plantas
  goToPlantList(): void {
    this.router.navigate(['/view/plant-list']); // Redirigir a la lista de plantas
  }
}