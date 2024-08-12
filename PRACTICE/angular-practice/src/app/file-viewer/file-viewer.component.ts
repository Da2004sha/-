import { Component } from '@angular/core';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent {

  print() {
    window.print();
  }

  downloadFile() {
    const link = document.createElement('a');
    link.href = 'assets/example.docx';
    link.download = 'example.docx';
    //link.click();
  }
}
