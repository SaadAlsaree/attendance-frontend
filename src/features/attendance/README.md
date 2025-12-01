# Attendance Feature

This directory contains the complete attendance management feature for the frontend application, including types, validation, and API services.

## Structure

```
attendance/
├── api/
│   ├── attendance.service.ts    # API service for attendance operations
│   └── index.ts                 # Export file
├── types/
│   ├── attendance.ts            # TypeScript interfaces and types
│   └── index.ts                 # Export file
├── utils/
│   ├── validation.ts            # Zod validation schemas and functions
│   └── index.ts                 # Export file
├── examples/
│   └── usage-example.ts         # Usage examples
└── README.md                    # This file
```

## Features

### Types (`types/attendance.ts`)

- **Enums**: `AttendanceStatus` and `LogMethod` matching backend enums
- **Interfaces**: Complete type definitions for all attendance operations
- **Request Types**: Type-safe request interfaces for all API calls
- **Response Types**: Type-safe response interfaces matching backend responses

### Validation (`utils/validation.ts`)

- **Zod Schemas**: Comprehensive validation for all attendance operations
- **Validation Functions**: Type-safe validation functions
- **Helper Functions**: Utility functions for date, coordinate, and time validation
- **Error Messages**: Centralized error message constants

### API Service (`api/attendance.service.ts`)

- **Server-side Methods**: Using `axiosInstance` for server-side rendering
- **Client-side Methods**: Using `axiosClient` for client-side components
- **CRUD Operations**: Complete Create, Read, Update, Delete operations
- **Special Operations**: Check-in, Check-out, and Approval functionality
- **Error Handling**: Comprehensive error handling with logging

## Usage Examples

### Basic CRUD Operations

```typescript
import { attendanceService } from '@/features/attendance/api';
import { validateCreateAttendance } from '@/features/attendance/utils';
import { AttendanceStatus } from '@/features/attendance/types';

// Create attendance
const createAttendance = async () => {
  const data = {
    employeeId: 'uuid',
    organizationId: 'uuid',
    date: '2024-01-15T00:00:00Z',
    notes: 'Regular attendance'
  };

  const validation = validateCreateAttendance(data);
  if (!validation.success) {
    console.error('Validation failed:', validation.error);
    return;
  }

  const result = await attendanceService.createAttendance(data);
  return result;
};

// Get attendance list
const getAttendanceList = async () => {
  const query = {
    page: 1,
    pageSize: 10,
    employeeId: 'uuid',
    organizationId: 'uuid',
    date: '2024-01-15T00:00:00Z',
    status: AttendanceStatus.Present,
    shiftId: 'uuid',
    searchTerm: 'search term',
    sortBy: 'date',
    sortOrder: 'desc'
  };

  const result = await attendanceService.getAttendanceList(query);
  return result;
};
```

### Check-in/Check-out Operations

```typescript
import { attendanceService } from '@/features/attendance/api';
import { LogMethod } from '@/features/attendance/types';

// Check in
const checkIn = async () => {
  const checkInData = {
    employeeId: 'uuid',
    attendanceId: 'uuid',
    checkInTime: new Date().toISOString(),
    location: 'Office Building A',
    latitude: 40.7128,
    longitude: -74.006,
    logMethod: LogMethod.Mobile_App.toString(),
    notes: 'Checked in via mobile app'
  };

  const result = await attendanceService.checkIn(checkInData);
  return result;
};

// Check out
const checkOut = async () => {
  const checkOutData = {
    employeeId: 'uuid',
    attendanceId: 'uuid',
    checkOutTime: new Date().toISOString(),
    location: 'Office Building A',
    latitude: 40.7128,
    longitude: -74.006,
    logMethod: LogMethod.Mobile_App.toString(),
    notes: 'Checked out via mobile app'
  };

  const result = await attendanceService.checkOut(checkOutData);
  return result;
};
```

### Approval Operations

```typescript
import { attendanceService } from '@/features/attendance/api';

// Approve attendance
const approveAttendance = async (id: string) => {
  const approveData = {
    approvedBy: 'uuid',
    approvalNotes: 'Attendance approved by supervisor'
  };

  const result = await attendanceService.approveAttendance(id, approveData);
  return result;
};
```

## API Endpoints

The service maps to the following backend endpoints:

- `GET /attendance` - Get attendance list with filters
- `GET /attendance/{id}` - Get attendance by ID
- `POST /attendance` - Create new attendance record
- `PUT /attendance/{id}` - Update attendance record
- `DELETE /attendance/{id}` - Delete attendance record
- `POST /attendance/check-in` - Check in attendance
- `POST /attendance/check-out` - Check out attendance
- `POST /attendance/{id}/approve` - Approve attendance

## Validation

All data is validated using Zod schemas before being sent to the API:

- **Create/Update**: Validates required fields and data types
- **Check-in/Check-out**: Validates coordinates, UUIDs, and required fields
- **Query Parameters**: Validates pagination, date, and filters
- **Approval**: Validates approver ID and optional notes

## Error Handling

The service includes comprehensive error handling:

- **Network Errors**: Logged and handled gracefully
- **Validation Errors**: Returned with detailed error messages
- **API Errors**: Status codes and error messages logged
- **Type Safety**: Full TypeScript support with proper error types

## Client vs Server Usage

- **Server-side**: Use methods without "Client" suffix (e.g., `getAttendanceList`)
- **Client-side**: Use methods with "Client" suffix (e.g., `getAttendanceListClient`)

This ensures proper authentication token handling for both server-side rendering and client-side components.
