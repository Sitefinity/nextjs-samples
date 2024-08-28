'use client';

import { useContext } from 'react';
import { CarContext } from '../carcontext';

const colors = ['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow'];

export function Color() {
  const {
    car,
    dispatch
  } = useContext(CarContext);

  return (<div className="container">
    <h3>Choose car color:</h3>
    <div className="row">
      {
     colors.map((color, idx) => {
     return (<div key={idx} className="col">
       <label>
         <input type="radio" checked={car?.color === color} className="card-input-element" onChange={e => dispatch({
        type: 'color',
        value: color
        })} />
         <div className="card card-default card-input">
           <div className="card-header">{color}</div>
           <div className="card-body" style={{ backgroundColor: color }} />
         </div>
       </label>
     </div>);
        })
        }
    </div>
  </div>);
}
