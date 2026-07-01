import { ComponentFixture, TestBed } from '@angular/core/testing';

import { moderator } from './moderator-home';

describe('moderator', () => {
  let component: moderator;
  let fixture: ComponentFixture<moderator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [moderator],
    }).compileComponents();

    fixture = TestBed.createComponent(moderator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
