import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { OpAutocompleterComponent } from "./op-autocompleter.component";
import { OpAutocompleterService } from "./services/op-autocompleter.service";
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TimezoneService } from 'core-app/components/datetime/timezone.service';
import { ConfigurationService } from 'core-app/modules/common/config/configuration.service';
import { States } from 'core-app/components/states.service';
import { HalResourceService } from "core-app/modules/hal/services/hal-resource.service";
import { HttpClientModule } from "@angular/common/http";
import { By } from '@angular/platform-browser';
import { APIV3Service } from "core-app/modules/apiv3/api-v3.service";
import { of } from "rxjs";
import { SchemaCacheService } from "core-components/schemas/schema-cache.service";
import { HalResourceNotificationService } from 'core-app/modules/hal/services/hal-resource-notification.service';


export enum KeyCode {
  Tab = 9,
  Enter = 13,
  Esc = 27,
  Space = 32,
  ArrowUp = 38,
  ArrowDown = 40,
  Backspace = 8,
  two = 50,
  W = 87,
};

export interface NgOption {
  [name: string]: any;
  index?: number;
  htmlId?: string;
  selected?: boolean;
  disabled?: boolean;
  marked?: boolean;
  label?: string;
  value?: string | Object;
  parent?: NgOption;
  children?: NgOption[];
};

function triggerKeyDownEvent(element: DebugElement, which: number, key = ''): void {
  element.triggerEventHandler('keydown', {
      which: which,
      key: key,
      preventDefault: () => { },
  });
}

function getNgSelectElement(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('ng-select'));
}



fdescribe('autocompleter', () => {

  const workPackagesStub = [
    {
      id: 1,
      subject: 'Workpackage 1',
      author: {
        href: '/api/v3/users/1',
        name: 'Author1'
      },
      description: {
        format: 'markdown',
        raw: 'Description of WP1',
        html: '<p>Description of WP1</p>'
      },
      createdAt: '2021-03-26T10:42:14Z',
      updatedAt: '2021-03-26T10:42:14Z',
      dueDate: '2021-03-26T10:42:14Z',
      startDate: '2021-03-26T10:42:14Z',
    },
    {
      id: 2,
      subject: 'Workpackage 2',
      author: {
        href: '/api/v3/users/2',
        name: 'Author2'
      },
      description: {
        format: 'markdown',
        raw: 'Description of WP2',
        html: '<p>Description of WP2</p>'
      },
      createdAt: '2021-03-26T10:42:14Z',
      updatedAt: '2021-03-26T10:42:14Z',
      dueDate: '2021-03-26T10:42:14Z',
      startDate: '2021-03-26T10:42:14Z',
    },
  ];

  const apiv3ServiceStub = {
    work_packages: {
      list: (_params:any) => {
        return of({ elements: workPackagesStub });
      }
    }
  };

 

  let fixture:ComponentFixture<OpAutocompleterComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        OpAutocompleterComponent],
      providers: [
        OpAutocompleterService,
        HalResourceService,
        HalResourceNotificationService,
        { provide: APIV3Service, useValue: apiv3ServiceStub },

      ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    
   
    fixture = TestBed.createComponent(OpAutocompleterComponent);

    fixture.componentInstance.resource = 'work_packages' as resource;
    fixture.componentInstance.filters = [];
    fixture.componentInstance.searchKey = 'subjectOrId';
    fixture.componentInstance.appendTo = 'body';
    fixture.componentInstance.multiple = false;
    fixture.componentInstance.closeOnSelect = true;
    fixture.componentInstance.hasDefaultContent = true;
    fixture.componentInstance.virtualScroll = true;
    fixture.componentInstance.classes = 'wp-inline-create--reference-autocompleter';
    


  });



  it('should load the ng-select correctly', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const autocompleter = document.querySelector('.ng-select-container');
      expect(document.contains(autocompleter)).toBeTruthy();
    });
  });
  

  it('should load WorkPackages', fakeAsync(() => {
    triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.W);
    fixture.detectChanges();
    tick();
    // triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.two);
    // fixture.detectChanges();
    // tick();
    const select = fixture.componentInstance.ngSelectInstance;
   fixture.whenStable().then(() => {
     debugger;
     console.log(fixture.componentInstance.ngSelectInstance);
    //expect(fixture.componentInstance.select).not.toBeUndefined();
    expect(fixture.componentInstance.ngSelectInstance.itemsList).not.toBeUndefined();
  });
   
    
  }));
});