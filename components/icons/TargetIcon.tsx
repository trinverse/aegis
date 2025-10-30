import React from 'react';

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a12.022 12.022 0 0 1-5.84 0m5.84 0a11.953 11.953 0 0 0-5.84 0M12 12a6 6 0 0 1 6-6m-6 6a6 6 0 0 0-6 6m6-6a6 6 0 0 0 6 6m-6-6a6 6 0 0 1-6-6" />
  </svg>
);

export default TargetIcon;