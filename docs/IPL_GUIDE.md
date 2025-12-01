# 시스템 운영 및 IPL(Initial Program Load) 절차서

본 문서는 폐쇄망(Offline) 환경에서 Jamail 시스템을 운영하기 위한 기동, 종료, 재기동 및 유지보수 절차를 기술합니다.

## 1. 개요
- **시스템명**: Jamail Monorepo System
- **구성 요소**:
  - Frontend (Web): Next.js
  - Backend (API): NestJS
  - Database: PostgreSQL
  - Cache/Queue: Redis
- **운영 환경**: Docker Compose 기반 컨테이너 환경

## 2. 사전 준비 사항 (Prerequisites)
폐쇄망 환경이므로 인터넷 연결이 불가능합니다. 따라서 외부망에서 Docker 이미지를 미리 빌드하고 저장하여 반입해야 합니다.

### 2.1 Docker 이미지 준비 (외부망)
인터넷이 연결된 환경에서 이미지를 빌드하고 파일로 저장합니다.

```bash
# 1. 이미지 빌드
docker compose build

# 2. 이미지 저장 (tar 파일 생성)
# 프로젝트명(jamail)은 docker-compose.yml이 있는 폴더명에 따라 다를 수 있습니다. 확인 필요.
docker save -o jamail-images.tar jamail-web jamail-api postgres:15-alpine redis:7-alpine
```

### 2.2 환경 변수 설정 (필수)
`docker-compose.yml`과 같은 경로에 `.env` 파일을 생성하여 환경 변수를 설정합니다.
`.env.example` 파일을 복사하여 사용하면 편리합니다.

```bash
cp .env.example .env
# vi .env 또는 메모장으로 환경에 맞게 수정
```

**주요 설정 항목:**
- `POSTGRES_USER`, `POSTGRES_PASSWORD`: DB 접속 정보
- `JWT_SECRET`: 보안 키 (반드시 변경 필요)
- `CORS_ORIGIN`: Frontend URL (CORS 허용 도메인, 예: `http://localhost:3000`)
- `API_URL`: Frontend가 Backend와 통신하기 위한 URL (Docker 내부 통신이므로 `http://api:3001` 권장)

### 2.3 Docker 이미지 반입 (폐쇄망)
저장된 `jamail-images.tar` 파일을 운영 서버로 전송한 후 로드합니다.

```bash
# 이미지 로드
docker load -i jamail-images.tar
```

## 3. 시스템 기동 (Startup)

### 3.1 전체 시스템 기동
모든 서비스를 백그라운드 모드로 실행합니다.

```bash
docker compose up -d
```

### 3.2 기동 확인
컨테이너가 정상적으로 실행되었는지 확인합니다.

```bash
docker compose ps
```
*Status가 `Up` 상태여야 합니다.*

### 3.3 로그 확인
각 서비스의 로그를 실시간으로 확인하여 오류가 없는지 점검합니다.

```bash
# 전체 로그 확인
docker compose logs -f

# 특정 서비스 로그 확인 (예: api)
docker compose logs -f api
```

## 4. 시스템 종료 (Shutdown)

### 4.1 전체 시스템 종료
실행 중인 모든 컨테이너를 정지하고 제거합니다. (데이터는 볼륨에 보존됩니다)

```bash
docker compose down
```

### 4.2 데이터까지 초기화 (주의)
데이터베이스 및 Redis 데이터를 포함하여 모든 볼륨을 삭제하려면 아래 명령어를 사용합니다. **(주의: 데이터가 유실됩니다)**

```bash
docker compose down -v
```

## 5. 시스템 재기동 (Restart)

### 5.1 전체 시스템 재기동
```bash
docker compose restart
```

### 5.2 특정 서비스 재기동
설정 변경 등으로 특정 서비스만 재기동해야 할 경우 사용합니다.

```bash
# 예: api 서비스만 재기동
docker compose restart api
```

## 6. 유지보수 및 트러블슈팅

### 6.1 컨테이너 상태 상세 확인
```bash
docker stats
```

### 6.2 데이터베이스 접속
PostgreSQL 컨테이너 내부로 접속하여 DB를 점검합니다.

```bash
docker compose exec postgres psql -U jamail -d jamail_db
```
*(패스워드는 `docker-compose.yml`에 설정된 값 사용, 기본값: `jamailpassword`)*

### 6.3 Redis 접속
Redis 컨테이너 내부로 접속하여 캐시를 점검합니다.

```bash
docker compose exec redis redis-cli
```

## 7. 주요 설정 파일
- **docker-compose.yml**: 컨테이너 오케스트레이션 설정
- **apps/web/next.config.ts**: Frontend 설정 (Standalone 모드 등)
- **apps/web/Dockerfile**: Frontend 빌드 정의
- **apps/api/Dockerfile**: Backend 빌드 정의

---
**작성일**: 2025-12-01
**작성자**: Jamail System Administrator
