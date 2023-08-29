import { ReactNode } from 'react';
import classNames from 'classnames';
import { useThemeContext, AnimationArrow, DropdownWrapper } from '../../../libs/aave-ui-kit/index';

import { TokenIcon } from '../../../helpers/config/assets-config';
import staticStyles from './style';

interface SelectTokenFieldProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  value: any;
  placeholder?: string;
  className?: string;
}

export default function SelectTokenField({
  visible,
  setVisible,
  children,
  disabled,
  value,
  placeholder,
  className,
}: SelectTokenFieldProps) {
  const { currentTheme, xl } = useThemeContext();

  const IS_SIFU_OLD = value.symbol === 'SIFU_OLD';
  const symbolLabel = IS_SIFU_OLD ? 'SIFU (old)' : value.symbol;

  return (
    <DropdownWrapper
      visible={visible}
      setVisible={setVisible}
      className={classNames('SelectTokenField', { SelectTokenField__active: visible }, className)}
      verticalPosition="bottom"
      horizontalPosition="left"
      buttonComponent={
        <button
          className={classNames('SelectTokenField__select', {
            SelectTokenField__selectActive: visible,
          })}
          disabled={disabled}
          type="button"
          onClick={() => setVisible(!visible)}
        >
          <div className="SelectTokenField__select-value">
            <TokenIcon tokenSymbol={value.symbol.toUpperCase()} height={30} width={30} />
            <span>{placeholder && !value ? placeholder : symbolLabel}</span>
          </div>

          <AnimationArrow
            active={visible}
            width={xl ? 14 : 18}
            height={xl ? 8 : 10}
            marginLeft={5}
            arrowTopPosition={4}
            arrowWidth={xl ? 9 : 11}
            arrowHeight={2}
            color={visible ? currentTheme.secondary.hex : currentTheme.textDarkBlue.hex}
          />
        </button>
      }
    >
      <div className="SelectTokenField__items">{children}</div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .SelectTokenField {
          &__select {
            background: #0d093f;
            color: ${currentTheme.textDarkBlue.hex};
          }
        }
      `}</style>
    </DropdownWrapper>
  );
}
