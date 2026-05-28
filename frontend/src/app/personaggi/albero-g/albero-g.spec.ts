import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlberoG } from './albero-g';

describe('AlberoG', () => {
  let component: AlberoG;
  let fixture: ComponentFixture<AlberoG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlberoG]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlberoG);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
