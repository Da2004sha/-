import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { DocxService } from '../services/docx.service';
import { Packer, Document, Paragraph, TextRun, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import * as mammoth from 'mammoth';

@Component({
  selector: 'app-docx-viewer',
  templateUrl: './docx-viewer.component.html',
  styleUrls: ['./docx-viewer.component.css']
})
export class DocxViewerComponent implements AfterViewInit {
  @ViewChild('tinyEditor') tinyEditor!: EditorComponent;
  @ViewChild('checkbox') checkbox!: ElementRef;
  htmlContent: string = '';
  convertedHtml: string = '';
  uploadSuccess: boolean = false;
  uploadError: boolean = false;

  constructor(private docxService: DocxService) {}

  ngAfterViewInit(): void {
    this.loadDocxContent();
  }

  setupEditor(editor: any): void {
    editor.ui.registry.addButton('customOverlay', {
      text: 'Custom Overlay',
      onAction: () => {
        const content = editor.selection.getContent();
        editor.insertContent('<div class="custom-overlay">' + content + '</div>');
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (result instanceof ArrayBuffer) {
          this.convertToHtml(result).then(html => {
            this.convertedHtml = html;
            if (this.tinyEditor) {
              this.tinyEditor.editor.setContent(html);
            }
          }).catch(error => {
            console.error('Conversion error:', error);
          });
        } else {
          console.error('Expected ArrayBuffer but got', typeof result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  loadDocxContent(): void {
    this.docxService.getDocxAsHtml().subscribe({
      next: (arrayBuffer: ArrayBuffer) => {
        this.convertToHtml(arrayBuffer).then(html => {
          this.htmlContent = html;
          this.convertedHtml = html;
          if (this.tinyEditor) {
            this.tinyEditor.editor.setContent(html);
          }
        }).catch(error => {
          console.error('Conversion error:', error);
        });
      },
      error: (e) => {
        console.error('Error loading .docx file:', e);
      }
    });
  }

  saveDocument(): void {
    if (this.tinyEditor) {
      const htmlContent = this.tinyEditor.editor.getContent();
      this.createDocxFromHtml(htmlContent).then(blob => {
        saveAs(blob, 'edited-document.docx');
        this.docxService.saveEditedDocx(blob).subscribe({
          next: (response) => {
            console.log('Document saved successfully:', response);
            this.uploadSuccess = true;
          },
          error: (error) => {
            console.error('Error saving document:', error);
            this.uploadError = true;
          }
        });
      }).catch(error => {
        console.error('Error creating DOCX file:', error);
        this.uploadError = true;
      });
    }
  }

  convertToHtml(arrayBuffer: ArrayBuffer): Promise<string> {
    return mammoth.convertToHtml({ arrayBuffer })
      .then(result => result.value)
      .catch(error => {
        console.error('Error converting to HTML:', error);
        return Promise.reject(error);
      });
  }

  async createDocxFromHtml(html: string): Promise<Blob> {
    const paragraphs = await this.convertHtmlToDocxParagraphs(html);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    return Packer.toBlob(doc);
  }

  private async convertHtmlToDocxParagraphs(html: string): Promise<Paragraph[]> {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(html, 'text/html');
    const paragraphs: Paragraph[] = [];

    for (const node of Array.from(htmlDoc.body.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'P') {
        const children: (TextRun | ImageRun)[] = [];
        for (const childNode of Array.from(node.childNodes)) {
          if (childNode.nodeType === Node.TEXT_NODE) {
            children.push(new TextRun((childNode as Text).data));
          } else if (childNode.nodeType === Node.ELEMENT_NODE) {
            const element = childNode as HTMLElement;
            if (element.tagName === 'STRONG') {
              children.push(new TextRun({
                text: element.innerText,
                bold: true,
              }));
            } else if (element.tagName === 'IMG') {
              const imgElement = element as HTMLImageElement;
              const imgSrc = imgElement.src;
              try {
                const imageData = await this.fetchImageData(imgSrc);
                const image = new ImageRun({
                  data: imageData,
                  transformation: {
                    width: imgElement.width,
                    height: imgElement.height,
                  },
                });
                children.push(image);
              } catch (error) {
                console.error('Error loading image:', error);
              }
            }
          }
        }
        paragraphs.push(new Paragraph({
          children: children,
        }));
      }
    }

    return paragraphs;
  }

  private async fetchImageData(url: string): Promise<Uint8Array> {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  toggleImages(): void {
    const checkbox = this.checkbox.nativeElement;
    const editorContent = this.tinyEditor.editor.getDoc();
    const images = Array.from(editorContent.getElementsByTagName('img')) as HTMLImageElement[];
    images.forEach(img => {
      if (checkbox.checked) {
        img.style.display = 'none';
      } else {
        img.style.display = '';
      }
    });
  }
}
