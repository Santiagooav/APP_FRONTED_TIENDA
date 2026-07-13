import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoProductosPage } from './listado-productos.page';

describe('ListadoProductosPage', () => {
  let component: ListadoProductosPage;
  let fixture: ComponentFixture<ListadoProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
