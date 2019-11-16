import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('NgConfigService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  interface MyConfig {
    baseValue: string;
    overrideValue: string;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });

  it('should created concrete config object', () => {
    const env = 'prod';
    const baseConfig: MyConfig = { baseValue: 'base', overrideValue: 'base' };
    const prodConfig = { overrideValue: 'prod' } as MyConfig;
    const expected: MyConfig = { baseValue: 'base', overrideValue: 'prod' };
    const service: ConfigService = TestBed.get(ConfigService);

    service.get<MyConfig>().subscribe(
      data => expect(data).toEqual(expected),
      () => fail('should not have error')
    );

    httpTestingController.expectOne('assets/configs/config.json').flush(baseConfig);
    httpTestingController.expectOne('assets/configs/env.json').flush({ env });
    httpTestingController.expectOne(`assets/configs/config.${env}.json`).flush(prodConfig);
  });

  it('should created any object', () => {
    const env = 'prod';
    const baseConfig = { baseValue: 'base', overrideValue: 'base' };
    const prodConfig = { overrideValue: 'prod' };
    const expected = { baseValue: 'base', overrideValue: 'prod' };
    const service: ConfigService = TestBed.get(ConfigService);

    service.get<any>().subscribe(
      data => expect(data).toEqual(expected),
      () => fail('should not have error')
    );

    httpTestingController.expectOne('assets/configs/config.json').flush(baseConfig);
    httpTestingController.expectOne('assets/configs/env.json').flush({ env });
    httpTestingController.expectOne(`assets/configs/config.${env}.json`).flush(prodConfig);
  });

  it('should created concrete config object for empty env', () => {
    const baseConfig: MyConfig = { baseValue: 'base', overrideValue: 'base' };
    const expected: MyConfig = { baseValue: 'base', overrideValue: 'base' };
    const service: ConfigService = TestBed.get(ConfigService);

    service.get<MyConfig>().subscribe(
      data => expect(data).toEqual(expected),
      () => fail('should not have error')
    );

    httpTestingController.expectOne('assets/configs/config.json').flush(baseConfig);
    httpTestingController.expectOne('assets/configs/env.json').flush({ env: '' });
  });

  it('should throw error when undefined env', () => {
    const baseConfig: MyConfig = { baseValue: 'base', overrideValue: 'base' };
    const service: ConfigService = TestBed.get(ConfigService);

    service.get<MyConfig>().subscribe(
      () => fail('should have failed with error'),
      error => {expect(error).toBeDefined(); console.log(error); }
    );

    httpTestingController.expectOne('assets/configs/config.json').flush(baseConfig);
    httpTestingController.expectOne('assets/configs/env.json').flush({});
  });

  it('should throw error when base config not found', () => {
    const errMsg = 'deliberate 404 error';
    const service: ConfigService = TestBed.get(ConfigService);

    service.get<MyConfig>().subscribe(
      () => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(errMsg, 'message');
      }
    );

    httpTestingController.expectOne('assets/configs/config.json').flush(errMsg, { status: 404, statusText: 'Not Found' });
  });

  it('should throw error when env not found', () => {
    const errMsg = 'deliberate 404 error';
    const baseConfig: MyConfig = { baseValue: 'base', overrideValue: 'base' };
    const service: ConfigService = TestBed.get(ConfigService);

    service.get<MyConfig>().subscribe(
      () => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(errMsg, 'message');
      }
    );

    httpTestingController.expectOne('assets/configs/config.json').flush(baseConfig);
    httpTestingController.expectOne('assets/configs/env.json').flush(errMsg, { status: 404, statusText: 'Not Found' });
  });

  it('should throw error when env config not found', () => {
    const errMsg = 'deliberate 404 error';
    const baseConfig: MyConfig = { baseValue: 'base', overrideValue: 'base' };
    const service: ConfigService = TestBed.get(ConfigService);

    service.get<MyConfig>().subscribe(
      () => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(errMsg, 'message');
      }
    );

    httpTestingController.expectOne('assets/configs/config.json').flush(baseConfig);
    httpTestingController.expectOne('assets/configs/env.json').flush({ env: 'prod' });
    httpTestingController.expectOne('assets/configs/config.prod.json').flush(errMsg, { status: 404, statusText: 'Not Found' });
  });

});
