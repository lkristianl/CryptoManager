import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtxComponent } from './ftx.component';

describe('FtxComponent', () => {
  let component: FtxComponent;
  let fixture: ComponentFixture<FtxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FtxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FtxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
