import classNames from 'classnames';
import { useThemeContext } from '../../../../../libs/aave-ui-kit';

import staticStyles from './style';

type TableHeaderProps = {
  head: string[];
  isDeposit?: boolean;
  className?: string;
};

export default function TableHeader({ head, isDeposit, className }: TableHeaderProps) {
  const { sm } = useThemeContext();

  return (
    <div className={classNames('TableHeader', className)}>
      <div className="TableHeader__inner">
        {head.map((title, i) => (
          <div key={`table-${title}-${i}`} className="TableHeader__item">
            <p className="TableHeader__title">{title}</p>
          </div>
        ))}
        {!sm && (
          <>
            <div className="TableHeader__item" />
          </>
        )}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
