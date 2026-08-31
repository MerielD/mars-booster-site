type ArrowDirection = 'down-right' | 'up-right' | 'up';

const paths: Record<ArrowDirection, string> = {
  'down-right': 'M5 5l8 8m0-6v6H7',
  'up-right': 'M5 13l8-8m-6 0h6v6',
  up: 'M9 14V4m-4 4 4-4 4 4',
};

export function ArrowIcon({ direction }: { direction: ArrowDirection }) {
  return (
    <svg className="arrow-icon" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d={paths[direction]} />
    </svg>
  );
}
