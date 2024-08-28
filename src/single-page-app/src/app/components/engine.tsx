'use client';

import { useContext } from 'react';
import { CarContext } from '../carcontext';

const engines = [{
  type: 'Diesel',
  description: '2,0 TDI 160 HP'
},
{
  type: 'Petrol',
  description: '1,5 TSI 150 HP'
},
{
  type: 'Electric',
  description: '202 kW 5000rpm'
}];

export function Engine() {
  const {
    car,
    dispatch
  } = useContext(CarContext);

  return (<div className="container">
    <h3>Choose car engine:</h3>
    <div className="row">
      {
     engines.map((engine, idx) => {
     return (
       <div key={idx} className="col-md-4 col-lg-4 col-sm-4">
         <label>
           <input type="radio" checked={car?.engine === engine.type} className="card-input-element" onChange={e => dispatch({
           type: 'engine',
           value: engine.type
           })} />
           <div className="card card-default card-input">
             <div className="card-header">{engine.type}</div>
             <div className="card-body">
               {engine.description}
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
