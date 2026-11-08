import { Sprout } from 'lucide-react';
import { classNames } from '@/lib/format';

export function Logo({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const dim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const icon = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={classNames(
          'relative grid place-items-center rounded-xl bg-gradient-to-br from-forest-200 to-forest-500 text-forest-900 shadow-sm',
          dim
        )}
      >
        <Sprout size={icon} strokeWidth={2.5} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-forest-200 ring-2 ring-forest-900" />
      </div>
      <div className="leading-none">
        <div className={classNames('font-display font-extrabold tracking-tight', text, light ? 'text-white' : 'text-forest-900')}>
          AgriTech <span className="text-forest-400">AI</span>
        </div>
        {size !== 'sm' && (
          <div className={classNames('mt-0.5 text-[10px] font-semibold uppercase tracking-widest', light ? 'text-forest-200/70' : 'text-forest-500')}>
            From Harvest to Fair Return
          </div>
        )}
      </div>
    </div>
  );
}
