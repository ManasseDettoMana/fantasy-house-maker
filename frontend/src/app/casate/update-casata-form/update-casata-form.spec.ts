import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCasataForm } from './update-casata-form';

describe('UpdateCasataForm', () => {
  let component: UpdateCasataForm;
  let fixture: ComponentFixture<UpdateCasataForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCasataForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCasataForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
