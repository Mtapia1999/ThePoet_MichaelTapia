import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'The Poet';
  user = 'Michael Tapia';
  authorDisplay = false;
  authorList = '';
  titleDisplay = false;
  titleList = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://poetrydb.org/author').subscribe({
      next: (data: any) => {
        this.authorList = data.authors;
      },
      error: (err) => console.log(err),
    });

    this.http.get('https://poetrydb.org/title').subscribe({
      next: (data: any) => {
        this.titleList = data.titles;
      },
      error: (err) => console.log(err),
    });
  }

  authorButtonName(): string {
    if (this.authorDisplay) {
      return 'Clear';
    } else {
      return 'Authors';
    }
  }

  toggleAuthor() {
    if (this.authorDisplay) {
      this.authorDisplay = false;
    } else {
      this.authorDisplay = true;
      this.titleDisplay = false;
    }
  }

  titleButtonName() {
    if (this.titleDisplay) {
      return 'Clear';
    } else {
      return 'Titles';
    }
  }

  toggleTitle() {
    if (this.titleDisplay) {
      this.titleDisplay = false;
    } else {
      this.titleDisplay = true;
      this.authorDisplay = false;
    }
  }
}
