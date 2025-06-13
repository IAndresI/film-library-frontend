import type { SVGProps } from 'react';

export const SvgSpinner = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      stroke="currentColor"
      viewBox="0 0 34 34"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="spinner">
        <circle
          cx="17"
          cy="17"
          r="9.5"
          fill="none"
          strokeWidth="3"
        ></circle>
      </g>
    </svg>
  );
};
