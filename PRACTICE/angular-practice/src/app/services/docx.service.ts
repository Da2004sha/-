import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocxService {
  private docxUrl = 'http://localhost:3000/api/upload';  // URL для загрузки исходного документа
  private editedDocUrl = 'http://localhost:3000/api/edited-docx'; // URL для загрузки отредактированного документа

  constructor(private http: HttpClient) {}

  // Получение исходного документа в формате ArrayBuffer
  getDocxAsHtml(): Observable<ArrayBuffer> {
    return this.http.get(this.docxUrl, { responseType: 'arraybuffer' });
  }

  // Сохранение исходного документа в формате HTML
  saveDocxAsHtml(htmlContent: string): Observable<any> {
    const payload = { html: htmlContent };
    return this.http.post(this.docxUrl, payload, { responseType: 'json' });
  }

  // Получение отредактированного документа в формате ArrayBuffer
  getEditedDocx(): Observable<ArrayBuffer> {
    return this.http.get(this.editedDocUrl, { responseType: 'arraybuffer' });
  }

  // Сохранение отредактированного документа на сервер
  saveEditedDocx(blob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', blob, 'edited-document.docx');
    return this.http.post(this.editedDocUrl, formData, { responseType: 'json' });
  }
}
