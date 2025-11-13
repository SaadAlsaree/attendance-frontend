# PowerShell script to create routes folder structure based on features structure
# Run this script from the project root directory

Write-Host "Creating routes folder structure based on features..." -ForegroundColor Green

# Base directory
$baseDir = "src/app/(routes)"

# Function to convert title to lowercase kebab-case
function Convert-ToKebabCase {
    param([string]$title)
    return $title.ToLower() -replace '\s+', '-' -replace '[^a-z0-9\-]', ''
}

# Function to create route structure
function Create-RouteStructure {
    param(
        [string]$featureTitle,
        [array]$subItems
    )
    
    $featureName = Convert-ToKebabCase $featureTitle
    $featureDir = Join-Path $baseDir $featureName
    
    Write-Host "Creating route structure for: $featureTitle" -ForegroundColor Yellow
    
    # Create main feature directory
    New-Item -ItemType Directory -Path $featureDir -Force | Out-Null
    
    # Create page.tsx for main feature
    $mainPageFile = Join-Path $featureDir "page.tsx"
    New-Item -ItemType File -Path $mainPageFile -Force | Out-Null
    
    # Create error.tsx for main feature
    $mainErrorFile = Join-Path $featureDir "error.tsx"
    New-Item -ItemType File -Path $mainErrorFile -Force | Out-Null
    
    # Create sub-item directories
    foreach ($item in $subItems) {
        $itemName = Convert-ToKebabCase $item.title
        $itemDir = Join-Path $featureDir $itemName
        
        # Create sub-item directory
        New-Item -ItemType Directory -Path $itemDir -Force | Out-Null
        
        # Create page.tsx for sub-item
        $pageFile = Join-Path $itemDir "page.tsx"
        New-Item -ItemType File -Path $pageFile -Force | Out-Null
         
        # Create error.tsx for sub-item
        $errorFile = Join-Path $itemDir "error.tsx"
        New-Item -ItemType File -Path $errorFile -Force | Out-Null
        
        # Create new/ subdirectory with page.tsx
        $newDir = Join-Path $itemDir "new"
        New-Item -ItemType Directory -Path $newDir -Force | Out-Null
        $newPageFile = Join-Path $newDir "page.tsx"
        New-Item -ItemType File -Path $newPageFile -Force | Out-Null
        
        # Create [id]/ subdirectory with page.tsx
        $idDir = Join-Path $itemDir "[id]"
        New-Item -ItemType Directory -Path $idDir -Force | Out-Null
        $idPageFile = Join-Path $idDir "page.tsx"
        New-Item -ItemType File -Path $idPageFile -Force | Out-Null
        
        # Create edit/ subdirectory inside [id]/ with page.tsx
        $editDir = Join-Path $idDir "edit"
        New-Item -ItemType Directory -Path $editDir -Force | Out-Null
        $editPageFile = Join-Path $editDir "page.tsx"
        New-Item -ItemType File -Path $editPageFile -Force | Out-Null
        
        Write-Host "  Created: $itemName (with new/, [id]/, and edit/ subdirectories)" -ForegroundColor Cyan
    }
}

# Define the route structure based on the features structure
$routeStructure = @(
    @{
        title = "Dashboard"
        items = @(
            @{ title = "Overview/Statistics" },
            @{ title = "System Health" },
            @{ title = "Recent Activities" }
        )
    },
    @{
        title = "Attendance"
        items = @(
            @{ title = "View All Attendance" },
            @{ title = "Attendance Logs" },
            @{ title = "Approve/Reject Records" },
            @{ title = "Manual Corrections" }
        )
    },
    @{
        title = "Employee"
        items = @(
            @{ title = "Employee Directory" },
            @{ title = "Add/Edit Employees" },
            @{ title = "Employee Schedules" },
            @{ title = "Assign Managers" }
        )
    },
    @{
        title = "Schedule"
        items = @(
            @{ title = "Create Schedules" },
            @{ title = "Assign Schedules" },
            @{ title = "Schedule Templates" },
            @{ title = "Schedule Reports" }
        )
    },
    @{
        title = "Leave"
        items = @(
            @{ title = "Leave Requests" },
            @{ title = "Approve/Reject Leaves" },
            @{ title = "Leave Policies" },
            @{ title = "Leave Reports" }
        )
    },
    @{
        title = "Reports"
        items = @(
            @{ title = "Attendance Reports" },
            @{ title = "Late Reports" },
            @{ title = "Overtime Reports" },
            @{ title = "Leave Reports" },
            @{ title = "Export Data" }
        )
    },
    @{
        title = "System"
        items = @(
            @{ title = "Users & Permissions" },
            @{ title = "Organizations/Units" },
            @{ title = "Work Locations" },
            @{ title = "Devices" },
            @{ title = "System Configuration" }
        )
    },
    @{
        title = "Profile"
        items = @(
            @{ title = "View Profile" },
            @{ title = "Edit Profile" },
            @{ title = "Change Password" },
            @{ title = "Settings" }
        )
    }
)

# Create base routes directory if it doesn't exist
if (!(Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir -Force | Out-Null
    Write-Host "Created base routes directory: $baseDir" -ForegroundColor Green
}

# Create structure for each route
foreach ($route in $routeStructure) {
    Create-RouteStructure -featureTitle $route.title -subItems $route.items
}

Write-Host "`nRoutes folder structure created successfully!" -ForegroundColor Green
Write-Host "Total route groups created: $($routeStructure.Count)" -ForegroundColor Cyan

# Display the created structure
Write-Host "`nCreated routes structure:" -ForegroundColor Yellow
Get-ChildItem -Path $baseDir -Recurse -Directory | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, "").TrimStart('\')
    $indent = "  " * ($relativePath.Split('\').Count - 4)
    Write-Host "$indent$($_.Name)" -ForegroundColor White
}

# Display created files
Write-Host "`nCreated files:" -ForegroundColor Yellow
Get-ChildItem -Path $baseDir -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, "").TrimStart('\')
    $indent = "  " * ($relativePath.Split('\').Count - 4)
    Write-Host "$indent$($_.Name)" -ForegroundColor Gray
}

Write-Host "`nScript completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add your page components to the created page.tsx files" -ForegroundColor White
Write-Host "2. Add layouts to layout.tsx files if needed" -ForegroundColor White
Write-Host "3. Add loading states to loading.tsx files" -ForegroundColor White
Write-Host "4. Add error handling to error.tsx files" -ForegroundColor White 