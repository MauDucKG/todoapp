﻿# TodoApp

## Technologies Used:
- **Frontend:** [React](https://reactjs.org/) ([Vite](https://vitejs.dev/))
- **Backend:** [.NET 6](https://dotnet.microsoft.com/en-us/)
- **Database:** [Postgres](https://www.postgresql.org/)
- **Deployment:** [Docker](https://www.docker.com/)

## Installation Steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/MauDucKG/todoapp.git
   cd todoapp
   ```

2. Start the backend:
   ```sh
   docker-compose build
   docker-compose up
   ```
   The backend will run on port: **7260**.  
   Swagger for backend: [https://localhost:7260/swagger/index.html](https://localhost:7260/swagger/index.html)

3. Start the frontend:
   ```sh
   cd todolist
   yarn 
   npm run dev
   ```
   The frontend will run on port: **5173**.

## Video demo:

https://github.com/MauDucKG/todoapp/assets/99491229/bc6e866b-4c70-4853-9bca-b4e5ddd21974

