import { Component } from '@angular/core';
import { PlantService } from '../../Services/plant.service';
import { AuthService } from '../../Services/auth.service';
import { Plant } from '../../Models/plant.mode';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { thermometer } from 'ionicons/icons';

@Component({
  selector: 'app-add',
  imports: [FormsModule, IonicModule,NgIf],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  img: string = '';
  name: string = '';
  horario: number = 0;
  humedad: number = 0;

  constructor(private plantService: PlantService, private authService: AuthService) {
    addIcons({
      thermometer
    });
  }

  ngOnInit() {
    // Aquí puedes inicializar cualquier dato si es necesario
  }

  addPlant() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        const newPlant: Plant = { img: this.img, name: this.name, horario: this.horario, humedad: this.humedad };
        this.plantService.addPlant(user.uid, newPlant)
          .then(() => {
            console.log('Planta agregada exitosamente');
            this.resetForm();
          })
          .catch(error => {
            console.error('Error al agregar la planta:', error);
          });
      }
    }).catch(error => {
      console.error('Error al obtener el usuario actual:', error);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.img = e.target.result; // Asigna la imagen a la variable img
      };
      reader.readAsDataURL(file); // Lee el archivo como Data URL
    }
  }

  resetForm() {
    this.img = '';
    this.name = '';
    this.horario = 0;
    this.humedad = 0;
  }
}
