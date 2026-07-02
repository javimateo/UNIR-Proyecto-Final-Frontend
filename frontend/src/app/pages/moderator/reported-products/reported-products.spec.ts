import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedProducts } from './reported-products';

describe('ReportedProducts', () => {
  let component: ReportedProducts;
  let fixture: ComponentFixture<ReportedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportedProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportedProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
