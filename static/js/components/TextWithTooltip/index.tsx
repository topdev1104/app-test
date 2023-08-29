import React, { ReactNode } from 'react';
import { useThemeContext } from '../../libs/aave-ui-kit';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';

import staticStyles from './style';
// import info from './images/info.svg';
// import infoGrayDark from './images/infoGrayDark.svg';

export type AdditionalItemProps = {
  height: number;
  width: number;
  containerClassName: string;
  containerStyle: React.CSSProperties;
  iconTheme: 'dark' | 'gray' | 'default';
};

export type TextWithTooltipProps = {
  id: string;
  text: string;
  children: ReactNode;
  color?: 'dark' | 'white' | 'primary';
  type?: any;
  iconSize?: number;
  className?: string;
  withGrayIcon?: boolean;
  place?: 'top' | 'bottom';
};

export default function TextWithTooltip({
  id,
  text,
  color = 'dark',
  children,
  className,
  withGrayIcon,
  type = 'info',
  place = 'top',
}: TextWithTooltipProps) {
  const { currentTheme } = useThemeContext();
  const tooltipId = `tooltip_${id.replace(' ', '_')}`;

  return (
    <div className={classNames('TextWithTooltip', `TextWithTooltip__${color}`)}>
      <div data-tip data-for={tooltipId} className="title">
        {!!text && text}
        {/*<img src={withGrayIcon ? infoGrayDark : info} alt={text} height={14} width={14} />*/}
      </div>

      <ReactTooltip
        className="TextWithTooltip__content"
        id={tooltipId}
        place={place}
        multiline={true}
        type={type}
        border
        backgroundColor={'#7159ff'}
      >
        {children}
      </ReactTooltip>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .TextWithTooltip {
          &__white {
            .title {
              color: ${currentTheme.white.hex};
            }
          }
          &__primary {
            .title {
              color: ${currentTheme.primary.hex};
            }
          }
        }
      `}</style>
    </div>
  );
}
