import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as mammoth from 'mammoth';

import { DocxService } from './services/docx.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fileUrl: SafeResourceUrl | null = null;
  title = 'angular-practice';
  editorData = '';
  selectedFile: File | null = null;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  // Метод для выбора файла
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Метод для загрузки файла на сервер
  uploadFile() {
    if (!this.selectedFile) {
      alert('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post<{ filePath: string }>('http://localhost:3000/api/upload', formData).subscribe(response => {
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.filePath);
      this.loadDocument(response.filePath);
    }, error => {
      console.error('Error uploading file', error);
    });
  }

  // Метод для загрузки документа
  loadDocument(filePath: string) {
    this.http.get(filePath, { responseType: 'arraybuffer' }).subscribe(data => {
      mammoth.convertToHtml({ arrayBuffer: data }).then(result => {
        this.editorData = result.value; // HTML содержимое документа
      }).catch(error => {
        console.error('Error converting document to HTML', error);
      });
    }, error => {
      console.error('Error loading document', error);
    });
  }

  // Метод для сохранения документа как файл
  // saveDocument() {
  //   // Создаем Blob из данных редактора
  //   const docxContent = new Blob([this.editorData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  //
  //   // Создаем объект FormData и добавляем туда наш Blob
  //   const formData = new FormData();
  //   formData.append('file', docxContent, 'document.docx');
  //
  //   // Выполняем POST запрос на сервер для сохранения файла
  //   this.http.post<{ filePath: string }>('http://localhost:3000/api/save', formData)
  //     .subscribe(
  //       response => {
  //         console.log('Document saved successfully!', response);
  //       },
  //       error => {
  //         console.error('Error saving document', error);
  //       }
  //     );
  // }


  // Метод для обработки изменения содержимого редактора
  onEditorChange(event: Event) {
    const target = event.target as HTMLElement;
    this.editorData = target.innerText || '';
  }
}
