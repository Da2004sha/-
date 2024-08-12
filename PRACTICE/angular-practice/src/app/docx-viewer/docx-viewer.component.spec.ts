import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocxViewerComponent } from './docx.viewer.component';

describe('DocxViewerComponent', () => {
  let component: DocxViewerComponent;
  let fixture: ComponentFixture<DocxViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocxViewerComponent]
    });
    fixture = TestBed.createComponent(DocxViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
