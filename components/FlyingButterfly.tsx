import React from 'react';
import { ButterflyToken } from './ButterflyToken';

interface FlyingButterflyProps {
  from: DOMRect;
  to: DOMRect;
}

export const FlyingButterfly: React.FC<FlyingButterflyProps> = ({ from, to }) => {
  const butterflySize = 48;
  
  const style = {
    '--start-x': `${from.left + from.width / 2 - butterflySize / 2}px`,
    '--start-y': `${from.top + from.height / 2 - butterflySize / 2}px`,
    '--end-x': `${to.left + to.width / 2 - butterflySize / 2}px`,
    '--end-y': `${to.top + to.height / 2 - butterflySize / 2}px`,
  } as React.CSSProperties;

  return (
    <div style={style} className="flying-butterfly-container">
      {/* Force size to be consistent for animation */}
      <div className="w-12 h-12">
        <ButterflyToken />
      </div>
    </div>
  );
};
