import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasateList2 } from './casate-list-2';

describe('CasateList2', () => {
  let component: CasateList2;
  let fixture: ComponentFixture<CasateList2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasateList2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasateList2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
