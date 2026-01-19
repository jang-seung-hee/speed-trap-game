/**
 * 재사용 가능한 슬라이더 컨트롤 컴포넌트
 * 스테이지 디자이너에서 각종 수치 조절에 사용
 */

import React from 'react';

interface SliderControlProps {
    label: string;              // 슬라이더 레이블
    value: number;              // 현재 값
    min: number;                // 최소값
    max: number;                // 최대값
    step: number;               // 증감 단위
    unit?: string;              // 단위 (예: 'km/h', '%', 'ms')
    onChange: (value: number) => void;  // 값 변경 핸들러
    description?: string;       // 추가 설명 (툴팁)
}

export const SliderControl: React.FC<SliderControlProps> = ({
    label,
    value,
    min,
    max,
    step,
    unit = '',
    onChange,
    description
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <div className="slider-control" title={description}>
            <div className="slider-header">
                <label className="slider-label">{label}</label>
                <span className="slider-value">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="slider-input"
            />
            <div className="slider-range">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>

            <style jsx>{`
                .slider-control {
                    margin-bottom: 8px;
                    padding: 6px 0;
                }

                .slider-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                }

                .slider-label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #333;
                }

                .slider-value {
                    font-size: 12px;
                    font-weight: 700;
                    color: #0066cc;
                    min-width: 60px;
                    text-align: right;
                }

                .slider-input {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: linear-gradient(to right, #ddd 0%, #0066cc 100%);
                    outline: none;
                    -webkit-appearance: none;
                    cursor: pointer;
                }

                .slider-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #0066cc;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: transform 0.1s;
                }

                .slider-input::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                .slider-input::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #0066cc;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: transform 0.1s;
                }

                .slider-input::-moz-range-thumb:hover {
                    transform: scale(1.2);
                }

                .slider-range {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #999;
                    margin-top: 2px;
                }
            `}</style>
        </div>
    );
};
