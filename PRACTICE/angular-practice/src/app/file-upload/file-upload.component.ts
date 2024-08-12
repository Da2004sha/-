import { Component } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import * as mammoth from 'mammoth';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  editedDocument: Document | null = null;
  isUploading = false;
  uploadSuccess = false;
  uploadError = false;
  uploadedFileUrl: string | null = null; // URL для отображения загруженного файла

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.readFile(this.selectedFile);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      try {
        const docText = await this.loadDocx(arrayBuffer);
        this.createDocx(docText);
      } catch (error) {
        console.error('Error reading DOCX file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async loadDocx(arrayBuffer: ArrayBuffer): Promise<string> {
    // Используем mammoth для конвертации DOCX в HTML
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    return result.value; // Полученный HTML
  }

  createDocx(docHtml: string): void {
    // Преобразуем HTML в текст
    const docText = this.htmlToText(docHtml);

    // Создаем новый документ с редактированным текстом
    this.editedDocument = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(docText),
                new TextRun("Это новый параграф, добавленный в документ."),
              ],
            }),
          ],
        },
      ],
    });
  }

  htmlToText(html: string): string {
    // Преобразование HTML в текст (очистка HTML-тегов)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || '';
  }

  onUpload(): void {
    if (this.editedDocument) {
      this.isUploading = true;
      Packer.toBlob(this.editedDocument).then(blob => {
        const file = new File([blob], "edited-document.docx", {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        this.fileUploadService.uploadFile(file).subscribe(
          response => {
            console.log('File uploaded successfully:', response);
            this.uploadSuccess = true;
            this.uploadError = false;
            this.isUploading = false;
            this.uploadedFileUrl = response.filePath;
          },
          error => {
            console.error('Error uploading file:', error);
            this.uploadSuccess = false;
            this.uploadError = true;
            this.isUploading = false;
          }
        );
      });
    }
  }

  onSave(): void {
    if (this.editedDocument) {
      Packer.toBlob(this.editedDocument).then(blob => {
        saveAs(blob, "edited-document.docx");
      });
    }
  }
}
