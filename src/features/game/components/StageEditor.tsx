/**
 * 스테이지 편집 컴포넌트
 * 선택된 스테이지의 모든 파라미터를 편집
 */

import React, { useState } from 'react';
import { SliderControl } from '@/common/components/SliderControl';
import { PhaseConfig, RewardEffect } from '@/features/game/constants';

interface StageEditorProps {
    stageNumber: number;
    config: PhaseConfig;
    onChange: (config: PhaseConfig) => void;
    onSave: () => void;
    onReset: () => void;
}

const DEFAULT_ACTIVE_REWARDS: RewardEffect[] = [
    'HEAL_50',
    'HEAL_100',
    'SHIELD',
    'BOMB_ALL',
    'BOMB_HALF',
    'ROAD_NARROW',
    'CAMERA_BOOST',
    'SLOW_TIME',
    'DOUBLE_SCORE',
    'SEARCHLIGHT'
];

export const StageEditor: React.FC<StageEditorProps> = ({
    stageNumber,
    config,
    onChange,
    onSave,
    onReset
}) => {
    // 콤보 보상 탭 상태 (10, 20, 30, 40)
    const [activeComboTab, setActiveComboTab] = useState<number>(10);

    // comboRewards가 없을 경우 기본값 제공
    const safeConfig: PhaseConfig = {
        ...config,
        comboRewards: config.comboRewards || {
            10: [...DEFAULT_ACTIVE_REWARDS],
            20: [...DEFAULT_ACTIVE_REWARDS],
            30: [...DEFAULT_ACTIVE_REWARDS],
            40: [...DEFAULT_ACTIVE_REWARDS]
        }
    };

    const updateConfig = (key: keyof PhaseConfig, value: any) => {
        onChange({ ...safeConfig, [key]: value });
    };

    const toggleRewardEffect = (effectType: RewardEffect) => {
        const rawEffects = safeConfig.comboRewards[activeComboTab];
        const currentEffects = Array.isArray(rawEffects) ? rawEffects : [...DEFAULT_ACTIVE_REWARDS];

        const newEffects = currentEffects.includes(effectType)
            ? currentEffects.filter(e => e !== effectType)
            : [...currentEffects, effectType];

        const newComboRewards = {
            ...safeConfig.comboRewards,
            [activeComboTab]: newEffects
        };

        updateConfig('comboRewards', newComboRewards);
    };

    const currentEffects = Array.isArray(safeConfig.comboRewards[activeComboTab])
        ? safeConfig.comboRewards[activeComboTab]
        : DEFAULT_ACTIVE_REWARDS;

    return (
        <div className="stage-editor">
            <div className="editor-header">
                <h3>📝 스테이지 {stageNumber} 편집</h3>
                <div className="editor-actions">
                    <button onClick={onReset} className="btn-reset">
                        초기화
                    </button>
                    <button onClick={onSave} className="btn-save">
                        저장
                    </button>
                </div>
            </div>

            <div className="editor-content">
                <div className="settings-section">
                    <h4 className="section-title">기본 설정</h4>

                    <SliderControl
                        label="목표 점수"
                        value={safeConfig.scoreLimit}
                        min={0}
                        max={10000}
                        step={100}
                        unit="점"
                        onChange={(v) => updateConfig('scoreLimit', v)}
                        description="다음 스테이지로 넘어가기 위한 점수"
                    />

                    <SliderControl
                        label="단속 구역 높이"
                        value={safeConfig.zoneHeight}
                        min={0}
                        max={40}
                        step={1}
                        unit="%"
                        onChange={(v) => updateConfig('zoneHeight', v)}
                        description="노란색 단속 영역의 세로 높이"
                    />

                    <SliderControl
                        label="도로 라인 수"
                        value={safeConfig.lanes}
                        min={0}
                        max={7}
                        step={1}
                        unit="개"
                        onChange={(v) => updateConfig('lanes', v)}
                        description="도로의 차선 개수"
                    />

                    <SliderControl
                        label="주행 속도 계수"
                        value={safeConfig.speedCoefficient}
                        min={0}
                        max={500}
                        step={10}
                        onChange={(v) => updateConfig('speedCoefficient', v)}
                        description="차량의 실제 주행 속도감 (낮을수록 빠름)"
                    />
                </div>

                <div className="settings-section">
                    <h4 className="section-title">차량 행동 확률</h4>

                    <SliderControl
                        label="급브레이크 확률"
                        value={safeConfig.trickProb}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('trickProb', v)}
                        description="단속 구역 앞에서 급브레이크를 밟을 확률"
                    />

                    <SliderControl
                        label="급가속 확률"
                        value={safeConfig.nitroProb}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('nitroProb', v)}
                        description="단속 구역 앞에서 급가속할 확률"
                    />

                    <SliderControl
                        label="차선 변경 확률"
                        value={safeConfig.swerveProb}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('swerveProb', v)}
                        description="단속 구역 앞에서 차선을 변경할 확률"
                    />

                    <SliderControl
                        label="정지 후 출발 확률"
                        value={safeConfig.stopAndGoProb}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('stopAndGoProb', v)}
                        description="멈췄다가 다시 출발할 확률"
                    />
                </div>

                <div className="settings-section">
                    <h4 className="section-title">특수 차량</h4>

                    <SliderControl
                        label="오토바이 확률"
                        value={safeConfig.motorcycleProb}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('motorcycleProb', v)}
                        description="오토바이가 등장할 확률"
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        <label className="checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>앰뷸런스 등장 (1회)</span>
                            <input
                                type="checkbox"
                                checked={!!safeConfig.hasAmbulance}
                                onChange={(e) => updateConfig('hasAmbulance', e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                        </label>

                        <label className="checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>경찰차 등장 (1회)</span>
                            <input
                                type="checkbox"
                                checked={!!safeConfig.hasPolice}
                                onChange={(e) => updateConfig('hasPolice', e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h4 className="section-title">스폰 설정</h4>

                    <SliderControl
                        label="스폰 간격"
                        value={safeConfig.spawnInterval}
                        min={0}
                        max={3000}
                        step={100}
                        unit="ms"
                        onChange={(v) => updateConfig('spawnInterval', v)}
                        description="차량이 생성되는 시간 간격"
                    />

                    <SliderControl
                        label="스폰 Y 임계값"
                        value={safeConfig.spawnYThreshold}
                        min={0}
                        max={80}
                        step={5}
                        unit="%"
                        onChange={(v) => updateConfig('spawnYThreshold', v)}
                        description="이전 차량이 이 지점까지 가야 다음 차 생성"
                    />
                </div>

                <div className="settings-section">
                    <h4 className="section-title">속도 설정</h4>

                    <SliderControl
                        label="최소 속도"
                        value={safeConfig.minSpeed}
                        min={0}
                        max={120}
                        step={1}
                        unit="km/h"
                        onChange={(v) => updateConfig('minSpeed', v)}
                        description="차량의 최저 주행 속도"
                    />

                    <SliderControl
                        label="최대 속도"
                        value={safeConfig.maxSpeed}
                        min={0}
                        max={200}
                        step={5}
                        unit="km/h"
                        onChange={(v) => updateConfig('maxSpeed', v)}
                        description="과속 차량의 최고 속도"
                    />

                    <SliderControl
                        label="과속 확률"
                        value={safeConfig.overspeedProb}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('overspeedProb', v)}
                        description="과속 차량이 등장할 확률"
                    />
                </div>

                <div className="settings-section">
                    <h4 className="section-title">콤보 보상 설정</h4>

                    <div className="combo-tabs">
                        {[10, 20, 30, 40].map(combo => (
                            <button
                                key={combo}
                                className={`combo-tab ${activeComboTab === combo ? 'active' : ''}`}
                                onClick={() => setActiveComboTab(combo)}
                            >
                                {combo} 콤보
                            </button>
                        ))}
                    </div>

                    <div className="combo-content" style={{ gridColumn: '1 / -1' }}>
                        <div className="combo-info">
                            {activeComboTab} 콤보 달성 시 등장시킬 특수효과를 선택하세요
                        </div>

                        <div className="checkbox-grid">
                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('HEAL_50')}
                                    onChange={() => toggleRewardEffect('HEAL_50')}
                                />
                                <span>체력 50% 회복</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('HEAL_100')}
                                    onChange={() => toggleRewardEffect('HEAL_100')}
                                />
                                <span>체력 100% 회복</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('SHIELD')}
                                    onChange={() => toggleRewardEffect('SHIELD')}
                                />
                                <span>쉴드 +3</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('BOMB_ALL')}
                                    onChange={() => toggleRewardEffect('BOMB_ALL')}
                                />
                                <span>올킬 폭탄</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('BOMB_HALF')}
                                    onChange={() => toggleRewardEffect('BOMB_HALF')}
                                />
                                <span>하프킬 폭탄</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('ROAD_NARROW')}
                                    onChange={() => toggleRewardEffect('ROAD_NARROW')}
                                />
                                <span>도로 정비</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('CAMERA_BOOST')}
                                    onChange={() => toggleRewardEffect('CAMERA_BOOST')}
                                />
                                <span>고성능 카메라</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('SLOW_TIME')}
                                    onChange={() => toggleRewardEffect('SLOW_TIME')}
                                />
                                <span>슬로우</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('DOUBLE_SCORE')}
                                    onChange={() => toggleRewardEffect('DOUBLE_SCORE')}
                                />
                                <span>더블득점</span>
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={currentEffects.includes('SEARCHLIGHT')}
                                    onChange={() => toggleRewardEffect('SEARCHLIGHT')}
                                />
                                <span>서치라이트</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h4 className="section-title">미션 설명</h4>
                    <textarea
                        className="description-input"
                        value={safeConfig.description}
                        onChange={(e) => updateConfig('description', e.target.value)}
                        placeholder="스테이지 시작 시 표시될 미션 설명"
                        rows={2}
                    />
                </div>
            </div>

            <style jsx>{`
                .stage-editor {
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .editor-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }

                .editor-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .editor-actions {
                    display: flex;
                    gap: 8px;
                }

                .btn-reset,
                .btn-save {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-reset {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                .btn-reset:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .btn-save {
                    background: #4CAF50;
                    color: white;
                }

                .btn-save:hover {
                    background: #45a049;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .editor-content {
                    padding: 16px;
                    overflow-y: auto;
                    flex: 1;
                }

                .settings-section {
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #eee;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px 16px;
                    align-items: start;
                }

                .settings-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }

                .section-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #333;
                    color: #333;
                    margin: 0 0 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    grid-column: 1 / -1;
                }
                
                .section-title::before {
                    content: '';
                    display: block;
                    width: 4px;
                    height: 16px;
                    background: #667eea;
                    border-radius: 2px;
                }

                .description-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 13px;
                    font-family: inherit;
                    color: #333;
                    background: white;
                    resize: vertical;
                    min-height: 80px;
                    grid-column: 1 / -1;
                }

                .description-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
                }

                /* 콤보 탭 스타일 */
                .combo-tabs {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 16px;
                    background: #f5f5f5;
                    padding: 4px;
                    border-radius: 8px;
                    grid-column: 1 / -1;
                }

                .combo-tab {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .combo-tab:hover {
                    background: rgba(0, 0, 0, 0.05);
                }

                .combo-tab.active {
                    background: white;
                    color: #667eea;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .combo-info {
                    font-size: 12px;
                    color: #888;
                    margin-bottom: 16px;
                    text-align: center;
                    background: #f9f9f9;
                    padding: 8px;
                    border-radius: 4px;
                }

                /* 체크박스 그리드 스타일 */
                .checkbox-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 8px;
                    background: #f9f9f9;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    user-select: none;
                }

                .checkbox-item:hover {
                    background: #f0f0f0;
                    border-color: #667eea;
                }

                .checkbox-item input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    accent-color: #667eea;
                }

                .checkbox-item span {
                    font-size: 13px;
                    font-weight: 500;
                    color: #333;
                }

                .checkbox-item input[type="checkbox"]:checked + span {
                    color: #667eea;
                    font-weight: 600;
                }

                /* 스크롤바 스타일링 */
                .editor-content::-webkit-scrollbar {
                    width: 8px;
                }

                .editor-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .editor-content::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 4px;
                }

                .editor-content::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }
            `}</style>
        </div>
    );
};
