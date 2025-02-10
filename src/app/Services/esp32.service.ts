import { Injectable, inject } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Esp32Service {
  private database = inject(Database);
  private auth = inject(Auth);

  // Obtener humedad en tiempo real
  getHumedad(userId: string): Observable<number> {
    const humedadRef = ref(this.database, `usuarios/${userId}/Humedad`);
    return objectVal(humedadRef) as Observable<number>;
  }

  // Obtener volumen en tiempo real
  getVolumen(userId: string): Observable<number> {
    const volumenRef = ref(this.database, `usuarios/${userId}/Volumen`);
    return objectVal(volumenRef) as Observable<number>;
  }

  getSensoresConectados(userId: string): Observable<boolean> {
    const SensoresConectadosRef= ref(this.database, `usuarios/${userId}/SensoresConectados`);
    return objectVal(SensoresConectadosRef) as Observable<boolean>;
  }
}