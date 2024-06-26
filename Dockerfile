# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ToDoList_API.sln ./
COPY ToDoList_API/*.csproj ./ToDoList_API/
RUN dotnet restore

# Copy everything else and build
COPY . .
WORKDIR /src/ToDoList_API
RUN dotnet build -c Release -o /app/build

# Stage 2: Build a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/build .
ENTRYPOINT ["dotnet", "ToDoList_API.dll"]
