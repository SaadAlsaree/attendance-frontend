# PowerShell script to fix empty pages
# This script will create basic view page components and route pages for all empty files

$features = @(
    @{feature="assign-managers"; title="تعيين المدراء"; description="إدارة تعيين المدراء للموظفين"},
    @{feature="employee-schedules"; title="جداول الموظفين"; description="إدارة جداول عمل الموظفين"},
    @{feature="approvereject-leaves"; title="الموافقة على الإجازات"; description="إدارة الموافقة على طلبات الإجازات"},
    @{feature="leave-policies"; title="سياسات الإجازات"; description="إدارة سياسات الإجازات"},
    @{feature="leave-reports"; title="تقارير الإجازات"; description="عرض تقارير الإجازات"},
    @{feature="leave-requests"; title="طلبات الإجازات"; description="إدارة طلبات الإجازات"},
    @{feature="change-password"; title="تغيير كلمة المرور"; description="تغيير كلمة المرور الحالية"},
    @{feature="edit-profile"; title="تعديل الملف الشخصي"; description="تعديل المعلومات الشخصية"},
    @{feature="settings"; title="الإعدادات"; description="إدارة إعدادات الحساب"},
    @{feature="attendance-reports"; title="تقارير الحضور"; description="عرض تقارير الحضور والانصراف"},
    @{feature="export-data"; title="تصدير البيانات"; description="تصدير البيانات إلى ملفات مختلفة"},
    @{feature="late-reports"; title="تقارير التأخير"; description="عرض تقارير التأخير"},
    @{feature="overtime-reports"; title="تقارير العمل الإضافي"; description="عرض تقارير العمل الإضافي"},
    @{feature="assign-schedules"; title="تعيين الجداول"; description="تعيين جداول العمل للموظفين"},
    @{feature="create-schedules"; title="إنشاء الجداول"; description="إنشاء جداول عمل جديدة"},
    @{feature="schedule-reports"; title="تقارير الجداول"; description="عرض تقارير الجداول"},
    @{feature="schedule-templates"; title="قوالب الجداول"; description="إدارة قوالب الجداول"},
    @{feature="devices"; title="الأجهزة"; description="إدارة أجهزة الحضور والانصراف"},
    @{feature="organizationsunits"; title="الوحدات التنظيمية"; description="إدارة الوحدات التنظيمية"},
    @{feature="system-configuration"; title="إعدادات النظام"; description="إدارة إعدادات النظام"},
    @{feature="users--permissions"; title="المستخدمين والصلاحيات"; description="إدارة المستخدمين والصلاحيات"},
    @{feature="work-locations"; title="مواقع العمل"; description="إدارة مواقع العمل"}
)

foreach ($item in $features) {
    $feature = $item.feature
    $title = $item.title
    $description = $item.description
    
    # Create view page component
    $viewPageContent = @"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function ${($feature -replace '-', ' ' -replace '\b\w', { $args[0].Value.ToUpper() } -replace ' ', '')}ViewPage() {
  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      <Card>
        <CardHeader>
          <CardTitle>$title</CardTitle>
          <CardDescription>$description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <p className='text-muted-foreground'>
              هنا يمكنك $description.ToLower().
            </p>
            {/* TODO: Add $feature functionality */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"@
    
    # Determine the feature path based on the feature name
    $featurePath = ""
    if ($feature -like "*employee*") {
        $featurePath = "employee"
    } elseif ($feature -like "*leave*") {
        $featurePath = "leave"
    } elseif ($feature -like "*attendance*" -or $feature -like "*reports*" -or $feature -like "*export*") {
        $featurePath = "reports"
    } elseif ($feature -like "*schedule*") {
        $featurePath = "schedule"
    } elseif ($feature -like "*profile*" -or $feature -like "*password*" -or $feature -like "*settings*") {
        $featurePath = "profile"
    } elseif ($feature -like "*system*" -or $feature -like "*devices*" -or $feature -like "*organizations*" -or $feature -like "*users*" -or $feature -like "*locations*") {
        $featurePath = "system"
    }
    
    # Create the view page component file
    $viewPagePath = "src/features/$featurePath/$feature/components/$feature-view-page.tsx"
    $viewPageContent | Out-File -FilePath $viewPagePath -Encoding UTF8
    
    # Create the route page
    $routePageContent = @"
import ${($feature -replace '-', ' ' -replace '\b\w', { $args[0].Value.ToUpper() } -replace ' ', '')}ViewPage from '@/features/$featurePath/$feature/components/$feature-view-page';

export default function ${($feature -replace '-', ' ' -replace '\b\w', { $args[0].Value.ToUpper() } -replace ' ', '')}Page() {
  return <${($feature -replace '-', ' ' -replace '\b\w', { $args[0].Value.ToUpper() } -replace ' ', '')}ViewPage />;
}
"@
    
    $routePagePath = "src/app/(routes)/$featurePath/$feature/page.tsx"
    $routePageContent | Out-File -FilePath $routePagePath -Encoding UTF8
    
    Write-Host "Created: $viewPagePath"
    Write-Host "Created: $routePagePath"
}

Write-Host "All empty pages have been fixed!" 