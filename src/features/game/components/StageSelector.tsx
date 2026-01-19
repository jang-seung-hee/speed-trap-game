/**
 * 스테이지 선택 및 관리 컴포넌트
 * 드롭다운으로 스테이지 선택, 추가 버튼, 게임 적용 버튼
 */

import React, { useState } from 'react';

interface StageSelectorProps {
    currentStage: number;
    totalStages: number;
    onStageSelect: (stage: number) => void;
    onStageAdd: (afterStage: number) => void;
    onApplyToGame: () => void;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
    currentStage,
    totalStages,
    onStageSelect,
    onStageAdd,
    onApplyToGame
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [insertAfter, setInsertAfter] = useState(1);

    const handleAddClick = () => {
        setShowAddModal(true);
        setInsertAfter(currentStage);
    };

    const handleConfirmAdd = () => {
        onStageAdd(insertAfter);
        setShowAddModal(false);
    };

    return (
        <div className="stage-selector">
            <div className="selector-row">
                <select
                    className="stage-dropdown"
                    value={currentStage}
                    onChange={(e) => onStageSelect(Number(e.target.value))}
                >
                    {Array.from({ length: totalStages }, (_, i) => i + 1).map((stage) => (
                        <option key={stage} value={stage}>
                            스테이지 {stage}
                        </option>
                    ))}
                </select>

                <button
                    className="btn-add"
                    onClick={handleAddClick}
                    title="새 스테이지 추가"
                >
                    +
                </button>

                <button
                    className="btn-apply"
                    onClick={onApplyToGame}
                >
                    🎮 게임 적용
                </button>
            </div>

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>새 스테이지 추가</h3>
                        <p>몇 번째 스테이지 뒤에 추가하시겠습니까?</p>

                        <select
                            className="insert-select"
                            value={insertAfter}
                            onChange={(e) => setInsertAfter(Number(e.target.value))}
                        >
                            {Array.from({ length: totalStages }, (_, i) => i + 1).map((stage) => (
                                <option key={stage} value={stage}>
                                    스테이지 {stage} 뒤
                                </option>
                            ))}
                        </select>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowAddModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="btn-confirm"
                                onClick={handleConfirmAdd}
                            >
                                추가
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .stage-selector {
                    margin-bottom: 16px;
                }

                .selector-row {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .stage-dropdown {
                    flex: 1;
                    padding: 10px 12px;
                    border: 2px solid #667eea;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .stage-dropdown:hover {
                    border-color: #764ba2;
                }

                .stage-dropdown:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
                }

                .btn-add {
                    width: 40px;
                    height: 40px;
                    border: 2px solid #4CAF50;
                    border-radius: 6px;
                    background: white;
                    color: #4CAF50;
                    font-size: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-add:hover {
                    background: #4CAF50;
                    color: white;
                    transform: scale(1.05);
                }

                .btn-apply {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .btn-apply:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                /* 모달 스타일 */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    min-width: 300px;
                    max-width: 400px;
                }

                .modal-content h3 {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    color: #333;
                }

                .modal-content p {
                    margin: 0 0 16px 0;
                    font-size: 14px;
                    color: #666;
                }

                .insert-select {
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    margin-bottom: 20px;
                }

                .insert-select:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .modal-actions {
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                }

                .btn-cancel,
                .btn-confirm {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-cancel {
                    background: #f0f0f0;
                    color: #666;
                }

                .btn-cancel:hover {
                    background: #e0e0e0;
                }

                .btn-confirm {
                    background: #4CAF50;
                    color: white;
                }

                .btn-confirm:hover {
                    background: #45a049;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
                }
            `}</style>
        </div>
    );
};
