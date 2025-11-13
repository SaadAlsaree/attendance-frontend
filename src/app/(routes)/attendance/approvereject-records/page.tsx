import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle } from "lucide-react";

export default function approverejectrecordsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approve/Reject Records</h1>
          <p className="text-muted-foreground">
            Review and approve attendance records
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approve/Reject Records</CardTitle>
          <CardDescription>
            Review and approve attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="mx-auto h-12 w-12 mb-4" />
            <p>No data found</p>
            <p className="text-sm">Create your first entry to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
