import { Component, OnInit } from '@angular/core';
import { PlantService } from '../../../Services/plant.service';
import { AuthService } from '../../../Services/auth.service';
import { Plant } from '../../../Models/plant.mode';
import { IonicModule } from '@ionic/angular';
import { PlantaItemComponent } from '../../../Components/planta-item/planta-item.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-plant-list',
  imports: [IonicModule, PlantaItemComponent, NgFor],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.css']
})
export class PlantListComponent implements OnInit {
  plants: Plant[] = [];
  selectedPlant: Plant | null = null; // Planta seleccionada para mostrar detalles
  isHidden = false; // Controla la visibilidad del modal

  constructor(private plantService: PlantService, private authService: AuthService) {}

  ngOnInit() {
    this.loadPlants();
  }

  loadPlants() {
    this.authService.getCurrentUser ()
      .then(user => {
        if (user) {
          this.plantService.loadPlants(user.uid).subscribe(plants => {
            this.plants = plants; // Actualiza la lista de plantas en tiempo real
          });
        } else {
          console.error('No hay usuario autenticado');
        }
      })
      .catch(error => {
        console.error('Error al cargar las plantas:', error);
      });
  }

  deletePlant(plantId: string) {
    this.authService.getCurrentUser ()
      .then(user => {
        if (user) {
          return this.plantService.deletePlant(user.uid, plantId);
        } else {
          console.error('No hay usuario autenticado');
          return Promise.resolve(); // Retorna una promesa resuelta si no hay usuario
        }
      })
      .then(() => {
        this.plants = this.plants.filter(plant => plant.id !== plantId);
        console.log('Planta eliminada:', plantId);
      })
      .catch(error => {
        console.error('Error al eliminar la planta:', error);
      });
  }
}