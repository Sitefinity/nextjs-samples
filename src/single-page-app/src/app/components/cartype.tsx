'use client';

import { useContext } from 'react';
import { CarContext } from '../carcontext';

const carTypes = [{
  type: 'SUV',
  description: 'A sport utility vehicle (SUV) is a car classification that combines elements of road-going passenger cars with features from off-road vehicles, such as raised ground clearance and four-wheel drive.'
}, {
  type: 'Hatchback',
  description: 'A hatchback is a car body configuration with a rear door that swings upward to provide access to the main interior of the car as a cargo area rather than just to a separated trunk.'
}, {
  type: 'Sedan',
  description: 'A sedan is a passenger car in a three-box configuration with separate compartments for an engine, passengers, and cargo.'
}];

export function CarType() {
  const {
    car,
    dispatch
  } = useContext(CarContext);

  return (<div className="container">
    <h3>Choose car type:</h3>
    <div className="row">
      {
     carTypes.map((carType, idx) => {
     return (
       <div key={idx} className="col">
         <label>
           <input type="radio" checked={car?.cartype === carType.type} className="card-input-element" onChange={e => dispatch({
           type: 'cartype',
           value: carType.type
           })} />
           <div className="card card-default card-input">
             <div className="card-header">{carType.type}</div>
             <div className="card-body">
               {carType.description}
             </div>
           </div>
         </label>
       </div>
     );
     })
     }
    </div>
  </div>);
}
