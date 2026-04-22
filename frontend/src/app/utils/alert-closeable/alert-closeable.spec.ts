import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCloseable } from './alert-closeable';

describe('AlertCloseable', () => {
  let component: AlertCloseable;
  let fixture: ComponentFixture<AlertCloseable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertCloseable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertCloseable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
