/**
 * 스테이지 디자이너 메인 컴포넌트
 * 개발 모드 + PC 모드에서만 표시
 * 화면 분할: 왼쪽 디자이너 폼, 오른쪽 모바일 스타일 게임 뷰
 */

import React, { useState, useEffect } from 'react';
import { useStageDesigner } from '@/features/game/hooks/useStageDesigner';
import { StageSelector } from '@/features/game/components/StageSelector';
import { GlobalSettings } from '@/features/game/components/GlobalSettings';
import { StageEditor } from '@/features/game/components/StageEditor';
import GameStage from '@/features/game/components/GameStage';

export const StageDesigner: React.FC = () => {
    const {
        settings,
        selectedStage,
        setSelectedStage,
        hasUnsavedChanges,
        updateGlobalSettings,
        updateStageConfig,
        addStageAfter,
        saveSettings,
        resetStage,
        resetAllSettings,
        exportSettings,
        totalStages
    } = useStageDesigner();

    // 게임 리셋을 위한 키 (변경 시 GameStage가 완전히 재마운트됨)
    const [gameKey, setGameKey] = useState(0);

    // 설정이 변경될 때마다 자동으로 게임에 반영
    useEffect(() => {
        setGameKey(prev => prev + 1);
    }, [settings, selectedStage]);

    const handleApplyToGame = () => {
        // 게임 컴포넌트를 강제로 재마운트하여 선택한 스테이지로 이동
        setGameKey(prev => prev + 1);
    };

    return (
        <div className="stage-designer-container">
            {/* 왼쪽: 디자이너 폼 */}
            <div className="designer-panel">
                <div className="designer-header">
                    <h2>🎨 스테이지 디자이너</h2>
                    <div className="header-actions">
                        {hasUnsavedChanges && (
                            <span className="unsaved-indicator">● 저장되지 않음</span>
                        )}
                        <button onClick={exportSettings} className="btn-export">
                            📥 Export
                        </button>
                        <button onClick={resetAllSettings} className="btn-reset-all">
                            🔄 전체 초기화
                        </button>
                        <button
                            onClick={() => window.location.search = ''}
                            className="btn-exit"
                        >
                            ↩️ 게임으로 복귀
                        </button>
                    </div>
                </div>

                <div className="designer-content">
                    <StageSelector
                        currentStage={selectedStage}
                        totalStages={totalStages}
                        onStageSelect={setSelectedStage}
                        onStageAdd={addStageAfter}
                        onApplyToGame={handleApplyToGame}
                    />

                    <GlobalSettings
                        settings={settings}
                        onChange={updateGlobalSettings}
                    />

                    <StageEditor
                        stageNumber={selectedStage}
                        config={settings.PHASES[selectedStage]}
                        onChange={(config) => updateStageConfig(selectedStage, config)}
                        onSave={saveSettings}
                        onReset={() => resetStage(selectedStage)}
                    />
                </div>
            </div>

            {/* 오른쪽: 모바일 스타일 게임 뷰 */}
            <div className="game-preview-panel">
                <div className="mobile-frame">
                    <div className="mobile-screen">
                        <GameStage
                            key={gameKey}
                            devMode={true}
                            customSettings={settings}
                            forcePhase={selectedStage}
                            onGameOver={() => { }}
                            onBackToTitle={() => { }}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .stage-designer-container {
                    display: flex;
                    width: 100%;
                    height: 100vh;
                    background: #f5f5f5;
                }

                /* 왼쪽 디자이너 패널 */
                .designer-panel {
                    width: 900px;
                    background: white;
                    border-right: 2px solid #ddd;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .designer-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .designer-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                }

                .header-actions {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .unsaved-indicator {
                    font-size: 12px;
                    color: #ffeb3b;
                    font-weight: 600;
                }

                .btn-export,
                .btn-reset-all,
                .btn-exit {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-exit {
                    background: rgba(0, 0, 0, 0.3);
                    color: white;
                    margin-left: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .btn-exit:hover {
                    background: rgba(0, 0, 0, 0.5);
                    border-color: rgba(255, 255, 255, 0.4);
                }

                .btn-export {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                .btn-export:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .btn-reset-all {
                    background: #ff5252;
                    color: white;
                }

                .btn-reset-all:hover {
                    background: #ff1744;
                }

                .designer-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }

                .designer-content::-webkit-scrollbar {
                    width: 10px;
                }

                .designer-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .designer-content::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 5px;
                }

                .designer-content::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }

                /* 오른쪽 게임 프리뷰 패널 */
                .game-preview-panel {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px;
                }

                .mobile-frame {
                    background: #1a1a1a;
                    border-radius: 30px;
                    padding: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                .mobile-screen {
                    width: 375px;
                    height: 667px;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                }
            `}</style>
        </div>
    );
};
