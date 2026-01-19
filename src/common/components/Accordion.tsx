/**
 * 아코디언 컴포넌트
 * 기본적으로 닫힌 상태, 클릭 시 펼침/접힘
 */

import React, { useState } from 'react';

interface AccordionProps {
    title: string;              // 아코디언 제목
    children: React.ReactNode;  // 내부 콘텐츠
    defaultOpen?: boolean;      // 기본 열림 상태
}

export const Accordion: React.FC<AccordionProps> = ({
    title,
    children,
    defaultOpen = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion">
            <button
                className="accordion-header"
                onClick={toggleOpen}
                type="button"
            >
                <span className="accordion-title">{title}</span>
                <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="accordion-content">
                    {children}
                </div>
            )}

            <style jsx>{`
                .accordion {
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    margin-bottom: 12px;
                    background: white;
                    overflow: hidden;
                }

                .accordion-header {
                    width: 100%;
                    padding: 12px 16px;
                    background: #f5f5f5;
                    border: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .accordion-header:hover {
                    background: #e8e8e8;
                }

                .accordion-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                }

                .accordion-icon {
                    font-size: 10px;
                    color: #666;
                    transition: transform 0.3s;
                }

                .accordion-icon.open {
                    transform: rotate(180deg);
                }

                .accordion-content {
                    padding: 16px;
                    border-top: 1px solid #ddd;
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        max-height: 1000px;
                    }
                }
            `}</style>
        </div>
    );
};
