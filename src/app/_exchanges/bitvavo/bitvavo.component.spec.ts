import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitvavoComponent } from './bitvavo.component';

describe('BitvavoComponent', () => {
  let component: BitvavoComponent;
  let fixture: ComponentFixture<BitvavoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitvavoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitvavoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
