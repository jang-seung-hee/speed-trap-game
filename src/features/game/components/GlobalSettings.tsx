/**
 * 전역 설정 편집 컴포넌트
 * 아코디언 스타일로 전역 게임 설정을 조절
 */

import React from 'react';
import { Accordion } from '@/common/components/Accordion';
import { SliderControl } from '@/common/components/SliderControl';
import { CustomGameSettings } from '@/features/game/utils/stageDesignerStorage';

interface GlobalSettingsProps {
    settings: CustomGameSettings;
    onChange: (settings: CustomGameSettings) => void;
}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({
    settings,
    onChange
}) => {
    const updateSetting = (path: string, value: number) => {
        const newSettings = { ...settings };
        const keys = path.split('.');
        let current: any = newSettings;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        onChange(newSettings);
    };

    return (
        <div className="global-settings">
            <Accordion title="🌐 전역 설정" defaultOpen={false}>
                <div className="settings-group">
                    <h4 className="group-title">기본 규칙</h4>

                    <SliderControl
                        label="과속 기준 값"
                        value={settings.TARGET_SPEED}
                        min={0}
                        max={150}
                        step={5}
                        unit="km/h"
                        onChange={(v) => updateSetting('TARGET_SPEED', v)}
                        description="이 속도를 초과하면 과속으로 판정"
                    />

                    <SliderControl
                        label="단속 구역 위치"
                        value={settings.ZONE_BOTTOM_FIXED}
                        min={0}
                        max={95}
                        step={1}
                        unit="%"
                        onChange={(v) => updateSetting('ZONE_BOTTOM_FIXED', v)}
                        description="화면 하단으로부터의 위치"
                    />
                </div>

                <div className="settings-group">
                    <h4 className="group-title">물리 설정</h4>

                    <SliderControl
                        label="전역 겹침방지 임계값"
                        value={settings.PHYSICS.SPAWN_Y_THRESHOLD}
                        min={0}
                        max={80}
                        step={5}
                        unit="%"
                        onChange={(v) => updateSetting('PHYSICS.SPAWN_Y_THRESHOLD', v)}
                        description="차량 간 최소 간격"
                    />

                    <SliderControl
                        label="앰뷸런스 속도"
                        value={settings.PHYSICS.AMBULANCE_SPEED}
                        min={0}
                        max={300}
                        step={10}
                        onChange={(v) => updateSetting('PHYSICS.AMBULANCE_SPEED', v)}
                        description="앰뷸런스의 주행 속도"
                    />
                </div>

                <div className="settings-group">
                    <h4 className="group-title">자동차 행동 트리거</h4>

                    <SliderControl
                        label="브레이크 시작 지점"
                        value={settings.PHYSICS.ACTION_TRIGGER_OFFSETS.TRICK}
                        min={0}
                        max={20}
                        step={1}
                        unit="%"
                        onChange={(v) => updateSetting('PHYSICS.ACTION_TRIGGER_OFFSETS.TRICK', v)}
                        description="노란선으로부터 브레이크를 밟기 시작하는 거리"
                    />

                    <SliderControl
                        label="차선 변경 시작 지점"
                        value={settings.PHYSICS.ACTION_TRIGGER_OFFSETS.SWERVE}
                        min={0}
                        max={20}
                        step={1}
                        unit="%"
                        onChange={(v) => updateSetting('PHYSICS.ACTION_TRIGGER_OFFSETS.SWERVE', v)}
                        description="노란선으로부터 차선 변경을 시작하는 거리"
                    />

                    <SliderControl
                        label="오토바이 변경 시점"
                        value={settings.PHYSICS.ACTION_TRIGGER_OFFSETS.MOTORCYCLE}
                        min={0}
                        max={20}
                        step={1}
                        unit="%"
                        onChange={(v) => updateSetting('PHYSICS.ACTION_TRIGGER_OFFSETS.MOTORCYCLE', v)}
                        description="오토바이가 회피 행동을 시작하는 거리"
                    />
                </div>
            </Accordion>

            <style jsx>{`
                .global-settings {
                    margin-bottom: 16px;
                }

                .settings-group {
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #eee;
                }

                .settings-group:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }

                .group-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #555;
                    margin: 0 0 12px 0;
                }
            `}</style>
        </div>
    );
};
