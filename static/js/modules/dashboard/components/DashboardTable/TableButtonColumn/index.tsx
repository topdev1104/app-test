import { useThemeContext } from '../../../../../libs/aave-ui-kit';
import DefaultButton from '../../../../../components/basic/DefaultButton';
import TableCol from '../TableCol';

import staticStyles from './style';

type TableButtonColumnProps = {
  title: string;
  className?: string;
  disabled: boolean;
  onClick: () => void;
};

export default function TableButtonColumn({
  title,
  className,
  disabled,
  onClick,
}: TableButtonColumnProps) {
  const { currentTheme, xl, lg, md } = useThemeContext();

  const columnWidth = xl && !lg ? 91 : lg && !md ? 90 : md ? 80 : 100;

  return (
    <TableCol maxWidth={columnWidth}>
      <DefaultButton
        className={['TableButtonCol__button', className ?? ''].join(' ')}
        color="dark"
        title={title}
        disabled={disabled}
        onClick={onClick}
      />
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .TableButtonCol__buttonText {
          color: ${currentTheme.textDarkBlue.hex};
        }

        .TableButtonCol__withdraw,
        .TableButtonCol__repay {
          background: rgba(100, 92, 192, 0.4);
          border: 1px solid #8079cb;
        }
      `}</style>
    </TableCol>
  );
}
