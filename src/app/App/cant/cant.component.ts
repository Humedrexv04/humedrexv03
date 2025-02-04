import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Esp32Service } from '../../Services/esp32.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';

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
  private subs: Subscription[] = [];
  private updateInterval!: any;

  constructor(
    private esp32Service: Esp32Service,
    private auth: Auth
  ) { }

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
    // Puedes añadir más lógica de limpieza aquí si es necesario
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
      })
    );
  }

  private handleHumedadData(valor: number) {
    this.humedad = Math.min(Math.max(valor, 0), 100);
    this.checkLoadingStatus();
  }

  private convertToPercentage(volume: number): number {
    const MAX_VOLUME = 3300; // Nuevo máximo
    // Invertimos la relación: valor más bajo = porcentaje más alto
    const percentage = ((MAX_VOLUME - volume) / MAX_VOLUME) * 100;

    // Aseguramos que el porcentaje esté entre 0% y 100%
    return Math.min(Math.max(percentage, 0), 100);
  }

  private handleVolumenData(valor: number) {
    // Aplicamos límites al valor recibido (0-3300)
    const clampedValue = Math.min(Math.max(valor, 0), 3300);
    this.volumen = this.convertToPercentage(clampedValue);
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
    this.checkLoadingStatus();
  }

  private handleVolumenError(err: any) {
    console.error('Error en volumen:', err);
    this.isConnected = false;
    this.volumen = null;
    this.checkLoadingStatus();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    clearInterval(this.updateInterval);
  }
}