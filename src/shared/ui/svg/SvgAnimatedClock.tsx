import type { SVGProps } from 'react';

export const SvgAnimatedClock = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="text-yellow-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Циферблат */}
      <circle
        cx="12"
        cy="12"
        r="10"
      />

      {/* Минутная стрелка (длинная) */}
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="6"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 12 12;360 12 12"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>

      {/* Часовая стрелка (короткая) */}
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="8"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 12 12;360 12 12"
          dur="48s"
          repeatCount="indefinite"
        />
      </line>

      {/* Центральная точка */}
      <circle
        cx="12"
        cy="12"
        r=".5"
        fill="currentColor"
      />
    </svg>
  );
};
