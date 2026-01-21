# 게임 버전 관리 가이드

## 개요
게임 버전이 업데이트되면 사용자의 진행도가 자동으로 리셋됩니다.
이는 밸런스 조정이나 새로운 스테이지 추가 시 공정한 게임 경험을 제공하기 위함입니다.

## 버전 업데이트 방법

### 1. 자동 버전 업데이트 (권장)
```bash
npm run version
```
이 명령은 자동으로:
- `package.json`의 버전을 0.0.1 증가
- `versionManager.ts`의 버전을 동기화

### 2. 수동 버전 업데이트
두 파일을 직접 수정:
1. `package.json`의 `version` 필드
2. `src/features/game/utils/versionManager.ts`의 `GAME_VERSION` 상수

⚠️ **주의**: 두 파일의 버전이 일치해야 합니다!

## 깃허브 업로드 워크플로우

### 권장 순서:
```bash
# 1. 버전 업데이트
npm run version

# 2. 변경사항 확인
git status

# 3. 모든 변경사항 스테이징
git add .

# 4. 커밋 (버전 정보 포함)
git commit -m "chore: bump version to v0.1.1"

# 5. 깃허브에 푸시
git push origin master
```

## 버전 관리 시스템 동작 방식

### 사용자 관점:
1. 게임 접속 시 자동으로 버전 체크
2. 버전이 변경되었다면:
   - 진행도 자동 리셋
   - 친절한 안내 모달 표시
   - 새 버전 정보 표시

### 개발자 관점:
- `localStorage`에 `gameVersion` 키로 버전 저장
- 버전 불일치 시 `maxClearedPhase` 삭제
- 타이틀 화면에서 버전 정보 표시

## 파일 구조
```
speed-trap-game/
├── package.json                          # 프로젝트 버전
├── scripts/
│   └── bump-version.js                   # 버전 자동 업데이트 스크립트
└── src/features/game/
    ├── utils/
    │   └── versionManager.ts             # 버전 관리 유틸리티
    └── components/
        └── TitleScreen.tsx               # 버전 체크 및 안내 UI
```

## 버전 번호 규칙 (Semantic Versioning)
- **Major (X.0.0)**: 대규모 변경, 호환성 깨짐
- **Minor (0.X.0)**: 새 기능 추가, 하위 호환성 유지
- **Patch (0.0.X)**: 버그 수정, 밸런스 조정

현재 스크립트는 **Patch** 버전만 자동 증가합니다.
Major/Minor 업데이트는 수동으로 진행하세요.

## 예시

### 밸런스 조정 시:
```bash
npm run version  # 0.1.0 → 0.1.1
git add .
git commit -m "balance: 스테이지 10-13 난이도 조정"
git push
```

### 새 스테이지 추가 시:
```bash
# Minor 버전 수동 증가 (0.1.5 → 0.2.0)
npm run version  # 그 후 package.json에서 0.2.0으로 수정
git add .
git commit -m "feat: 스테이지 14-16 추가"
git push
```

## 문제 해결

### Q: 버전이 업데이트되지 않아요
A: `npm run version` 실행 후 두 파일이 모두 수정되었는지 확인하세요.

### Q: 사용자 진행도를 유지하고 싶어요
A: 버전 번호를 변경하지 마세요. 같은 버전이면 진행도가 유지됩니다.

### Q: 테스트 중에는 리셋되지 않게 하고 싶어요
A: 로컬 개발 중에는 버전을 변경하지 마세요. 배포 직전에만 버전을 올리세요.
