import classNames from 'classnames';
import staticStyles from './style';

interface TableHeaderButtonProps {
  sortName?: string;
  sortDesc?: boolean;
  sortKey?: string;
  setSortName?: (value: string) => void;
  setSortDesc?: (value: boolean) => void;
  withSorting?: boolean;
  subTitle?: string;
  title: string;
  className?: string;
  size?: 'normal' | 'small';
}

export default function TableHeaderButton({
  sortName,
  sortDesc,
  sortKey,
  setSortName,
  setSortDesc,
  withSorting,
  subTitle,
  title,
  className,
  size = 'normal',
}: TableHeaderButtonProps) {
  const handleSorting = (name: string) => {
    setSortDesc && setSortDesc(false);
    setSortName && setSortName(name);
    if (sortName === name) {
      setSortDesc && setSortDesc(!sortDesc);
    }
  };

  return (
    <>
      {withSorting && sortKey ? (
        <button
          onClick={() => handleSorting(sortKey)}
          className={classNames(
            'TableHeaderButton TableHeaderButton__withSort',
            {
              TableHeaderButton__desk: sortName === sortKey && sortDesc,
              TableHeaderButton__sort: sortName === sortKey,
              TableHeaderButton__withSubTitle: !!subTitle,
            },
            className,
            `TableHeaderButton__${size}`
          )}
          type="button"
        >
          {!!subTitle && <span>{subTitle}</span>}
          <div>
            <p style={{ marginRight: '9px' }}>{title}</p>
          </div>
        </button>
      ) : (
        <div
          className={classNames(
            'TableHeaderButton',
            {
              TableHeaderButton__withSubTitle: !!subTitle,
            },
            className
          )}
        >
          {!!subTitle && <span>{subTitle}</span>}
          <div>
            <p>{title}</p>
          </div>
        </div>
      )}

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .TableHeaderButton {
          color: rgba(255, 255, 255, 0.6);
          span {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      `}</style>
    </>
  );
}
