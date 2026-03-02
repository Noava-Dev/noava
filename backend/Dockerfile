# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY ./noava/noava.sln ./
COPY ./noava/noava ./noava

RUN dotnet restore ./noava/noava.csproj

RUN dotnet build ./noava/noava.csproj -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish ./noava/noava.csproj -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

COPY --from=publish /app/publish ./

EXPOSE 5000

ENTRYPOINT ["dotnet", "noava.dll"]
