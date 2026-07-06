import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IUserServices } from './iuser.services';

describe('IUserServices', () => {
  let service: IUserServices;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(IUserServices);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users when the backend responds with an array', async () => {
    const usersPromise = service.getAllPromises();

    const req = httpMock.expectOne('http://localhost:3000/api/users');
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        username: 'ana',
        apellido: 'perez',
        email: 'ana@test.com',
        password: '12345678',
        status: 'active',
        role: 'user',
      },
    ]);

    const users = await usersPromise;
    expect(users.length).toBe(1);
    expect(users[0].username).toBe('ana');
  });

  it('should return users when the backend responds with a paginated object', async () => {
    const usersPromise = service.getAllPromises();

    const req = httpMock.expectOne('http://localhost:3000/api/users');
    req.flush({
      results: [
        {
          id: 2,
          username: 'luis',
          apellido: 'gomez',
          email: 'luis@test.com',
          password: '12345678',
          status: 'active',
          role: 'moderator',
        },
      ],
    });

    const users = await usersPromise;
    expect(users.length).toBe(1);
    expect(users[0].email).toBe('luis@test.com');
  });
});
