# Template Types & API Guide

This document explains the two types of email templates available in Jamail: **Builder Templates** and **Basic Templates**. It covers their differences, data structures, and how to use the API for each.

## Overview

| Feature | Builder Template | Basic Template |
| :--- | :--- | :--- |
| **Creation Method** | Drag & Drop Editor | HTML Upload / Code Editor |
| **Data Source** | JSON Schema (`schema`) | HTML String (`htmlContent`) |
| **Flexibility** | Structured, Component-based | Unlimited (Custom HTML/CSS) |
| **Target User** | Marketers, Non-technical users | Developers, Designers |

---

## 1. Builder Templates (Drag & Drop)

Builder templates are created using the visual Drag & Drop editor. They are stored as a structured JSON object, which allows the system to reconstruct the UI for editing and render it to HTML for sending.

### Data Structure
Builder templates rely on the `schema` field in the `Template` and `TemplateVersion` models.

```json
{
  "schema": {
    "sections": [
      {
        "id": "section-1",
        "backgroundColor": "#ffffff",
        "columns": [
          {
            "id": "column-1",
            "blocks": [
              {
                "type": "text",
                "content": "Hello World",
                "styles": { "color": "#000000" }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### API Usage

#### Create / Update
When creating or updating a builder template, you must provide the `schema` object.

**Endpoint:** `PATCH /api/templates/:id`

```json
// Request Body
{
  "schema": {
    "sections": [...]
  }
  // htmlContent is NOT required here; the backend can generate it from schema
}
```

> **Note:** The backend `HtmlRenderService` automatically converts this `schema` into HTML when sending the email.

---

## 2. Basic Templates (HTML)

Basic templates are standard HTML email templates. They are stored directly as an HTML string. These are useful when you have an existing HTML file or need complex custom styling that the builder doesn't support.

### Data Structure
Basic templates rely on the `htmlContent` field.

```html
<!-- htmlContent -->
<!DOCTYPE html>
<html>
<body>
  <h1>Hello {{name}}</h1>
  <p>Welcome to our service.</p>
</body>
</html>
```

### API Usage

#### Create / Update
When creating or updating a basic template, provide the `htmlContent` string.

**Endpoint:** `PATCH /api/templates/:id`

```json
// Request Body
{
  "htmlContent": "<!DOCTYPE html><html>...</html>",
  "schema": null // Schema should be null or omitted
}
```

---

## 3. Rendering & Sending

Regardless of the template type, the final output for sending an email is HTML.

*   **Builder Templates**: The system first converts `schema` -> `htmlContent` (using `HtmlRenderService`), then replaces variables (Handlebars).
*   **Basic Templates**: The system uses the provided `htmlContent` directly and replaces variables.

### Preview API
**Endpoint:** `POST /api/templates/preview`

The preview endpoint works for both, but the input differs slightly in origin:

*   **From Builder**: The frontend typically sends the *generated* HTML from the current schema state, or the backend generates it.
*   **From Code Editor**: The frontend sends the raw HTML string.

## Summary

*   Use **Builder Templates** (`schema`) for ease of use and consistent design.
*   Use **Basic Templates** (`htmlContent`) for maximum control and custom HTML.
*   The API distinguishes them primarily by which field (`schema` vs `htmlContent`) is being populated.
