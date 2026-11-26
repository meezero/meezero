# 🪵 월넛 픽셀 서재 (Walnut Pixel Library)

MOTHER 3 같은 탑다운 도트 감성의 **따뜻한 월넛·우드 픽셀 서재** PWA.
방 안의 오브젝트를 누르면 할 일 · 일정 · 장보기 · 아이디어 · 영상 링크가 열립니다.
모든 기록은 이 기기 브라우저(`localStorage`)에만 저장되고, 서버로는 아무것도 보내지 않습니다.

## 실행

```bash
python3 -m http.server 8765 -d apps/pixel-office
# → http://localhost:8765
```

`file://`로 열면 서비스 워커가 동작하지 않으니 반드시 http(s)로 열어 주세요.
GitHub Pages처럼 하위 경로(`/pixel-office/`)에서 열려도 되도록 모든 경로는 `./` 상대경로로 적혀 있습니다.

## 배포 (GitHub Pages)

- 저장소: `meezero/meezero` (Public) — <https://github.com/meezero/meezero>
- 주소: <https://meezero.github.io/meezero/>
- Pages 소스 브랜치: `gh-pages` (루트 `/`). 내용을 고칠 때는 `main`에 커밋한 뒤 `gh-pages`에도 함께 push합니다.
- 정적 파일만 올라갑니다. 기록은 방문자 브라우저의 `localStorage`에만 저장되고 서버로 전송되는 값은 없습니다.

## 아이폰에 앱처럼 설치

1. Safari로 배포 주소를 연다.
2. 공유 → **홈 화면에 추가**.
3. 홈 화면 아이콘(월넛 방 + 곰인형)으로 전체 화면 실행.

서비스 워커는 **HTTPS**(또는 localhost)에서만 등록됩니다. 배포 시 HTTPS 정적 호스팅이 필요합니다.

## 폴더 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 화면 구조(방 · 패널 · 모달 · 독) |
| `styles.css` | 월넛 팔레트, 픽셀 UI, 모바일/데스크톱 레이아웃 |
| `room.js` | 160×176 논리 픽셀 캔버스로 그리는 서재 방과 캐릭터·곰인형 애니메이션 (창문은 오른쪽 벽, 왼쪽 벽에는 SNS 수납장, 빈백과 바닥 램프) |
| `app.js` | 데이터(localStorage 저장/백업), 6개 보드(할 일·달력·장보기·아이디어·영상·SNS) 로직, 화면 전환 |
| `sw.js` | 오프라인 캐시(앱 셸 + 유튜브 썸네일 런타임 캐시) |
| `manifest.webmanifest` | PWA 매니페스트(standalone, 세로 고정) |
| `fonts/` | Galmuri11 · Galmuri11-Bold(제목·라벨), DeltaGlassKR(본문) — 한국어 웹폰트 |
| `icons/` | `icon-192.png`, `icon-512.png` (32×32 픽셀 그리드를 확대 생성) |

개발용 스크립트는 `apps/pixel-office-tools/`에 있습니다.
- `make_icons.py` — 앱 아이콘 생성(PIL)
- `shoot.py` — 헤드리스 크롬 상호작용 검수
- `shoot_final.py` — 검수 스크린샷 촬영
- `verify_subpath.py` — `/pixel-office/` 서브패스 검수(서비스 워커·매니페스트·오프라인·2×2 피드)

## 기능

- **해야 할 일** 추가 · 완료 · 중요(★) · 삭제 · 필터(전체/남음/완료)
- **일정 달력** 월 이동 · 오늘 강조 · 일정 있는 날 도트 · 날짜별 일정 추가/완료/삭제
- **사야 할 것** 품목·수량/메모·카테고리(생활/작업/기타) · 구매 체크 · 완료 항목 비우기
- **아이디어 저장함** 미리캔버스/건강 공부/영상제작/기타 탭 · 키워드 검색 · 제목/본문/태그 편집
- **영상 링크 피드** YouTube 자동 썸네일(`hqdefault.jpg`) · Instagram 등 플랫폼 배지 · 썸네일 이미지 URL/파일(압축 DataURL) · 카드 탭으로 원본 열기 · 모바일에서도 2열(2×2) 배치
- **SNS** 왼쪽 벽 수납장을 누르면 네이버 블로그 · 워드프레스 · 네이버 메일로 이동. 주소는 연필 버튼으로 바꿀 수 있고 이 기기에만 저장됩니다(기본값은 일반 주소만).
- **백업** 설정(⚙️)에서 JSON 내보내기 / 가져오기 / 전체 초기화
- **곰인형 3마리**를 누르면 짧은 픽셀 말풍선 대사와 통통 튀는 애니메이션

## 데이터

`localStorage` 키 `walnut-pixel-library-v1`:

```json
{ "version": 1, "todos": [], "events": [], "shopping": [], "ideas": [], "videos": [], "links": [] }
```

첫 방문에는 예시 데이터가 들어가고, 설정에서 초기화하면 빈 서재로 시작합니다.
썸네일은 최대 640px JPEG(품질 0.72)로 압축해 저장합니다.
