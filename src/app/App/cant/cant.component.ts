import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Esp32Service } from '../../Services/esp32.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { refreshOutline, warningOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cant',
  templateUrl: './cant.component.html',
  styleUrls: ['./cant.component.css'],
  imports: [IonicModule, NgIf, CommonModule]
})
export class CantComponent implements OnInit, OnDestroy {
  humedad: number | null = null;
  volumen: number | null = null;
  userId: string | null = null;
  loading: boolean = true;
  scaleMarks = [0, 20, 40, 60, 80, 100];
  isConnected: boolean = true;
  lastUpdate: Date = new Date();
  sensorConnected: boolean = true; // Inicialmente asumimos que los sensores están conectados
  private subs: Subscription[] = [];
  private updateInterval!: any;

  constructor(
    private esp32Service: Esp32Service,
    private auth: Auth
  ) { 
    addIcons({
      warningOutline,
      refreshOutline
    });
  }

  ngOnInit() {
    this.initAuthState();
    this.startDataRefresh();
    this.checkConnection();
  }

  private initAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadSensorData();
      } else {
        this.handleUnauthenticated();
      }
    });
  }

  private handleUnauthenticated() {
    console.error('Usuario no autenticado');
    this.loading = false;
    this.humedad = null;
    this.volumen = null;
  }

  private loadSensorData() {
    if (!this.userId) return;

    this.subs.push(
      this.esp32Service.getHumedad(this.userId).subscribe({
        next: (valor) => this.handleHumedadData(valor),
        error: (err) => this.handleHumedadError(err)
      }),

      this.esp32Service.getVolumen(this.userId).subscribe({
        next: (valor) => this.handleVolumenData(valor),
        error: (err) => this.handleVolumenError(err)
      }),

      this.esp32Service.getSensoresConectados(this.userId).subscribe({
        next: (conectados) => {
          this.sensorConnected = conectados;
          this.loading = false; // Detener carga después de verificar conexión
        },
        error: (err) => {
          console.error('Error al obtener estado de sensores:', err);
          this.sensorConnected = false; // Asumimos que no están conectados si hay un error
          this.loading = false; // Detener carga en caso de error
        }
      })
    );
  }

  private handleHumedadData(valor: number) {
    if (valor === null || valor < 0 || valor > 100) {
      this.sensorConnected = false; // Sensor de humedad no conectado
      this.humedad = null;
    } else {
      this.humedad = Math.min(Math.max(valor, 0), 100);
    }
    this.checkLoadingStatus();
  }

  private convertToPercentage(volume: number): number {
    const MAX_VOLUME = 3300; // Nuevo máximo
    const percentage = ((MAX_VOLUME - volume) / MAX_VOLUME) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }

  private handleVolumenData(valor: number) {
    if (valor === null || valor < 0 || valor > 3300) {
      this.sensorConnected = false; // Sensor de volumen no conectado
      this.volumen = null;
    } else {
      const clampedValue = Math.min(Math.max(valor, 0), 3300);
      this.volumen = this.convertToPercentage(clampedValue);
    }
    this.checkLoadingStatus();
  }

  private checkLoadingStatus() {
    if (this.humedad !== null && this.volumen !== null) {
      this.loading = false;
    }
  }

  getWaterFace(volume: number | null): string {
    if (volume === null) return '🌫️'; // Valor nulo
    if (volume <= 20) return '😰';    // 0-20%: Crítico
    if (volume <= 40) return '😟';    // 21-40%: Bajo
    if (volume <= 60) return '😐';    // 41-60%: Medio
    if (volume <= 80) return '🙂';    // 61-80%: Bueno
    return '😎';                      // 81-100%: Óptimo
  }

  getWaterColor(volume: number | null): string {
    if (!volume) return 'gray';       // Valor nulo
    if (volume <= 20) return 'red';   // 0-20%: Peligro
    if (volume <= 40) return 'orange';// 21-40%: Advertencia
    if (volume <= 60) return 'yellow';// 41-60%: Precaución
    if (volume <= 80) return 'lightgreen';// 61-80%: Bueno
    return 'green';                   // 81-100%: Óptimo
  }

  private startDataRefresh() {
    this.updateInterval = setInterval(() => {
      if (this.userId) {
        this.loadSensorData();
        this.lastUpdate = new Date();
      }
    }, 30000); // Actualiza cada 30 segundos
  }

  private checkConnection() {
    this.isConnected = navigator.onLine;
    if (!this.isConnected) {
      this.showConnectionAlert();
    }
  }

  private showConnectionAlert() {
    console.warn('Conexión perdida');
  }

  private handleHumedadError(err: any) {
    console.error('Error en humedad:', err);
    this.isConnected = false;
    this.humedad = null;
    this.loading = false; // Detener carga en caso de error
    this.checkLoadingStatus();
  }

  private handleVolumenError(err: any) {
    console.error('Error en volumen:', err);
    this.isConnected = false;
    this.volumen = null;
    this.loading = false; // Detener carga en caso de error
    this.checkLoadingStatus();
  }

  // Método para verificar manualmente los sensores
  checkSensors() {
    this.loading = true; // Mostrar estado de carga
    this.sensorConnected = false; // Reiniciar estado de conexión
    this.humedad = null; // Reiniciar valores
    this.volumen = null;

    if (this.userId) {
      this.subs.push(
        this.esp32Service.getSensoresConectados(this.userId).subscribe({
          next: (conectados) => {
            this.sensorConnected = conectados;
            this.loadSensorData(); // Volver a cargar los datos de los sensores
          },
          error: (err) => {
            console.error('Error al verificar sensores:', err);
            this.sensorConnected = false;
            this.loading = false; // Detener carga en caso de error
          }
        })
      );
    } else {
      console.error('Usuario no autenticado');
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    clearInterval(this.updateInterval);
  }
}