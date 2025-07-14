import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  http = inject(HttpClient);
  username = '';
  password = '';

  login() {
    const payload = { username: this.username, password: this.password };
    this.http.post('/api/login', payload)
      .subscribe({
        next: res => console.log('Success:', res),
        error: err => console.error('Error:', err)
      });
  }
}
