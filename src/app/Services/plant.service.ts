import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, getDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Plant } from '../Models/plant.mode';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private _firestore = inject(Firestore);

  constructor() { }

  // Cargar plantas del usuario como un Observable
  loadPlants(userId: string): Observable<Plant[]> {
    const plantsCollection = collection(this._firestore, `users/${userId}/plants`);
    return collectionData(plantsCollection, { idField: 'id' }) as Observable<Plant[]>; // Agregar el id al objeto
  }

  // Agregar una nueva planta
  addPlant(userId: string, plant: Plant): Promise<void> {
    const plantsCollection = collection(this._firestore, `users/${userId}/plants`);
    return addDoc(plantsCollection, plant)
      .then(() => console.log('Planta agregada:', plant))
      .catch(error => {
        console.error('Error al agregar la planta:', error);
        throw error; // Propagar el error para manejarlo en el componente
      });
  }

  // Actualizar una planta
  updatePlant(userId: string, plantId: string, updatedPlant: Plant): Promise<void> {
    const plantDoc = doc(this._firestore, `users/${userId}/plants/${plantId}`);
    const { img, name, horario, humedad } = updatedPlant; // Extraer los campos necesarios
    return updateDoc(plantDoc, { img, name, horario, humedad }) // Solo pasar los campos necesarios
      .then(() => console.log('Planta actualizada:', updatedPlant))
      .catch(error => {
        console.error('Error al actualizar la planta:', error);
        throw error; // Propagar el error para manejarlo en el componente
      });
  }

  // Eliminar una planta
  deletePlant(userId: string, plantId: string): Promise<void> {
    const plantDoc = doc(this._firestore, `users/${userId}/plants/${plantId}`);
    return deleteDoc(plantDoc)
      .then(() => console.log('Planta eliminada:', plantId))
      .catch(error => {
        console.error('Error al eliminar la planta:', error);
        throw error; // Propagar el error para manejarlo en el componente
      });
  }

  // Obtener detalles de una planta específica
  getPlantDetails(userId: string, plantId: string): Promise<Plant> {
    const plantDoc = doc(this._firestore, `users/${userId}/plants/${plantId}`);
    return getDoc(plantDoc)
      .then(docSnapshot => {
        if (docSnapshot.exists()) {
          const plantData = docSnapshot.data() as Plant; // Asegúrate de que la estructura coincida con tu modelo
          return { id: docSnapshot.id, ...plantData }; // Retornar el id junto con los datos de la planta
        } else {
          throw new Error('Planta no encontrada');
        }
      })
      .catch(error => {
        console.error('Error al obtener los detalles de la planta:', error);
        throw error; // Propagar el error para manejarlo en el componente
      });
  }

  // Función para contar plantas del usuario
  countUserPlants(userId: string): Promise<number> {
    const plantsCollection = collection(this._firestore, `users/${userId}/plants`);
    return getDocs(plantsCollection)
      .then(querySnapshot => {
        const count = querySnapshot.size;
        console.log(`Total de plantas: ${count}`);
        return count;
      })
      .catch(error => {
        console.error('Error al contar plantas:', error);
        throw error;
      });
  }

  getPlantsObservable(userId: string): Observable<Plant[]> {
    const plantsCollection = collection(this._firestore, `users/${userId}/plants`);
    return collectionData(plantsCollection, { idField: 'id' }) as Observable<Plant[]>;
  }
}