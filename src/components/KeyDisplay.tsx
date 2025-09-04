import React from 'react';
import { PhotonData, ComparisonResult } from '../types/qkd';

interface KeyDisplayProps {
  data: PhotonData[];
  comparisonResults?: ComparisonResult[];
  title: string;
  sifting?: boolean;
}

const KeyDisplay: React.FC<KeyDisplayProps> = ({ data, comparisonResults, title, sifting = false }) => {
  return (
    <div>
      <p className="text-gray-600 text-xs font-medium">{title}:</p>
      <div className="flex flex-wrap mt-1 bg-gray-100 border border-gray-200 p-2 rounded-lg">
        {data.map((d, i) => {
          let className = 'key-bit';
          
          if (sifting) {
            className += d.basisMatch ? ' basis-match' : ' basis-mismatch';
          } else if (comparisonResults) {
            className += comparisonResults[i]?.match ? ' correct' : ' error';
          }
          
          return (
            <span key={i} className={className}>
              {d.bit}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default KeyDisplay;
