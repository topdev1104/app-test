import classNames from 'classnames';

import './style.scss';
import { useEffect, useState } from 'react';

type LabeledSwitchProps = {
  value: boolean;
  leftOption: string;
  rightOption: string;
  onToggle: (value: boolean) => void;
  className?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
};

export default function LabeledSwitch({
  value,
  leftOption,
  rightOption,
  onToggle,
  className,
  width,
  height,
  fontSize,
  disabled,
}: LabeledSwitchProps) {
  const [backgroundTabSize, setBackgroundTabSize] = useState<{ right: string; left: string }>({
    left: '',
    right: '',
  });

  useEffect(() => {}, [leftOption, rightOption]);

  const handleToggle = (toggleValue: boolean) => {
    if (!disabled) {
      if (value === toggleValue) return;

      onToggle(toggleValue);
    }
  };

  return (
    <div
      className={classNames('LabeledSwitch', className, {
        LabeledSwitchActive: value,
        LabeledSwitchDisabled: disabled,
      })}
      style={{ width: `${width}px`, minHeight: `${height}px` }}
    >
      <div className="LabeledSwitch__inner">
        <div
          className="LabeledSwitch__pointer"
          style={{
            transform: `translateX(${value ? (width || 0) / 2 - 2 : 2}px)`,
            width: `${value ? '118px' : leftOption === 'Deposits' ? '87px' : '51px'}`,
            marginLeft: `${!value ? (leftOption === 'Deposits' ? '8px' : '16px') : '-9px'}`,
          }}
        >
          <span style={{ borderRadius: '24px' }} />
        </div>

        <button
          className={classNames({
            LabeledSwitch__buttonActive: !value,
            LabeledSwitch__buttonLeft: true,
          })}
          onClick={() => handleToggle(false)}
          type="button"
          style={{
            minHeight: `${(height || 0) - 2}px`,
            fontSize: `16px`,
          }}
        >
          <p>
            <span>{leftOption}</span>
          </p>
        </button>
        <button
          className={classNames({
            LabeledSwitch__buttonActive: value,
            LabeledSwitch__buttonRight: true,
          })}
          onClick={() => handleToggle(true)}
          type="button"
          style={{
            minHeight: `${(height || 0) - 2}px`,
            fontSize: `16px`,
          }}
        >
          <p>
            <span>{rightOption}</span>
          </p>
        </button>
      </div>
    </div>
  );
}
