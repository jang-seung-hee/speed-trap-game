/**
 * 스테이지 편집 컴포넌트
 * 선택된 스테이지의 모든 파라미터를 편집
 */

import React from 'react';
import { SliderControl } from '@/common/components/SliderControl';
import { PhaseConfig } from '@/features/game/constants';

interface StageEditorProps {
    stageNumber: number;
    config: PhaseConfig;
    onChange: (config: PhaseConfig) => void;
    onSave: () => void;
    onReset: () => void;
}

export const StageEditor: React.FC<StageEditorProps> = ({
    stageNumber,
    config,
    onChange,
    onSave,
    onReset
}) => {
    // rewardProbs가 없을 경우 기본값 제공
    const safeConfig = {
        ...config,
        rewardProbs: config.rewardProbs || {
            HEAL_50: 0.15,
            HEAL_100: 0.10,
            SHIELD: 0.15,
            BOMB_ALL: 0.05,
            BOMB_HALF: 0.15,
            ROAD_NARROW: 0.10,
            CAMERA_BOOST: 0.20,
            SLOW_TIME: 0.10
        }
    };

    const updateConfig = (key: keyof PhaseConfig, value: number | string | object) => {
        onChange({ ...safeConfig, [key]: value });
    };

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

                    <SliderControl
                        label="앰뷸런스 확률"
                        value={safeConfig.ambulanceProb}
                        min={0}
                        max={0.3}
                        step={0.01}
                        onChange={(v) => updateConfig('ambulanceProb', v)}
                        description="앰뷸런스가 등장할 확률"
                    />
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
                    <h4 className="section-title">콤보 보상 확률</h4>

                    <SliderControl
                        label="체력 50% 회복"
                        value={safeConfig.rewardProbs.HEAL_50}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, HEAL_50: v })}
                        description="체력 50% 회복 확률"
                    />

                    <SliderControl
                        label="체력 100% 회복"
                        value={safeConfig.rewardProbs.HEAL_100}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, HEAL_100: v })}
                        description="체력 완전 회복 확률"
                    />

                    <SliderControl
                        label="쉴드 +3"
                        value={safeConfig.rewardProbs.SHIELD}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, SHIELD: v })}
                        description="쉴드 3개 획득 확률"
                    />

                    <SliderControl
                        label="올킬 폭탄"
                        value={safeConfig.rewardProbs.BOMB_ALL}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, BOMB_ALL: v })}
                        description="모든 차량 제거 확률"
                    />

                    <SliderControl
                        label="하프킬 폭탄"
                        value={safeConfig.rewardProbs.BOMB_HALF}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, BOMB_HALF: v })}
                        description="절반 차량 제거 확률"
                    />

                    <SliderControl
                        label="도로 정비"
                        value={safeConfig.rewardProbs.ROAD_NARROW}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, ROAD_NARROW: v })}
                        description="60초간 도로 2칸 축소 확률"
                    />

                    <SliderControl
                        label="고성능 카메라"
                        value={safeConfig.rewardProbs.CAMERA_BOOST}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, CAMERA_BOOST: v })}
                        description="단속 구역 40% 확대 확률"
                    />

                    <SliderControl
                        label="슬로우"
                        value={safeConfig.rewardProbs.SLOW_TIME}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateConfig('rewardProbs', { ...safeConfig.rewardProbs, SLOW_TIME: v })}
                        description="60초간 속도 감소 확률"
                    />
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
                }

                .editor-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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
                    max-height: 600px;
                    overflow-y: auto;
                }

                .settings-section {
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #eee;
                }

                .settings-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }

                .section-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #555;
                    margin: 0 0 12px 0;
                }

                .description-input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: inherit;
                    resize: vertical;
                }

                .description-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                /* 스크롤바 스타일링 */
                .editor-content::-webkit-scrollbar {
                    width: 8px;
                }

                .editor-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .editor-content::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                }

                .editor-content::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};
