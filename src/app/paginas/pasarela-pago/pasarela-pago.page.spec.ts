import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasarelaPagoPage } from './pasarela-pago.page';

describe('PasarelaPagoPage', () => {
  let component: PasarelaPagoPage;
  let fixture: ComponentFixture<PasarelaPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasarelaPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
