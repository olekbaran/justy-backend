# justy-backend

This README is a simple documentation of every endpoint in API.

Every endpoint accepts props in the `application/json` encoded body.

## Authorization
Operates on `/auth` route.
Every request here must be of type POST.

- 200 – Success
- 400 – Data not provided
- 403 – Unauthorized no token provided or error with login (e.g., wrong password)
- 404 – Not found

| Route | Props | NOTE |
| :-----: | :----: | :----: |
| /auth/register| login, email, password, name | every parameter is required |
| /auth/login | login, password | login can be user's email |

Login route returns data about the user among the Bearer token, which must be present in the `Authorization` header.

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

## To-Do management
Operates on `/todos`.


| Method | Route | Action |
| :------: | :-----: | :------: |
| GET    | /todos | lists user to-dos |
| POST   | /todos | creates new to-do |
| POST   | /todos/edit | edits one or more to-do parameter |
| DELETE | /todos | deletes a to-do |

Sample to-do:
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

When creating a to-do, you have to pass data like:

- `title`: Title of to-do
- `description`: Longer description
- `endDate`: Deadline for to-do
- `category`: String name of a category

For actions like editing and deleting, you need to specify the id of the to-do are referring to as `item_id` in your request's body.

When editing you need to pass new values for things like `title`, `description`, `category`, `endDate`, or `done` as you need. __NOTE:__ You can pass only data you are changing.
