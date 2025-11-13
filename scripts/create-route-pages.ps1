# PowerShell script to create route pages and error files
# This script will generate all missing page.tsx and error.tsx files for the routes structure

$basePath = "src/app/(routes)"

# Function to create a simple page component
function Create-PageComponent {
    param(
        [string]$RouteName,
        [string]$Title,
        [string]$Description,
        [string]$Icon
    )
    
    $content = @"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, $Icon } from "lucide-react";

export default function ${RouteName}Page() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">$Title</h1>
          <p className="text-muted-foreground">
            $Description
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>$Title</CardTitle>
          <CardDescription>
            $Description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <$Icon className="mx-auto h-12 w-12 mb-4" />
            <p>No data found</p>
            <p className="text-sm">Create your first entry to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"@
    return $content
}

# Function to create a simple error component
function Create-ErrorComponent {
    param(
        [string]$RouteName
    )
    
    $content = @"
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ${RouteName}Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Something went wrong!</CardTitle>
            <CardDescription>
              There was an error loading the $RouteName page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Error: {error.message}</p>
              {error.digest && (
                <p className="mt-2 text-xs">Error ID: {error.digest}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={reset} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" className="flex-1">
                Go back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"@
    return $content
}

# Function to create a simple detail page component
function Create-DetailPageComponent {
    param(
        [string]$RouteName,
        [string]$Title
    )
    
    $content = @"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function ${RouteName}DetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">$Title Details</h1>
            <p className="text-muted-foreground">
              ID: {params.id}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>$Title Information</CardTitle>
          <CardDescription>
            Detailed information about this $Title
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">ID</label>
              <p className="text-sm text-muted-foreground">{params.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-muted-foreground">Sample Name</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"@
    return $content
}

# Function to create a simple new page component
function Create-NewPageComponent {
    param(
        [string]$RouteName,
        [string]$Title
    )
    
    $content = @"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export default function ${RouteName}NewPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New $Title</h1>
            <p className="text-muted-foreground">
              Add a new $Title to the system
            </p>
          </div>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New $Title</CardTitle>
          <CardDescription>
            Fill in the details to create a new $Title
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input 
                type="text" 
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter description"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"@
    return $content
}

# Function to create a simple edit page component
function Create-EditPageComponent {
    param(
        [string]$RouteName,
        [string]$Title
    )
    
    $content = @"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export default function ${RouteName}EditPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit $Title</h1>
            <p className="text-muted-foreground">
              ID: {params.id}
            </p>
          </div>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit $Title</CardTitle>
          <CardDescription>
            Update the details for this $Title
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input 
                type="text" 
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter name"
                defaultValue="Sample Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter description"
                defaultValue="Sample description"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"@
    return $content
}

# Define the route structure with metadata
$routes = @{
    "schedule"   = @{
        "assign-schedules"   = @{ Title = "Assign Schedules"; Description = "Manage employee schedule assignments"; Icon = "Calendar" }
        "create-schedules"   = @{ Title = "Create Schedules"; Description = "Create new work schedules"; Icon = "Clock" }
        "schedule-reports"   = @{ Title = "Schedule Reports"; Description = "View schedule reports and analytics"; Icon = "BarChart3" }
        "schedule-templates" = @{ Title = "Schedule Templates"; Description = "Manage schedule templates"; Icon = "FileText" }
    }
    "reports"    = @{
        "attendance-reports" = @{ Title = "Attendance Reports"; Description = "View attendance reports and analytics"; Icon = "Users" }
        "export-data"        = @{ Title = "Export Data"; Description = "Export attendance and employee data"; Icon = "Download" }
        "late-reports"       = @{ Title = "Late Reports"; Description = "View late arrival reports"; Icon = "Clock" }
        "leave-reports"      = @{ Title = "Leave Reports"; Description = "View leave request reports"; Icon = "Calendar" }
        "overtime-reports"   = @{ Title = "Overtime Reports"; Description = "View overtime reports and analytics"; Icon = "Timer" }
    }
    "profile"    = @{
        "change-password" = @{ Title = "Change Password"; Description = "Update your account password"; Icon = "Lock" }
        "edit-profile"    = @{ Title = "Edit Profile"; Description = "Update your profile information"; Icon = "User" }
        "settings"        = @{ Title = "Settings"; Description = "Manage your account settings"; Icon = "Settings" }
        "view-profile"    = @{ Title = "View Profile"; Description = "View your profile information"; Icon = "User" }
    }
    "leave"      = @{
        "approvereject-leaves" = @{ Title = "Approve/Reject Leaves"; Description = "Review and manage leave requests"; Icon = "CheckCircle" }
        "leave-policies"       = @{ Title = "Leave Policies"; Description = "Manage leave policies and rules"; Icon = "FileText" }
        "leave-reports"        = @{ Title = "Leave Reports"; Description = "View leave reports and analytics"; Icon = "BarChart3" }
        "leave-requests"       = @{ Title = "Leave Requests"; Description = "Submit and manage leave requests"; Icon = "Calendar" }
    }
    "employee"   = @{
        "addedit-employees"  = @{ Title = "Add/Edit Employees"; Description = "Manage employee information"; Icon = "UserPlus" }
        "assign-managers"    = @{ Title = "Assign Managers"; Description = "Assign managers to employees"; Icon = "Users" }
        "employee-directory" = @{ Title = "Employee Directory"; Description = "Browse employee directory"; Icon = "BookOpen" }
        "employee-schedules" = @{ Title = "Employee Schedules"; Description = "Manage employee work schedules"; Icon = "Calendar" }
    }
    "attendance" = @{
        "approvereject-records" = @{ Title = "Approve/Reject Records"; Description = "Review and approve attendance records"; Icon = "CheckCircle" }
        "attendance-logs"       = @{ Title = "Attendance Logs"; Description = "View attendance logs and history"; Icon = "List" }
        "manual-corrections"    = @{ Title = "Manual Corrections"; Description = "Make manual attendance corrections"; Icon = "Edit" }
        "view-all-attendance"   = @{ Title = "View All Attendance"; Description = "View all attendance records"; Icon = "Eye" }
    }
    "system"     = @{
        "devices"              = @{ Title = "Devices"; Description = "Manage attendance devices"; Icon = "Smartphone" }
        "organizationsunits"   = @{ Title = "Organizational Units"; Description = "Manage organizational structure"; Icon = "Building2" }
        "system-configuration" = @{ Title = "System Configuration"; Description = "Configure system settings"; Icon = "Settings" }
        "users--permissions"   = @{ Title = "Users & Permissions"; Description = "Manage users and permissions"; Icon = "Shield" }
        "work-locations"       = @{ Title = "Work Locations"; Description = "Manage work locations"; Icon = "MapPin" }
    }
}

# Create files for each route
foreach ($mainRoute in $routes.Keys) {
    $mainRoutePath = Join-Path $basePath $mainRoute
    
    foreach ($subRoute in $routes[$mainRoute].Keys) {
        $subRoutePath = Join-Path $mainRoutePath $subRoute
        $routeData = $routes[$mainRoute][$subRoute]
        
        # Create main page
        $pagePath = Join-Path $subRoutePath "page.tsx"
        $pageContent = Create-PageComponent -RouteName $subRoute.Replace("-", "") -Title $routeData.Title -Description $routeData.Description -Icon $routeData.Icon
        Set-Content -Path $pagePath -Value $pageContent
        
        # Create error page
        $errorPath = Join-Path $subRoutePath "error.tsx"
        $errorContent = Create-ErrorComponent -RouteName $subRoute.Replace("-", "")
        Set-Content -Path $errorPath -Value $errorContent
        
        # Create [id] directory and files
        $idPath = Join-Path $subRoutePath "[id]"
        if (!(Test-Path $idPath)) {
            New-Item -ItemType Directory -Path $idPath -Force
        }
        
        $idPagePath = Join-Path $idPath "page.tsx"
        $idPageContent = Create-DetailPageComponent -RouteName $subRoute.Replace("-", "") -Title $routeData.Title
        Set-Content -Path $idPagePath -Value $idPageContent
        
        # Create edit directory and files
        $editPath = Join-Path $idPath "edit"
        if (!(Test-Path $editPath)) {
            New-Item -ItemType Directory -Path $editPath -Force
        }
        
        $editPagePath = Join-Path $editPath "page.tsx"
        $editPageContent = Create-EditPageComponent -RouteName $subRoute.Replace("-", "") -Title $routeData.Title
        Set-Content -Path $editPagePath -Value $editPageContent
        
        # Create new directory and files
        $newPath = Join-Path $subRoutePath "new"
        if (!(Test-Path $newPath)) {
            New-Item -ItemType Directory -Path $newPath -Force
        }
        
        $newPagePath = Join-Path $newPath "page.tsx"
        $newPageContent = Create-NewPageComponent -RouteName $subRoute.Replace("-", "") -Title $routeData.Title
        Set-Content -Path $newPagePath -Value $newPageContent
    }
}

Write-Host "All route pages and error files have been created successfully!" -ForegroundColor Green 