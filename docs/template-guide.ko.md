# 템플릿 유형 및 API 가이드

이 문서는 Jamail에서 사용할 수 있는 두 가지 이메일 템플릿 유형인 **빌더 템플릿(Builder Templates)**과 **기본 템플릿(Basic Templates)**에 대해 설명합니다. 각 템플릿의 차이점, 데이터 구조, 그리고 API 사용법을 다룹니다.

## 개요 (Overview)

| 기능 | 빌더 템플릿 (Builder Template) | 기본 템플릿 (Basic Template) |
| :--- | :--- | :--- |
| **생성 방식** | 드래그 앤 드롭 에디터 | HTML 업로드 / 코드 에디터 |
| **데이터 소스** | JSON 스키마 (`schema`) | HTML 문자열 (`htmlContent`) |
| **유연성** | 구조화됨, 컴포넌트 기반 | 무제한 (커스텀 HTML/CSS) |
| **대상 사용자** | 마케터, 비개발자 | 개발자, 디자이너 |

---

## 1. 빌더 템플릿 (Drag & Drop)

빌더 템플릿은 시각적인 드래그 앤 드롭 에디터를 사용하여 생성됩니다. 구조화된 JSON 객체로 저장되며, 시스템은 이를 통해 편집 UI를 재구성하거나 발송용 HTML로 렌더링합니다.

### 데이터 구조 (Data Structure)
빌더 템플릿은 `Template` 및 `TemplateVersion` 모델의 `schema` 필드를 사용합니다.

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

### API 사용법 (API Usage)

#### 생성 / 수정 (Create / Update)
빌더 템플릿을 생성하거나 수정할 때는 `schema` 객체를 제공해야 합니다.

**엔드포인트:** `PATCH /api/templates/:id`

```json
// 요청 본문 (Request Body)
{
  "schema": {
    "sections": [...]
  }
  // htmlContent는 여기서 필수 항목이 아닙니다. 백엔드가 schema로부터 생성할 수 있습니다.
}
```

> **참고:** 이메일 발송 시 백엔드의 `HtmlRenderService`가 자동으로 이 `schema`를 HTML로 변환합니다.

---

## 2. 기본 템플릿 (HTML)

기본 템플릿은 표준 HTML 이메일 템플릿입니다. HTML 문자열로 직접 저장됩니다. 기존 HTML 파일이 있거나, 빌더가 지원하지 않는 복잡한 커스텀 스타일이 필요한 경우 유용합니다.

### 데이터 구조 (Data Structure)
기본 템플릿은 `htmlContent` 필드를 사용합니다.

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

### API 사용법 (API Usage)

#### 생성 / 수정 (Create / Update)
기본 템플릿을 생성하거나 수정할 때는 `htmlContent` 문자열을 제공해야 합니다.

**엔드포인트:** `PATCH /api/templates/:id`

```json
// 요청 본문 (Request Body)
{
  "htmlContent": "<!DOCTYPE html><html>...</html>",
  "schema": null // 스키마는 null이거나 생략해야 합니다.
}
```

---

## 3. 렌더링 및 발송 (Rendering & Sending)

템플릿 유형에 관계없이, 이메일 발송을 위한 최종 결과물은 HTML입니다.

*   **빌더 템플릿**: 시스템이 먼저 `schema` -> `htmlContent`로 변환하고 (`HtmlRenderService` 사용), 변수(Handlebars)를 치환합니다.
*   **기본 템플릿**: 시스템이 제공된 `htmlContent`를 직접 사용하고 변수를 치환합니다.

### 미리보기 API (Preview API)
**엔드포인트:** `POST /api/templates/preview`

미리보기 엔드포인트는 두 유형 모두에 대해 작동하지만, 입력 출처가 약간 다릅니다:

*   **빌더에서**: 프런트엔드가 현재 스키마 상태에서 *생성된* HTML을 보내거나, 백엔드가 생성합니다.
*   **코드 에디터에서**: 프런트엔드가 원본 HTML 문자열을 보냅니다.

## 요약 (Summary)

*   사용 편의성과 일관된 디자인을 위해서는 **빌더 템플릿** (`schema`)을 사용하세요.
*   최대 제어권과 커스텀 HTML이 필요하다면 **기본 템플릿** (`htmlContent`)을 사용하세요.
*   API는 주로 어떤 필드(`schema` vs `htmlContent`)가 채워지는지에 따라 이들을 구분합니다.
