import { CarType } from './constants';

export interface Car {
    id: number;
    lane: number;
    y: number; // 0 to 100
    speed: number;
    type: CarType;
    captured: boolean;
    actionDone: boolean;
    initialSpeed: number;
    designType: 'RED' | 'BLUE' | 'YELLOW' | 'MOTORCYCLE' | 'AMBULANCE';
    stoppedAt?: number; // STOP_AND_GO 차량용: 정지 시작 시간
}
