import { helpers } from '@healthcare/utils';

export interface BadgeProps {
  variant: string;
  children: any;
}

export function Badge({ variant, children }: BadgeProps) {
  /**
   * variants
   */
  variant = variant.toLowerCase();

  return (
    <div
      className={helpers.classNames(
        'py-1 px-2 rounded-[4px] inline-flex items-center gap-1 text-xs font-medium',
        ['success', 'fulfilled', 'active', 'submitted'].includes(variant) &&
          'text-green-500 bg-green-50',
        ['rejected', 'failed', 'suspended'].includes(variant) &&
          'text-red-600 bg-red-50',
        ['warning', 'pending'].includes(variant) &&
          'text-amber-500 bg-amber-50',
        ['light'].includes(variant) && 'bg-gray-50 text-black'
      )}
    >
      {children}
    </div>
  );
}

export default Badge;
