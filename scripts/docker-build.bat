@echo off
setlocal enabledelayedexpansion

REM Docker build and deployment script for Attendance Management System
REM Usage: scripts\docker-build.bat [dev|prod|build]

set "COMMAND=%1"
if "%COMMAND%"=="" set "COMMAND=help"

echo [INFO] Docker Build Script for Attendance Management System
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker and try again.
    exit /b 1
)
echo [SUCCESS] Docker is running
echo.

if "%COMMAND%"=="build" goto :build
if "%COMMAND%"=="dev" goto :dev
if "%COMMAND%"=="prod" goto :prod
if "%COMMAND%"=="clean" goto :clean
if "%COMMAND%"=="logs" goto :logs
if "%COMMAND%"=="help" goto :help
goto :help

:build
echo [INFO] Building attendance management application...
docker build -t attendance-frontend:latest .
if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)
echo [SUCCESS] Application built successfully
goto :end

:dev
echo [INFO] Starting development environment...
docker-compose down
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
if errorlevel 1 (
    echo [ERROR] Failed to start development environment
    exit /b 1
)
echo [SUCCESS] Development environment started
echo [INFO] Application is available at: http://localhost:3000
echo [INFO] To view logs: docker-compose logs -f attendance-frontend
goto :end

:prod
echo [INFO] Starting production environment...
docker-compose down
docker-compose --profile production up --build -d
if errorlevel 1 (
    echo [ERROR] Failed to start production environment
    exit /b 1
)
echo [SUCCESS] Production environment started
echo [INFO] Application is available at: http://localhost:3000
echo [INFO] Nginx proxy is available at: http://localhost:80
echo [INFO] To view logs: docker-compose logs -f
goto :end

:clean
echo [INFO] Cleaning up Docker resources...
docker-compose down
docker image prune -f
docker volume prune -f
echo [SUCCESS] Cleanup completed
goto :end

:logs
echo [INFO] Showing application logs...
docker-compose logs -f attendance-frontend
goto :end

:help
echo Usage: scripts\docker-build.bat [COMMAND]
echo.
echo Commands:
echo   build     Build the Docker image
echo   dev       Start development environment with hot reloading
echo   prod      Start production environment with Nginx
echo   clean     Clean up Docker resources
echo   logs      Show application logs
echo   help      Show this help message
echo.
echo Examples:
echo   scripts\docker-build.bat build    # Build the application
echo   scripts\docker-build.bat dev      # Start development server
echo   scripts\docker-build.bat prod     # Start production server
goto :end

:end
endlocal 