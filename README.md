# Quick Start

Put your environment variables at `/server/.env`

Inside `/server` install all dependencies and start the server:

```
npm i && npm run dev
```

Inside `/client` install all dependencies and start the frontend:

```
npm i && npm start
```

Now just open [localhost:3000](http://localhost:3000) to visit the frontend, or query the server endpoints directly at [localhost:5000](http://localhost:5000).

# Environment Variables

These reside in the `/server/.env` file, which is not checked into git. **Note:** The app will crash without these variables defined.

| Variable     | Description                     |
| :----------- | :------------------------------ |
| `MONGO_URI`  | URL of the development database |
| `JWT_SECRET` | JSON Web Token Secret           |

# Tech Stack

## Backend Dependencies

- Express
- BcryptJS
- Dotenv
- JSON Web Token (JWT)
- Mongoose
- Axios

## Frontend Dependencies

- React.js
- Reactstrap
