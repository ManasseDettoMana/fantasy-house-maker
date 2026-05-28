import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPersonaggioForm } from './new-personaggio-form';

describe('NewPersonaggioForm', () => {
  let component: NewPersonaggioForm;
  let fixture: ComponentFixture<NewPersonaggioForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPersonaggioForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPersonaggioForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
