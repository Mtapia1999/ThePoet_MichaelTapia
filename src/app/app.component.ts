import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

interface IPoetDBReturnObject {
  author: string,
  linecount: number,
  lines: string[],
  title: string
}

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
  errorMessage = '';
  searchChoice: 'author' | 'title' = 'author';
  searchValue = '';
  searchReturn: IPoetDBReturnObject[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://poetrydb.org/author').subscribe({
      next: (data: any) => {
        this.authorList = data.authors;
        if (data.status && data.status !== 200) {
          this.errorDisplay = true;
          this.errorMessage =
            'Getting list of Authors has failed with status code of ' +
            data.status;
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
          this.errorMessage =
            'Getting list of Titles has failed with status code of ' +
            data.status;
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

  searchPlaceholder(): string {
    if (this.searchChoice === 'author') {
      return 'Type in an Author';
    } else {
      return 'Type in an Title';
    }
  }

  toggleAuthor() {
    this.errorDisplay = false
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
    this.errorDisplay = false
    if (this.titleDisplay) {
      this.titleDisplay = false;
    } else {
      this.titleDisplay = true;
      this.authorDisplay = false;
    }
  }

  searchItem() {
    this.errorDisplay = false
    if (this.authorDisplay || this.titleDisplay) {
      this.authorDisplay = false
      this.titleDisplay = false
    }

    if (this.searchValue !== '') {
      if(this.searchChoice === 'author') {
        this.http.get('https://poetrydb.org/author/' + this.searchValue).subscribe({
          next: (data: any) => {
            this.searchReturn = data
            console.log(data)
            if (data.status && data.status !== 200) {
              this.errorDisplay = true;
              this.errorMessage =
                'Searching for Author with value of ' + this.searchValue + ' has failed with status code of ' +
                data.status;
            }
          },
          error: (err) => {
            console.log(err);
            this.errorDisplay = true;
          },
        });
      } else {
        this.http.get('https://poetrydb.org/title/' + this.searchValue).subscribe({
          next: (data: any) => {
            this.searchReturn = data
            console.log(data)
            if (data.status && data.status !== 200) {
              this.errorDisplay = true;
              this.errorMessage =
                'Searching for Title with value of ' + this.searchValue + ' has failed with status code of ' +
                data.status;
            }
          },
          error: (err) => {
            console.log(err);
            this.errorDisplay = true;
          },
        });
      }
    }
  }

  searchByClick(inputValue: string) {
    if (this.authorDisplay) {
      this.searchChoice = 'author'
    } else {
      this.searchChoice = 'title'
    }
    this.searchValue = inputValue;
    this.searchItem()
  }
}
