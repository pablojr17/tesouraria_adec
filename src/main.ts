// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

// --- Add these imports ---
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt'; // Or 'pt-BR' if you prefer

// --- Call registerLocaleData here, before bootstrapApplication ---
registerLocaleData(localePt, 'pt-BR');

// Your root component
import { AppComponent } from './app/app.component'; // Assuming AppComponent is your root

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()
    // ... other providers like provideRouter(routes)
  ]
}).catch(err => console.error(err));
