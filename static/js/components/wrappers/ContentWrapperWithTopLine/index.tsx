import { ReactNode, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import staticStyles from './style';

interface ContentWrapperWithTopLineProps {
  className?: string;
  title: string;
  topRightInfo?: ReactNode;
  children: ReactNode;
  withDropdown?: boolean;
}

export default function ContentWrapperWithTopLine({
  className,
  title,
  topRightInfo,
  children,
  withDropdown,
}: ContentWrapperWithTopLineProps) {
  const intl = useIntl();
  const { currentTheme, sm, isCurrentThemeDark } = useThemeContext();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible && !sm) {
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sm]);

  return (
    <div
      className={classNames(
        'ContentWrapperWithTopLine',
        { ContentWrapperWithTopLine__withDropdown: withDropdown },
        className
      )}
    >
      <div
        className={classNames('ContentWrapperWithTopLine__content', {
          ContentWrapperWithTopLine__contentActive: visible,
        })}
      >
        {children}
      </div>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .ContentWrapperWithTopLine {
          &__top-line {
            color: ${currentTheme.white.hex};
          }
        }
      `}</style>
    </div>
  );
}
