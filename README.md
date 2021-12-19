# justy-backend

This README is a simple documentation of every endpoint in API.

Every endpoint accepts props in `application/json` encoded body.

## Authorization
Operates on `/auth` route.
Every request here must be of type POST.

- 200 - Success
- 400 - Data not provided
- 403 - Unathorized no token provided or error with login (eg. wrong password)
- 404 - Not found

| Route | Props | NOTE |
| :-----: | :----: | :----: |
| /auth/register| login, email, password, name | every parameter is required |
| /auth/login | login, password | login can be user's email |

Login route returns data about the user among the Bearer token which must be present in `Authorization` header.

Sample login request:
```json
{
    "login": "name@example.com",
    "password": "mystrongandcomplicatedpassword123"
}
```
Sample login response:
```json
{
    "token":"sample token",
    "user":{
        "login": string,
        "firstname": string,
        "id": string,
        "team_member": boolean,
        "avatar": url,
    }
}
```

## TODO management
Operates on `/todos`.


| Method | Route | Action |
| :------: | :-----: | :------: |
| GET    | /todos | lists user todos |
| POST   | /todos | creates new todo |
| POST   | /todos/edit | edits one or more todo parameter |
| DELETE | /todos | deletes a todo |

Sample todo:
```json
{
    "id": unique id of todo,
    "title": "Clean room",
    "description": "Mum will be angry.",
    "category": "Home",
    "endDate": 1671121653136,
    "createdAt": 1639574840302,
    "done": false,
}
```

When creating a todo you have to pass data like:

- `title`: Title of todo
- `description`: Longer description
- `endDate`: Deadline for todo
- `category`: String name of category

For actions like editing and deleting you need to specify id of the todo you are reffering to as `item_id` in your request's body.

When editing you need to pass new values for things like `title`, `description`, `category`, `endDate` or `done` as you need. __NOTE:__ You can pass only data you are acually changing.
