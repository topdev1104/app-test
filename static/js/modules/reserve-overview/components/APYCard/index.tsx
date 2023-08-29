import { ReactNode } from 'react';
import classNames from 'classnames';

import { useThemeContext } from '../../../../libs/aave-ui-kit';

import staticStyles from './style';

interface APYCardProps {
  title: string;
  children?: ReactNode;
}

export default function APYCard({ title, children }: APYCardProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div className={classNames('APYCard', `APYCard__color`)}>
      <div className="APYCard__title">
        <p>{title}</p>
      </div>
      <div className="APYCard__content">{children}</div>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .APYCard {
          .APYCard__title {
            p {
              color: ${currentTheme.white.hex};
            }
          }
        }
      `}</style>
    </div>
  );
}
