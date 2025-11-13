# Users Permissions Feature

This feature provides user management functionality including password management dialogs.

## Components

### Password Management Dialogs

#### ChangePasswordDialog

A dialog component for users to change their own password.

**Props:**

- `isOpen: boolean` - Controls dialog visibility
- `onClose: () => void` - Callback when dialog is closed
- `onSuccess?: () => void` - Optional callback when password is changed successfully

**Usage:**

```tsx
import { ChangePasswordDialog } from '@/features/system/users-permissions/components';

const [changePasswordOpen, setChangePasswordOpen] = useState(false);

<ChangePasswordDialog
  isOpen={changePasswordOpen}
  onClose={() => setChangePasswordOpen(false)}
  onSuccess={() => {
    // Handle success
    console.log('Password changed successfully');
  }}
/>;
```

#### ResetPasswordDialog

A dialog component for administrators to reset other users' passwords.

**Props:**

- `isOpen: boolean` - Controls dialog visibility
- `onClose: () => void` - Callback when dialog is closed
- `onSuccess?: () => void` - Optional callback when password is reset successfully
- `user?: UserPermission` - The user whose password will be reset

**Usage:**

```tsx
import { ResetPasswordDialog } from '@/features/system/users-permissions/components';

const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
const selectedUser = { id: '123', username: 'john.doe', userLogin: 'johndoe' };

<ResetPasswordDialog
  isOpen={resetPasswordOpen}
  onClose={() => setResetPasswordOpen(false)}
  onSuccess={() => {
    // Handle success
    console.log('Password reset successfully');
  }}
  user={selectedUser}
/>;
```

#### PasswordActions

A convenience component that provides buttons to open both password dialogs.

**Props:**

- `user?: UserPermission` - Optional user for reset password functionality
- `onSuccess?: () => void` - Optional callback when any password action succeeds

**Usage:**

```tsx
import { PasswordActions } from '@/features/system/users-permissions/components';

// For current user (change password only)
<PasswordActions onSuccess={() => console.log('Password action completed')} />

// For admin managing other users (both change and reset password)
<PasswordActions
  user={selectedUser}
  onSuccess={() => console.log('Password action completed')}
/>
```

## Features

### Change Password Dialog

- ✅ Current password validation
- ✅ New password requirements (minimum 8 characters)
- ✅ Password confirmation matching
- ✅ Show/hide password toggles
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Form validation with Zod schema
- ✅ RTL support with Arabic text

### Reset Password Dialog

- ✅ User information display
- ✅ New password requirements (minimum 8 characters)
- ✅ Password confirmation matching
- ✅ Show/hide password toggles
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Form validation with Zod schema
- ✅ RTL support with Arabic text

## API Integration

Both dialogs use the existing `usersPermissionsService`:

- `changePassword()` - For changing current user's password
- `resetPassword()` - For resetting other users' passwords

The dialogs automatically handle:

- API calls with proper error handling
- Loading states during API calls
- Success/error toast notifications
- Form reset on success
- Dialog closure on success

## Styling

The dialogs use shadcn/ui components and follow the project's design system:

- Consistent spacing and typography
- RTL layout support
- Responsive design
- Accessible form controls
- Loading indicators
- Icon integration with Lucide React

## Form Validation

Both dialogs use Zod schemas for validation:

- Required field validation
- Password length requirements
- Password confirmation matching
- Real-time validation feedback
