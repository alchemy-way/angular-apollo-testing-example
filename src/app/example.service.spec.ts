import {TestBed} from '@angular/core/testing';
import {ExampleService, HERO_QUERY} from './example.service';
import {ApolloTestingController, ApolloTestingModule} from 'apollo-angular/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('ExampleService', () => {
  let service: ExampleService;
  let apolloTestingController: ApolloTestingController;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientTestingModule]
    });

    service = TestBed.get(ExampleService);
    apolloTestingController = TestBed.get(ApolloTestingController);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  // When requesting via HttpClient and an expectation fails
  // the test properly fails and the error message indicates which test failed.
  //
  // Error:
  // ExampleService should REQUEST via APOLLO FAILED
  // Error: Expected false to be truthy.
  //
  it('should REQUEST via HTTP', () => {
    service.getCharacterViaHttp().subscribe(hero => {
      console.log(hero);
      expect(false).toBeTruthy();
    });

    const op = httpTestingController.expectOne('/hero/1');

    expect(op.request.method).toEqual('GET');

    op.flush({
      id: '1',
      name: 'Mr Angular',
    });
  });

  // When watching a query via Apollo and an expectation fails
  // the test properly fails and the error message indicates which test failed.
  // This is how the HttpClient handles this same situation, so it seems
  // that only query and mutate have the issue.
  //
  // ExampleService should WATCH THE QUERY via APOLLO FAILED
  // Error: Expected false to be truthy.
  //
  it('should WATCH THE QUERY via APOLLO', () => {
    service.watchCharacterViaApollo().subscribe(hero => {
      console.log(hero);
      expect(false).toBeTruthy();
    });

    const op = apolloTestingController.expectOne(HERO_QUERY);

    expect(op.operation.variables.id).toEqual('1');

    op.flush({
      data: {
        hero: {
          id: '1',
          name: 'Mr Apollo',
        },
      },
    });
  });

  afterEach(() => {
    apolloTestingController.verify();

    httpTestingController.verify();
  });

  // When querying via Apollo and an expectation fails
  // the test *actually passes* and the error is thrown in `afterAll`.
  // Because of that the error does not show which test should have
  // failed.
  //
  // An error was thrown in afterAll
  // Error: Expected false to be truthy.
  //
  it('should QUERY via APOLLO', () => {
    service.getCharacterViaApollo().subscribe(hero => {
      console.log(hero);
      expect(false).toBeTruthy();
    });

    const op = apolloTestingController.expectOne(HERO_QUERY);

    expect(op.operation.variables.id).toEqual('1');

    op.flush({
      data: {
        hero: {
          id: '1',
          name: 'Mr Apollo',
        },
      },
    });
  });
});
