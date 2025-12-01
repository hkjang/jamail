# API Reference

## Authentication

All endpoints except `POST /auth/login` and `POST /auth/register` require authentication via JWT (Bearer Token) or API Key.

### Users

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user (Admin only) | `ADMIN` |
| `POST` | `/auth/login` | Login and receive JWT token | Public |
| `GET` | `/auth/me` | Get current user profile | Any |
| `GET` | `/auth/users` | List all users | `ADMIN`, `OPERATOR` |
| `GET` | `/auth/users/:id` | Get user by ID | `ADMIN`, `OPERATOR` |
| `PATCH` | `/auth/users/:id` | Update user | `ADMIN` |
| `DELETE` | `/auth/users/:id` | Delete user | `ADMIN` |

### API Keys

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/api-keys` | Create a new API key | `ADMIN`, `OPERATOR` |
| `GET` | `/auth/api-keys` | List all API keys | `ADMIN`, `OPERATOR` |
| `GET` | `/auth/api-keys/:id` | Get API key details | `ADMIN`, `OPERATOR` |
| `PATCH` | `/auth/api-keys/:id` | Update API key | `ADMIN`, `OPERATOR` |
| `DELETE` | `/auth/api-keys/:id` | Delete API key | `ADMIN`, `OPERATOR` |

---

## Templates

Base URL: `/templates`

| Method | Endpoint | Description | Roles | Scopes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a new template | `ADMIN`, `OPERATOR` | `write_templates` |
| `GET` | `/` | List all templates | Any | `read_templates` |
| `GET` | `/:id` | Get template details | Any | `read_templates` |
| `PATCH` | `/:id` | Update template | `ADMIN`, `OPERATOR` | `write_templates` |
| `DELETE` | `/:id` | Delete template | `ADMIN` | `delete_templates` |
| `POST` | `/preview` | Preview template with variables | Any | `read_templates` |
| `GET` | `/stats/overview` | Get overall template statistics | Any | `read_templates` |
| `POST` | `/:id/versions` | Create a new version | `ADMIN`, `OPERATOR` | `write_templates` |
| `POST` | `/:id/send` | Send email using template | `ADMIN`, `OPERATOR` | `send_email` |

---

## SMTP Configuration

Base URL: `/smtp`

| Method | Endpoint | Description | Roles | Scopes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Create SMTP config | `ADMIN` | `manage_settings` |
| `GET` | `/` | List SMTP configs | Any | `read_settings` |
| `GET` | `/:id` | Get SMTP config details | Any | `read_settings` |
| `PATCH` | `/:id` | Update SMTP config | `ADMIN` | `manage_settings` |
| `DELETE` | `/:id` | Delete SMTP config | `ADMIN` | `manage_settings` |
| `POST` | `/:id/test` | Test SMTP connection | `ADMIN` | `manage_settings` |

---

## Webhooks

Base URL: `/webhooks`

| Method | Endpoint | Description | Roles | Scopes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Create webhook | `ADMIN`, `OPERATOR` | `manage_webhooks` |
| `GET` | `/` | List webhooks | Any | `read_webhooks` |
| `GET` | `/:id` | Get webhook details | Any | `read_webhooks` |
| `PATCH` | `/:id` | Update webhook | `ADMIN`, `OPERATOR` | `manage_webhooks` |
| `DELETE` | `/:id` | Delete webhook | `ADMIN`, `OPERATOR` | `manage_webhooks` |
| `GET` | `/:id/deliveries` | Get webhook delivery history | Any | `read_webhooks` |
| `POST` | `/:id/test` | Test webhook delivery | `ADMIN`, `OPERATOR` | `manage_webhooks` |

---

## A/B Testing

Base URL: `/ab-testing`

| Method | Endpoint | Description | Roles | Scopes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/templates/:id/variants` | Create A/B test variant | `ADMIN`, `OPERATOR` | `write_templates` |
| `GET` | `/templates/:id/variants` | Get variants for template | Any | `read_templates` |
| `PATCH` | `/variants/:id/traffic-split` | Update traffic split | `ADMIN`, `OPERATOR` | `write_templates` |
| `GET` | `/templates/:id/results` | Get A/B test results | Any | `read_templates` |
| `POST` | `/templates/:id/declare-winner` | Declare winning variant | `ADMIN`, `OPERATOR` | `write_templates` |
| `POST` | `/track/:versionId/:event` | Track open/click event | Public | N/A |

---

## Translations

Base URL: `/templates/:id/translations`

| Method | Endpoint | Description | Roles | Scopes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Add translation | `ADMIN`, `OPERATOR` | `write_templates` |
| `GET` | `/` | List translations | Any | `read_templates` |
| `GET` | `/:lang` | Get specific translation | Any | `read_templates` |
| `PUT` | `/:lang` | Update translation | `ADMIN`, `OPERATOR` | `write_templates` |
| `DELETE` | `/:lang` | Delete translation | `ADMIN`, `OPERATOR` | `write_templates` |
| `POST` | `/:lang/set-default` | Set default language | `ADMIN`, `OPERATOR` | `write_templates` |
