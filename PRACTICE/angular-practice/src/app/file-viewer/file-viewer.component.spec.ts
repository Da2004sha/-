import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewerComponent } from './file-viewer.component';
import '@types/jest';

describe('FileViewerComponent', () => {
  let component: FileViewerComponent;
  let fixture: ComponentFixture<FileViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileViewerComponent]
    });
    fixture = TestBed.createComponent(FileViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
