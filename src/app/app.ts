import { Component } from '@angular/core'; 
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { MatPaginatorModule } from '@angular/material/paginator';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, MatPaginatorModule ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'Patient';
}





