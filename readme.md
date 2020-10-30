# Movie API

> Backend API for myFlixDB application, which is a movie directory website

## Usage on Postman

1.  Add user first using post method [copy and paste on postman](https://myflix3.herokuapp.com/users)
1.  Log in using post method [copy and paste on postman](https://myflix3.herokuapp.com/users)
1.  Copy the token created just like the json below

```json
{
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmYXZvcml0ZU1vdmllcyI6W10sIl9pZCI6IjVmOWM2Y2QyYTE2ZWM1MDAxNzRiOWNjOCIsInVzZXJuYW1lIjoiVGVzdGluZzIiLCJwYXNzd29yZCI6IiQyYiQxMCRLSmtwMmc5dWtHQnRWVWtpR1VSOUt1N0NzSGVxQ205TGdYeG9lY3gwbklRQ2JXOGNRMWIweSIsImVtYWlsIjoidGVzMXRAdGVzdC5jb20iLCJiaXJ0aGRheSI6IjE5OTAtMDEtMzFUMDA6MDA6MDAuMDAwWiIsIl9fdiI6MCwiaWF0IjoxNjA0MDk2MjE1LCJleHAiOjE2MDQ3MDEwMTUsInN1YiI6IlRlc3RpbmcyIn0.FmCbkdYmVm59gvtOpvtyvu68FvJiscIBRT4pyMl8r2k"
}
```

1.  Do this everytime the endpoint is returning a 401 status code meaning you are not authenticated to access the endpoint. On authorization tab select "Bearer Token" and paste the token in the input.
1.  Routes available and description
1.  Movie avalaible endpoints
    1.  [GET](https://myflix3.herokuapp.com/movies) - Get all movies
    1.  [GET](https://myflix3.herokuapp.com/movies/MovieTitle) - Get movie by title
    1.  [GET](https://myflix3.herokuapp.com/movies/genre/ Titanic) - Get genre by name/title
    1.  [GET](https://myflix3.herokuapp.com/movies/directors/John McTierna) - Get director by name
1.  Users avalaible endpoints

    1.  [POST](https://myflix3.herokuapp.com/movies/directors/John McTierna) - Add User on the bodey raw follow the format below

        ```json
        {
          "username": "Testing1",
          "password": "12345",
          "email": "tes1t@test.com",
          "birthday": "1-31-1990"
        }
        ```

    1.  [PUT](https://myflix3.herokuapp.com/movies/directors/John McTierna) - Update user on the body raw follow the same format as adding use.
    1.  [DELETE](https://myflix3.herokuapp.com/users/Testing1) - Remove user
    1.  [Add list of favorite movies](https://myflix3.herokuapp.com/users/Testing1/movies/5f96ff28cca7aaedc126dee9) - add favorite movie
    1.  [Remove list of favorite movies](hhttps://myflix3.herokuapp.com/users/Testing2/movies/5f96ff28cca7aaedc126dee9) -remove favorite movie

1.  Authentication
    1.  [POST](https://myflix3.herokuapp.com/movies) - https://myflix3.herokuapp.com/users;

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

```

## Demo

The API is live at [myflix3.herokuapp.com](https://myflix3.herokuapp.com/)

- Version: 1.0.0
- License: MIT
- Author: Rico John Dato-on
