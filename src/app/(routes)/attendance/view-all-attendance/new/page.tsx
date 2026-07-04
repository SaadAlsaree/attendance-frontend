import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { usersPermissionsService } from "@/features/system/users-permissions/api/users-permissions.service";
import { Role } from "@/features/system/users-permissions/types/users-permissions";
import { hasAnyRole } from "@/utils/auth/auth-utils";
import { redirect } from "next/navigation";

export default async function viewallattendanceNewPage() {
    const data = await usersPermissionsService.getCurrentUser();
        
    const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager, Role.OrgSupervisor]);
        
        
    // redirect to home if user is not authorized
          if (!canAdd) {
              redirect('/');
          }
    
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New View All Attendance</h1>
            <p className="text-muted-foreground">
              Add a new View All Attendance to the system
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
          <CardTitle>New View All Attendance</CardTitle>
          <CardDescription>
            Fill in the details to create a new View All Attendance
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
