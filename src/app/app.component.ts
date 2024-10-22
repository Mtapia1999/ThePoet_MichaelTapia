import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
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
  errorDisplay = false;
  searchValue = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://poetrydb.org/author').subscribe({
      next: (data: any) => {
        this.authorList = data.authors;
        if (data.status && data.status !== 200) {
          this.errorDisplay = true;
        }
      },
      error: (err) => {
        console.log(err);
        this.errorDisplay = true;
      },
    });

    this.http.get('https://poetrydb.org/title').subscribe({
      next: (data: any) => {
        this.titleList = data.titles;
        if (data.status && data.status !== 200) {
          this.errorDisplay = true;
        }
      },
      error: (err) => {
        console.log(err);
        this.errorDisplay = true;
      },
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

  searchItem() {
    if (this.searchValue !== '') {
      console.log('Searching for Author or Title');
    }
  }

  searchByClick(inputValue: string) {
    this.searchValue = inputValue;
    this.searchItem()
  }
}
