import { ReactNode } from 'react';

import { useThemeContext } from '../../libs/aave-ui-kit';

import staticStyles from './style';

interface DesktopPageTitleProps {
  title: string | ReactNode;
  subTitle?: string | ReactNode;
}

export default function DesktopPageTitle({ title, subTitle }: DesktopPageTitleProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div className="DesktopPageTitle">
      <h2>
        <div>{title}</div>
      </h2>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true}>{`
        .DesktopPageTitle {
          padding-left: 24px;
          h2 {
            color: ${currentTheme.white.hex};
            font-weight: 600;
            font-size: 39px;
            line-height: 47px;
          }
        }
      `}</style>
    </div>
  );
}
