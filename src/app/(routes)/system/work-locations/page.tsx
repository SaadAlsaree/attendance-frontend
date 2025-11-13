import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";

export default function worklocationsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Locations</h1>
          <p className="text-muted-foreground">
            Manage work locations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Locations</CardTitle>
          <CardDescription>
            Manage work locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 mb-4" />
            <p>No data found</p>
            <p className="text-sm">Create your first entry to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
