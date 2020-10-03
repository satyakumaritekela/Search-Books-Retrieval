import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  keyword: string;
  found: boolean;
  notesfound: boolean;
  book: any;
  empty: boolean;
  nokeyword: boolean;
  notes: string;
  emptyNotes: boolean;
  emptyKeyword: boolean;
  addNotes: boolean;
  searchword: boolean;

  constructor(private httpClient: HttpClient) { }
  ngOnInit() {
    this.found = false;
    this.notesfound = false;
    this.keyword = '';
    this.nokeyword = false;
    this.empty = false;
    this.emptyNotes = false;
    this.emptyKeyword = false;
    this.addNotes = false;
    this.searchword = true;
  }

  onNameKeyUp(event: any) {
    this.keyword = event.target.value;
    this.emptyNotes = false;
    this.checkValidation();
    this.checkNotesValidation();
  }

  onNotesKeyUp(event: any) {
    this.notes = event.target.value;
    this.checkNotesValidation();
  }

  checkNotesValidation() {
    if (this.emptyNotes === true || this.emptyKeyword === true || this.addNotes === true) {
      this.emptyKeyword = false;
      this.emptyKeyword = false;
      this.addNotes = false;
      this.emptyNotes = false;
    }
    if (this.found) {
      this.found = true;
    } else {
      this.found = false;
    }
  }

  checkValidation() {
    if (this.keyword !== '') {
      this.found = false;
      this.empty = false;
      this.nokeyword = false;
      this.searchword = false;
      this.notesfound = false;
    } else {
      this.empty = true;
      this.nokeyword = false;
      this.searchword = true;
      this.found = false;
      this.notesfound = false;
    }
    this.addNotes = false;
  }

  onSearch() {
    this.notesfound = false;
    this.book = [];
    this.nokeyword = false;
    if (this.keyword !== '') {
      const date = new Date();
      const postData = {
        keyword: this.keyword,
        dateNow: date
      };
      this.httpClient.post(`http://ec2-34-227-248-48.compute-1.amazonaws.com:3000/search`, postData)
        .toPromise()
        .then(response => {
          console.log(response);
        })
        .catch(err => console.log(err));
      this.httpClient.get(`http://ec2-34-227-248-48.compute-1.amazonaws.com:5000/catalogue/${this.keyword}`).toPromise().then(data => {
        this.book = data;
        if (! this.book.length) {
          this.nokeyword = true;
          this.found = false;
        } else {
          this.found = true;
          this.nokeyword = false;
        }
      });
    } else {
      this.found = false;
      this.empty = true;
    }
    this.emptyNotes = false;
  }

  onNotesRe() {
    this.found = false;
    this.book = [];
    this.nokeyword = false;
    if (this.keyword !== '') {
      this.httpClient.get(`http://ec2-34-227-248-48.compute-1.amazonaws.com:8000/note/${this.keyword}`)
        .toPromise()
        .then(data => {
          this.book = data;
          console.log(data);
          if (!this.book.length) {
            this.nokeyword = true;
            this.notesfound = false;
            return;
          } else {
            this.notesfound = true;
            this.nokeyword = false;
            return;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.notesfound = false;
      this.empty = true;
    }
    this.emptyNotes = false;
  }

  onNotes() {
    if (this.notes !== '') {
      this.emptyNotes = false;
      this.addNotes = false;
    } else {
      if (this.keyword === '') {
        this.emptyKeyword = true;
      } else {
        this.emptyKeyword = false;
        this.emptyNotes = true;
      }
    }

    if (!this.found) {
      this.emptyKeyword = true;
      return;
    }
    const notesData = {
      keyword: this.keyword,
      text: this.notes
    };
    if (this.keyword !== '' && this.notes !== undefined && this.notes !== '' && this.found === true) {
      this.httpClient.post('http://ec2-34-227-248-48.compute-1.amazonaws.com:8000/notes', notesData)
        .toPromise()
        .then(response => {
          this.addNotes = true;
          console.log(response);
        }).catch(err => {
          console.log(err);
          this.addNotes = false;
          return err;
        });
      this.addNotes = true;
    } else if (this.keyword === '') {
      this.emptyKeyword = false;
    } else if (this.nokeyword === true) {
      this.emptyKeyword = true;
    } else if (this.notes === undefined) {
      this.emptyNotes = true;
    }
  }
}
