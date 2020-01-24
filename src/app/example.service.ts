import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

export const HERO_QUERY = gql`
  query GetCharacter($id: String) {
    hero(id: $id) {
      name
      id
    }
  }
`;

interface Hero {
  name: string;
  id: string;
}

interface Response {
  hero: Hero;
}


@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  constructor(private apollo: Apollo, private http: HttpClient) { }

  watchCharacterViaApollo(): Observable<Hero> {
    return this.apollo
      .watchQuery<Response>({
        query: HERO_QUERY,
        variables: {
          id: '1'
        }
      })
      .valueChanges
      .pipe(map(response => response.data.hero));
  }

  getCharacterViaApollo(): Observable<Hero> {
    return this.apollo
      .query<Response>({
        query: HERO_QUERY,
        variables: {
          id: '1'
        }
      })
      .pipe(map(response => response.data.hero));
  }

  getCharacterViaHttp(): Observable<Hero> {
    return this.http.get<Hero>('/hero/1');
  }
}
