import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCasataForm } from './new-casata-form';

describe('NewCasataForm', () => {
  let component: NewCasataForm;
  let fixture: ComponentFixture<NewCasataForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCasataForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCasataForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
