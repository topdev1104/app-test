import { ReactNode } from 'react';
import classNames from 'classnames';

import { useThemeContext } from '../../../libs/aave-ui-kit';
import GradientLine from '../../basic/GradientLine';

import staticStyles from './style';

interface RepayWithdrawWrapperProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function RepayWithdrawWrapper({
  title,
  children,
  className,
}: RepayWithdrawWrapperProps) {
  const { currentTheme, sm } = useThemeContext();

  return (
    <div className={classNames('RepayWithdrawWrapper', className)}>
      <div className="RepayWithdrawWrapper__caption">
        <p>{title}</p>
      </div>

      <div className="RepayWithdrawWrapper__content">{children}</div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true}>{`
        .RepayWithdrawWrapper {
          color: ${currentTheme.white.hex};
          border: 1px solid rgba(57, 48, 159, 0.1);
          background: #120d48;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
