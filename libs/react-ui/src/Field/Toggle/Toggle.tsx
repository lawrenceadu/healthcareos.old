import { helpers } from '@healthcare/utils';

export interface ToggleProps {
  name: string;
  checked: boolean;
  children?: any;
  className?: string;
  onChange: (checked: boolean) => void;
}

export function Toggle({
  name,
  children,
  checked,
  onChange,
  className,
  ...props
}: ToggleProps) {
  return (
    <label
      className={helpers.classNames(
        className,
        `relative inline-flex items-center cursor-pointer`
      )}
      htmlFor={name}
      onClick={() => {
        console.log(checked);
        onChange(!checked);
      }}
    >
      <input
        name={name}
        type="checkbox"
        checked={checked}
        className="sr-only peer"
        onChange={() => null}
      />
      <div className="w-[36px] h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:bottom-[2px] after:left-[2px] after:bg-white after:shadow-sm after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
      {children}
    </label>
  );
}

export default Toggle;
