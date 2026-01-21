#!/usr/bin/env node

/**
 * 게임 버전 자동 업데이트 스크립트
 * Git 커밋 전에 실행하여 버전을 자동으로 증가시킵니다.
 */

const fs = require('fs');
const path = require('path');

// package.json 경로
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const versionManagerPath = path.join(__dirname, '..', 'src', 'features', 'game', 'utils', 'versionManager.ts');

// package.json 읽기
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 현재 버전 파싱
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// 패치 버전 증가
const newVersion = `${major}.${minor}.${patch + 1}`;

// package.json 업데이트
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

// versionManager.ts 업데이트
let versionManagerContent = fs.readFileSync(versionManagerPath, 'utf8');
versionManagerContent = versionManagerContent.replace(
    /const GAME_VERSION = '[^']+';/,
    `const GAME_VERSION = '${newVersion}';`
);
fs.writeFileSync(versionManagerPath, versionManagerContent, 'utf8');

console.log(`✅ 게임 버전이 ${newVersion}으로 업데이트되었습니다.`);
console.log(`   - package.json`);
console.log(`   - versionManager.ts`);
