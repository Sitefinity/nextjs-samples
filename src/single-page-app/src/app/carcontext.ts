import { createContext } from 'react';

export const CarContext = createContext(null);

export const DEFAULT_CAR = {
    cartype: 'none',
    engine: 'none',
    color: 'none'
};

export function carReducer(car, action) {
    switch (action.type) {
        case 'cartype': {
            return {
                cartype: action.value,
                engine: car.engine,
                color: car.color
            };
        }
        case 'engine': {
            return {
                cartype: car.cartype,
                engine: action.value,
                color: car.color
            };
        }
        case 'color': {
            return {
                cartype: car.cartype,
                engine: car.engine,
                color: action.value
            };
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
