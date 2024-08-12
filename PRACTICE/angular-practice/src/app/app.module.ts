import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DownloadComponent } from './download/download.component';
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DocxService } from './services/docx.service';
import { DocxViewerComponent } from './docx-viewer/docx.viewer.component';
import { DocxConverterService } from './services/docx.converter.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadService } from './file-upload.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    AppComponent,
    DownloadComponent,
    FileViewerComponent,
    FileUploadComponent,
    DocxViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule,
    EditorModule
  ],
  providers: [DocxService, DocxConverterService, FileUploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
