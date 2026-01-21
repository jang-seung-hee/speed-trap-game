/**
 * 게임 버전 관리 유틸리티
 * 버전이 변경되면 로컬 스토리지의 진행도를 리셋합니다.
 */

// package.json의 버전을 가져옵니다
const GAME_VERSION = '0.1.1';

/**
 * 게임 버전을 확인하고 필요시 진행도를 리셋합니다.
 * @returns 버전이 변경되었는지 여부
 */
export function checkAndResetGameVersion(): boolean {
    if (typeof window === 'undefined') return false;

    const storedVersion = localStorage.getItem('gameVersion');

    // 버전이 다르면 진행도 리셋
    if (storedVersion !== GAME_VERSION) {
        // 이전 버전이 있었다면 (처음 실행이 아니라면)
        const wasReset = storedVersion !== null;

        // 진행도 관련 데이터 삭제
        localStorage.removeItem('maxClearedPhase');

        // 새 버전 저장
        localStorage.setItem('gameVersion', GAME_VERSION);

        return wasReset;
    }

    return false;
}

/**
 * 현재 게임 버전을 반환합니다.
 */
export function getGameVersion(): string {
    return GAME_VERSION;
}

/**
 * 저장된 게임 버전을 반환합니다.
 */
export function getStoredGameVersion(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('gameVersion');
}
