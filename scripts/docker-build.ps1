# Docker build and deployment script for Attendance Management System
# Usage: .\scripts\docker-build.ps1 [dev|prod|build]

param(
    [Parameter(Position = 0)]
    [ValidateSet("dev", "prod", "build", "clean", "logs", "help")]
    [string]$Command = "help"
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Success "Docker is running"
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        return $false
    }
}

# Function to build the application
function Build-App {
    Write-Status "Building attendance management application..."
    
    try {
        docker build -t attendance-frontend:latest .
        Write-Success "Application built successfully"
    }
    catch {
        Write-Error "Build failed"
        exit 1
    }
}

# Function to run in development mode
function Start-Dev {
    Write-Status "Starting development environment..."
    
    try {
        # Stop any existing containers
        docker-compose down
        
        # Start development environment (explicitly include override file)
        docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
        
        Write-Success "Development environment started"
        Write-Status "Application is available at: http://localhost:3000"
        Write-Status "To view logs: docker-compose logs -f attendance-frontend"
    }
    catch {
        Write-Error "Failed to start development environment"
        exit 1
    }
}

# Function to run in production mode
function Start-Prod {
    Write-Status "Starting production environment..."
    
    try {
        # Stop any existing containers
        docker-compose down
        
        # Start production environment (explicitly exclude override file)
        docker-compose -f docker-compose.yml --profile production up --build -d
        
        Write-Success "Production environment started"
        Write-Status "Application is available at: http://localhost:3000"
        Write-Status "Nginx proxy is available at: http://localhost:80"
        Write-Status "To view logs: docker-compose logs -f"
    }
    catch {
        Write-Error "Failed to start production environment"
        exit 1
    }
}

# Function to clean up
function Remove-DockerResources {
    Write-Status "Cleaning up Docker resources..."
    
    try {
        # Stop and remove containers
        docker-compose down
        
        # Remove unused images
        docker image prune -f
        
        # Remove unused volumes
        docker volume prune -f
        
        Write-Success "Cleanup completed"
    }
    catch {
        Write-Error "Failed to clean up Docker resources"
        exit 1
    }
}

# Function to show logs
function Show-Logs {
    Write-Status "Showing application logs..."
    try {
        docker-compose logs -f attendance-frontend
    }
    catch {
        Write-Error "Failed to show logs"
        exit 1
    }
}

# Function to show help
function Show-Help {
    Write-Host "Usage: .\scripts\docker-build.ps1 [COMMAND]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  build     Build the Docker image"
    Write-Host "  dev       Start development environment with hot reloading"
    Write-Host "  prod      Start production environment with Nginx"
    Write-Host "  clean     Clean up Docker resources"
    Write-Host "  logs      Show application logs"
    Write-Host "  help      Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\scripts\docker-build.ps1 build    # Build the application"
    Write-Host "  .\scripts\docker-build.ps1 dev      # Start development server"
    Write-Host "  .\scripts\docker-build.ps1 prod     # Start production server"
}

# Main script logic
function Main {
    # Check if Docker is running
    if (-not (Test-Docker)) {
        exit 1
    }
    
    switch ($Command) {
        "build" { Build-App }
        "dev" { Start-Dev }
        "prod" { Start-Prod }
        "clean" { Remove-DockerResources }
        "logs" { Show-Logs }
        "help" { Show-Help }
        default { Show-Help }
    }
}

# Run main function
Main 