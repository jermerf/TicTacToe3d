import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamechooserComponent } from './gamechooser.component';

describe('GamechooserComponent', () => {
  let component: GamechooserComponent;
  let fixture: ComponentFixture<GamechooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamechooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamechooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
