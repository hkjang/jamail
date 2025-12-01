# Permission Management Guide

Jamail uses a **Role-Based Access Control (RBAC)** system to manage user permissions. Each user is assigned a role, which determines the features and data they can access.

## 1. Roles

There are three primary roles in the system:

### 👑 Admin
- Has **full access** to everything.
- Can access and modify sensitive information such as system settings, user management, and SMTP configurations.
- Destructive actions like deleting templates are restricted to Admins only.

### 🛠️ Operator
- Has permissions necessary for **daily operations**.
- Can create/edit templates, send emails, and manage webhooks.
- Does not have permission to manage system settings, users, or delete templates.

### 👁️ Viewer
- Has **read-only** access.
- Can view template lists, details, and statistics.
- Cannot modify data or send emails.

## 2. Scopes

Each role is associated with specific permission scopes.

| Feature Area | Scope | Description |
|---|---|---|
| **Templates** | `read_templates` | View template lists and details |
| | `write_templates` | Create, edit, and version templates |
| | `delete_templates` | Delete templates (Admin only) |
| | `send_email` | Test and send emails |
| **Webhooks** | `read_webhooks` | View webhook lists and details |
| | `manage_webhooks` | Create, edit, delete, and test webhooks |
| **Settings** | `read_settings` | View system settings (e.g., SMTP) |
| | `manage_settings` | Modify system settings (Admin only) |

## 3. Capability Matrix

| Feature | Admin | Operator | Viewer |
|---|:---:|:---:|:---:|
| **View Templates** | ✅ | ✅ | ✅ |
| **Create/Edit Templates** | ✅ | ✅ | ❌ |
| **Delete Templates** | ✅ | ❌ | ❌ |
| **Send Emails** | ✅ | ✅ | ❌ |
| **Manage Webhooks** | ✅ | ✅ | ❌ |
| **Manage API Keys** | ✅ | ✅ | ❌ |
| **SMTP Settings** | ✅ | ❌ | ❌ |
| **User Management** | ✅ | ❌ | ❌ |

## 4. API Key Permissions

The same role-based permissions apply when creating API keys. For security reasons, it is recommended to use API keys with the minimum necessary permissions (e.g., Operator role for sending emails) when integrating with external systems.
