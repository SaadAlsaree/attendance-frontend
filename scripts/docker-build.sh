#!/bin/bash
# Get-ExecutionPolicy
# Docker build and deployment script for Attendance Management System
# Usage: ./scripts/docker-build.sh [dev|prod|build]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to build the application
build_app() {
    print_status "Building attendance management application..."
    
    # Build the production image
    docker build -t attendance-frontend:latest .
    
    if [ $? -eq 0 ]; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Function to run in development mode
run_dev() {
    print_status "Starting development environment..."
    
    # Stop any existing containers
    docker-compose down
    
    # Start development environment
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
    
    print_success "Development environment started"
    print_status "Application is available at: http://localhost:3000"
    print_status "To view logs: docker-compose logs -f attendance-frontend"
}

# Function to run in production mode
run_prod() {
    print_status "Starting production environment..."
    
    # Stop any existing containers
    docker-compose down
    
    # Start production environment
    docker-compose --profile production up --build -d
    
    print_success "Production environment started"
    print_status "Application is available at: http://localhost:3000"
    print_status "Nginx proxy is available at: http://localhost:80"
    print_status "To view logs: docker-compose logs -f"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker-compose down
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    print_success "Cleanup completed"
}

# Function to show logs
show_logs() {
    print_status "Showing application logs..."
    docker-compose logs -f attendance-frontend
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build     Build the Docker image"
    echo "  dev       Start development environment with hot reloading"
    echo "  prod      Start production environment with Nginx"
    echo "  clean     Clean up Docker resources"
    echo "  logs      Show application logs"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build    # Build the application"
    echo "  $0 dev      # Start development server"
    echo "  $0 prod     # Start production server"
}

# Main script logic
main() {
    # Check if Docker is running
    check_docker
    
    case "${1:-help}" in
        "build")
            build_app
            ;;
        "dev")
            run_dev
            ;;
        "prod")
            run_prod
            ;;
        "clean")
            cleanup
            ;;
        "logs")
            show_logs
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@" 