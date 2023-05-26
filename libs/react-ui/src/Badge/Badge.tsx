import { helpers } from '@healthcare/utils';

export interface BadgeProps {
  variant?: string;
  className?: string;
  children: any;
}

export function Badge({ variant, className, children }: BadgeProps) {
  /**
   * variants
   */
  variant = variant?.toLowerCase() as string;

  return (
    <div
      className={helpers.classNames(
        'py-1 px-2 rounded-[4px] inline-flex items-center gap-1 text-xs font-medium',
        [
          'success',
          'fulfilled',
          'active',
          'submitted',
          'received',
          'dispensed',
          'approved',
          'paid',
        ].includes(variant) && 'text-green-500 bg-green-50',
        ['rejected', 'failed', 'suspended', 'danger', 'stat'].includes(
          variant
        ) && 'text-red-600 bg-red-50',
        ['printed', 'required', 'info'].includes(variant) &&
          'text-blue-600 bg-blue-50',
        ['warning', 'pending', 'unpaid', 'other'].includes(variant) &&
          'text-amber-500 bg-amber-50',
        ['light', 'ordered'].includes(variant) && 'bg-gray-200 text-black',
        className
      )}
    >
      {children}
    </div>
  );
}

export default Badge;
