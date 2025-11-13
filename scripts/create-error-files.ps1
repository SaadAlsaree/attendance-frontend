# PowerShell script to create error.tsx files for all routes
# Run this script from the project root directory

Write-Host "Creating error.tsx files for all routes..." -ForegroundColor Green

# Base directory
$baseDir = "src/app/(routes)"

# Function to convert title to lowercase kebab-case
function Convert-ToKebabCase {
  param([string]$title)
  return $title.ToLower() -replace '\s+', '-' -replace '[^a-z0-9\-]', ''
}

# Function to get route path
function Get-RoutePath {
  param([string]$fullPath)
  $relativePath = $fullPath.Replace((Get-Location).Path, "").TrimStart('\')
  $routePath = $relativePath.Replace('src\app\(routes)\', '').Replace('\error.tsx', '')
  return $routePath
}

# Error component template
$errorTemplate = @"
'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className='absolute top-1/2 left-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent'>
        500
      </span>
      <h2 className='font-heading my-2 text-2xl font-bold'>حدث خطأ</h2>
      <p>عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.</p>
      <div className='mt-8 flex justify-center gap-2'>
        <Button onClick={() => reset()} variant='default' size='lg'>
          إعادة المحاولة
        </Button>
        <Button onClick={() => router.back()} variant='outline' size='lg'>
          الرجوع
        </Button>
        <Button
          onClick={() => router.push('/dashboard')}
          variant='ghost'
          size='lg'
        >
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
"@

# Function to create error file
function Create-ErrorFile {
  param([string]$filePath)
  Write-Host "Creating error file: $filePath" -ForegroundColor Cyan
  Set-Content -Path $filePath -Value $errorTemplate -Encoding UTF8
  Write-Host "  ✓ Created: $filePath" -ForegroundColor Green
}

Write-Host "`nScanning for error.tsx files..." -ForegroundColor Yellow

$errorFiles = Get-ChildItem -Path $baseDir -Recurse -Name "error.tsx" -ErrorAction SilentlyContinue

if ($errorFiles.Count -eq 0) {
  Write-Host "No error.tsx files found. Creating them based on route structure..." -ForegroundColor Yellow
  $directories = Get-ChildItem -Path $baseDir -Recurse -Directory
  foreach ($dir in $directories) {
    $errorFilePath = Join-Path $dir.FullName "error.tsx"
    if (!(Test-Path $errorFilePath)) {
      Create-ErrorFile -filePath $errorFilePath
    }
  }
}
else {
  Write-Host "Found $($errorFiles.Count) existing error.tsx files. Updating them..." -ForegroundColor Yellow
  foreach ($errorFile in $errorFiles) {
    $fullPath = Join-Path (Get-Location).Path "src\app\(routes)\$errorFile"
    Create-ErrorFile -filePath $fullPath
  }
}

Write-Host "`nError files creation completed!" -ForegroundColor Green
$totalErrorFiles = (Get-ChildItem -Path $baseDir -Recurse -Name "error.tsx" -ErrorAction SilentlyContinue).Count
Write-Host "Total error.tsx files: $totalErrorFiles" -ForegroundColor Cyan
Write-Host "`nScript completed successfully!" -ForegroundColor Green 