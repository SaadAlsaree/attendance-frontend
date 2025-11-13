import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";

export default function schedulereportsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Reports</h1>
          <p className="text-muted-foreground">
            View schedule reports and analytics
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Reports</CardTitle>
          <CardDescription>
            View schedule reports and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="mx-auto h-12 w-12 mb-4" />
            <p>No data found</p>
            <p className="text-sm">Create your first entry to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
