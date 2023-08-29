import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TableHeaderBorrowWrapper {
    display: flex;
    align-items: center;
    margin-left: -150px;
    width: 100%;
    @include respond-to(md) {
      margin-left: -100px;
    }
  }
`;

export default staticStyles;
