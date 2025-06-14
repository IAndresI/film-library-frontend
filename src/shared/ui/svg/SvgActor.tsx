import type { SVGProps } from 'react';

export const SvgActor = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M2,21h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20,1,1,0,0,0,2,21ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5ZM20,15l3,.438L20.5,17.5l.781,3.5L18.5,19l-2.781,2,.781-3.5L14,15.438,17,15l1.5-3Z" />
    </svg>
  );
};
