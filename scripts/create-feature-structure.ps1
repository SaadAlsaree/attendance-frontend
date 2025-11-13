# PowerShell script to create feature folder structure based on sidebar navigation
# Run this script from the project root directory

Write-Host "Creating feature folder structure..." -ForegroundColor Green

# Base directory
$baseDir = "src/features"

# Function to convert title to lowercase kebab-case
function Convert-ToKebabCase {
    param([string]$title)
    return $title.ToLower() -replace '\s+', '-' -replace '[^a-z0-9\-]', ''
}

# Function to create feature structure
function Create-FeatureStructure {
    param(
        [string]$featureTitle,
        [array]$subItems
    )
    
    $featureName = Convert-ToKebabCase $featureTitle
    $featureDir = Join-Path $baseDir $featureName
    
    Write-Host "Creating structure for: $featureTitle" -ForegroundColor Yellow
    
    # Create main feature directory
    New-Item -ItemType Directory -Path $featureDir -Force | Out-Null
    
    # Create sub-item directories
    foreach ($item in $subItems) {
        $itemName = Convert-ToKebabCase $item.title
        $itemDir = Join-Path $featureDir $itemName
        
        # Create sub-item directory
        New-Item -ItemType Directory -Path $itemDir -Force | Out-Null
        
        # Create api directory
        $apiDir = Join-Path $itemDir "api"
        New-Item -ItemType Directory -Path $apiDir -Force | Out-Null
        
        # Create service file
        $serviceFile = Join-Path $apiDir "$itemName.service.ts"
        New-Item -ItemType File -Path $serviceFile -Force | Out-Null
        
        # Create components directory
        $componentsDir = Join-Path $itemDir "components"
        New-Item -ItemType Directory -Path $componentsDir -Force | Out-Null
        
        # Create component files
        $formFile = Join-Path $componentsDir "$itemName-form.tsx"
        $listingFile = Join-Path $componentsDir "$itemName-listing.tsx"
        $viewPageFile = Join-Path $componentsDir "$itemName-view-page.tsx"
        
        New-Item -ItemType File -Path $formFile -Force | Out-Null
        New-Item -ItemType File -Path $listingFile -Force | Out-Null
        New-Item -ItemType File -Path $viewPageFile -Force | Out-Null
        
        # Create tables directory (optional)
        $tablesDir = Join-Path $componentsDir "$itemName-tables"
        New-Item -ItemType Directory -Path $tablesDir -Force | Out-Null
        
        # Create table files
        $columnsFile = Join-Path $tablesDir "columns.tsx"
        $dataTableFile = Join-Path $tablesDir "data-table.tsx"
        $indexFile = Join-Path $tablesDir "index.tsx"
        
        New-Item -ItemType File -Path $columnsFile -Force | Out-Null
        New-Item -ItemType File -Path $dataTableFile -Force | Out-Null
        New-Item -ItemType File -Path $indexFile -Force | Out-Null
        
        # Create types directory
        $typesDir = Join-Path $itemDir "types"
        New-Item -ItemType Directory -Path $typesDir -Force | Out-Null
        
        # Create types file
        $typesFile = Join-Path $typesDir "$itemName.ts"
        New-Item -ItemType File -Path $typesFile -Force | Out-Null
        
        # Create utils directory
        $utilsDir = Join-Path $itemDir "utils"
        New-Item -ItemType Directory -Path $utilsDir -Force | Out-Null
        
        # Create utils file
        $utilsFile = Join-Path $utilsDir "$itemName.ts"
        New-Item -ItemType File -Path $utilsFile -Force | Out-Null
        
        Write-Host "  Created: $itemName" -ForegroundColor Cyan
    }
}

# Define the navigation structure based on the data.ts file
$navStructure = @(
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
    }
)

# Create base features directory
if (!(Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir -Force | Out-Null
    Write-Host "Created base features directory: $baseDir" -ForegroundColor Green
}

# Create structure for each feature
foreach ($feature in $navStructure) {
    Create-FeatureStructure -featureTitle $feature.title -subItems $feature.items
}

Write-Host "`nFeature folder structure created successfully!" -ForegroundColor Green
Write-Host "Total features created: $($navStructure.Count)" -ForegroundColor Cyan

# Display the created structure
Write-Host "`nCreated folder structure:" -ForegroundColor Yellow
Get-ChildItem -Path $baseDir -Recurse -Directory | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, "").TrimStart('\')
    $indent = "  " * ($relativePath.Split('\').Count - 3)
    Write-Host "$indent$($_.Name)" -ForegroundColor White
}

Write-Host "`nScript completed successfully!" -ForegroundColor Green 