import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierEnntraitementComponent } from './dossier-enntraitement.component';

describe('DossierEnntraitementComponent', () => {
  let component: DossierEnntraitementComponent;
  let fixture: ComponentFixture<DossierEnntraitementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DossierEnntraitementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierEnntraitementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
