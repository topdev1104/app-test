import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .DepositDashboardTable {
    &__header {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      display: flex;
      flex-direction: row;
      width: 100%;
    }
  }
`;

export default staticStyles;
