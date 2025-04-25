import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersPayantComponent } from './tiers-payant.component';

describe('TiersPayantComponent', () => {
  let component: TiersPayantComponent;
  let fixture: ComponentFixture<TiersPayantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiersPayantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiersPayantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
