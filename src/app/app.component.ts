import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

/**
 * This interface is meant to represent the total information returned by the PoetDB
 * search by function
 *
 * @interface IPoetDBReturnObject
 * @member {string} author This is the author of the story
 * @member {number} linecount The total number of lines in the poem
 * @member {string[]} lines The written out lines of the poem
 * @member {string} title The title of the poem itself
 */
interface IPoetDBReturnObject {
  author: string;
  linecount: number;
  lines: string[];
  title: string;
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
  //Displays the entire list of authors when true
  authorDisplay = false;
  authorList = '';
  //Displays the entire list of titles when true
  titleDisplay = false;
  titleList = '';
  //Displays the given error message when true
  errorDisplay = false;
  errorMessage = '';
  //The users chosen searched option author or title in order to call the right endpoint
  searchChoice: 'author' | 'title' = 'author';
  searchValue = '';
  searchReturn: IPoetDBReturnObject[] = [];

  //builds the http client in the component for later use
  constructor(private http: HttpClient) {}

  //Upon initializing the component the list of authors and titles are gotten from the poetryDB endpoints
  ngOnInit() {
    //Gets all authors and returns that list or an error if the status code is not 200
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

    //Gets all titles and returns that list or an error if the status code is not 200
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

  //Small visual code to change the name of the author button for user clarity
  authorButtonName(): string {
    if (this.authorDisplay) {
      return 'Clear';
    } else {
      return 'Authors';
    }
  }

  //Small visual code to change the name of the title button for user clarity
  titleButtonName() {
    if (this.titleDisplay) {
      return 'Clear';
    } else {
      return 'Titles';
    }
  }

  //Small visual code to change the place holder when users are searching for an author or title
  searchPlaceholder(): string {
    if (this.searchChoice === 'author') {
      return 'Type in an Author';
    } else {
      return 'Type in an Title';
    }
  }

  //Toggles the display for the author list while also disabling the title display
  toggleAuthor() {
    this.errorDisplay = false;
    if (this.authorDisplay) {
      this.authorDisplay = false;
    } else {
      this.authorDisplay = true;
      this.titleDisplay = false;
    }
  }

  //Toggles the display for the title list while also disabling the author display
  toggleTitle() {
    this.errorDisplay = false;
    if (this.titleDisplay) {
      this.titleDisplay = false;
    } else {
      this.titleDisplay = true;
      this.authorDisplay = false;
    }
  }

  //Searches for the value given in the searchValue variable while disabling both author and title display
  searchItem() {
    this.errorDisplay = false;
    if (this.authorDisplay || this.titleDisplay) {
      this.authorDisplay = false;
      this.titleDisplay = false;
    }

    //Searches as long as the search value is not empty
    if (this.searchValue !== '') {
      //If the user is searching for an author, calls the author endpoint with the given search value
      if (this.searchChoice === 'author') {
        this.http
          .get('https://poetrydb.org/author/' + this.searchValue)
          .subscribe({
            next: (data: any) => {
              this.searchReturn = data;
              console.log(data);
              if (data.status && data.status !== 200) {
                this.errorDisplay = true;
                this.errorMessage =
                  'Searching for Author with value of ' +
                  this.searchValue +
                  ' has failed with status code of ' +
                  data.status;
              }
            },
            error: (err) => {
              console.log(err);
              this.errorDisplay = true;
            },
          });
      }
      //If the user is searching for an title, calls the title endpoint with the given search value
      else {
        this.http
          .get('https://poetrydb.org/title/' + this.searchValue)
          .subscribe({
            next: (data: any) => {
              this.searchReturn = data;
              console.log(data);
              if (data.status && data.status !== 200) {
                this.errorDisplay = true;
                this.errorMessage =
                  'Searching for Title with value of ' +
                  this.searchValue +
                  ' has failed with status code of ' +
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

  //Allows the user to click on the authors and titles in order to search with just a click on the words
  searchByClick(inputValue: string) {
    if (this.authorDisplay) {
      this.searchChoice = 'author';
    } else {
      this.searchChoice = 'title';
    }
    this.searchValue = inputValue;
    this.searchItem();
  }
}
