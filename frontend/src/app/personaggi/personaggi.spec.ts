import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Personaggi } from './personaggi';

describe('Personaggi', () => {
  let component: Personaggi;
  let fixture: ComponentFixture<Personaggi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personaggi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Personaggi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
