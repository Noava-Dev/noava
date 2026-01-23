FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY noava/Noava.sln ./
COPY noava/Noava/noava.csproj ./Noava/

RUN dotnet restore

COPY noava/Noava/. ./Noava/

RUN dotnet publish -c Release -o out ./Noava/noava.csproj

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "noava.dll"]
