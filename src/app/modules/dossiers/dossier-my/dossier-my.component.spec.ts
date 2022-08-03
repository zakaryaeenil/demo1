import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierMyComponent } from './dossier-my.component';

describe('DossierMyComponent', () => {
  let component: DossierMyComponent;
  let fixture: ComponentFixture<DossierMyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DossierMyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
