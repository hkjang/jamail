# Jamail 📧

**Jamail**은 **Next.js 14**와 **NestJS**로 구축된 현대적이고 엔터프라이즈급 이메일 템플릿 관리 시스템입니다. 다국어 지원, A/B 테스팅, Multi-SMTP 라우팅 등 고급 기능을 제공하는 강력한 트랜잭션 이메일 설계 및 발송 인터페이스를 제공합니다.

## 🚀 주요 기능

### 핵심 기능
- **템플릿 관리**: 리치 에디터를 사용한 이메일 템플릿 생성, 편집, 정리
- **버전 관리**: 모든 변경 사항 추적 및 롤백 기능 제공
- **실시간 미리보기**: 동적 변수 치환을 통한 이메일 렌더링 확인
- **이메일 큐**: Redis & BullMQ를 사용한 강력한 백그라운드 처리 및 재시도 로직
- **대시보드**: 이메일 성능 및 시스템 상태에 대한 시각적 분석

### 고급 기능
- **🌐 다국어 지원**: 여러 언어로 템플릿 관리 및 자동 로케일 감지
- **⚖️ A/B 테스팅**: 템플릿 변형을 통한 실험으로 참여도 최적화
- **🔀 Multi-SMTP 라우팅**: 카테고리 기반 SMTP 제공업체 자동 라우팅
- **🔔 웹훅**: 이메일 이벤트(전송, 열람, 클릭, 실패)에 대한 실시간 HTTP 콜백
- **🔒 RBAC & 보안**: 역할 기반 접근 제어(Admin, Operator, Viewer) 및 API 키 관리

## 🛠️ 기술 스택

- **프론트엔드**: Next.js 14 (App Router), TailwindCSS, TypeScript, next-intl
- **백엔드**: NestJS, Prisma ORM, BullMQ
- **데이터베이스**: PostgreSQL
- **캐시/큐**: Redis
- **컨테이너화**: Docker & Docker Compose

## 📦 설치 방법

### 사전 요구사항
- Node.js 18+
- Docker & Docker Compose

### 빠른 시작

1. **저장소 클론**
   ```bash
   git clone https://github.com/yourusername/jamail.git
   cd jamail
   ```

2. **인프라 시작 (DB & Redis)**
   ```bash
   docker-compose up -d
   ```

3. **의존성 설치**
   ```bash
   npm install
   ```

4. **환경 변수 설정**
   `apps/api`와 `apps/web`에서 `.env.example`을 `.env`로 복사하고 데이터베이스 URL을 설정하세요.

5. **마이그레이션 실행**
   ```bash
   cd apps/api
   npx prisma migrate dev
   ```

6. **개발 서버 시작**
   
   **백엔드 (터미널 1):**
   ```bash
   cd apps/api
   npm run start:dev
   ```

   **프론트엔드 (터미널 2):**
   ```bash
   cd apps/web
   npm run dev
   ```

7. **애플리케이션 접속**
   - 프론트엔드: [http://localhost:3000](http://localhost:3000)
   - 백엔드 API: [http://localhost:3001](http://localhost:3001)
   - API 문서 (Swagger): [http://localhost:3001/api](http://localhost:3001/api)

## 📚 문서

`docs` 디렉토리에서 자세한 문서를 확인할 수 있습니다:
- [사용자 가이드](docs/USER_GUIDE.md) - Jamail 기능 사용 방법
- [API 레퍼런스](docs/API_REFERENCE.md) - 엔드포인트 상세 정보

## 🏗️ 프로젝트 구조

```
jamail/
├── apps/
│   ├── api/              # NestJS 백엔드
│   │   ├── prisma/       # 데이터베이스 스키마 & 마이그레이션
│   │   └── src/
│   │       ├── templates/    # 템플릿 관리
│   │       ├── mail/         # 이메일 발송
│   │       ├── queue/        # BullMQ 큐 처리
│   │       ├── smtp/         # Multi-SMTP 라우팅
│   │       ├── ab-testing/   # A/B 테스팅
│   │       ├── translations/ # 다국어 지원
│   │       └── webhooks/     # 웹훅
│   └── web/              # Next.js 프론트엔드
│       ├── app/[locale]/ # 국제화 라우트
│       ├── components/   # React 컴포넌트
│       └── lib/          # API 클라이언트
├── docker-compose.yml    # PostgreSQL & Redis
└── docs/                 # 문서
```

## ✨ 주요 특징

### 템플릿 버전 관리
모든 템플릿 수정 사항이 자동으로 버전으로 저장되며, 언제든지 이전 버전으로 롤백할 수 있습니다.

### Handlebars 템플릿 엔진
`{{변수명}}` 구문으로 동적 콘텐츠를 쉽게 삽입할 수 있습니다.

### 이메일 성능 추적
발송, 열람, 클릭, 전환율 등 주요 메트릭을 실시간으로 모니터링합니다.

## 🤝 기여하기

기여는 언제나 환영합니다! Pull Request를 제출하기 전에 기여 가이드라인을 읽어주세요.

## 📄 라이센스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**Made with ❤️ for better email management**
