import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasateList } from './casate-list';

describe('CasateList', () => {
  let component: CasateList;
  let fixture: ComponentFixture<CasateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasateList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
