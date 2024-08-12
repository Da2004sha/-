import { Injectable } from '@angular/core';
import * as mammoth from 'mammoth';

@Injectable({
  providedIn: 'root'
})
export class DocxConverterService {

  /**
   * Конвертирует DOCX файл в HTML строку.
   * @param arrayBuffer - Входной ArrayBuffer, содержащий данные DOCX файла.
   * @returns Promise, содержащий HTML строку или пустую строку в случае ошибки.
   */
  convertToHtml(arrayBuffer: ArrayBuffer): Promise<string> {
    return mammoth.convertToHtml({ arrayBuffer })
      .then(result => result.value)
      .catch(error => {
        console.error('Conversion error:', error);
        return '';
      });
  }
}
