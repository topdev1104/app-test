import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TableButtonCol__button {
    width: 90px;
    min-height: 32px;
    padding: 8px 4px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    font-family: 'Inter', sans-serif;
    @include respond-to(xl) {
      min-height: 24px;
      font-size: 14px;
    }
    @include respond-to(lg) {
      min-height: 28px;
      font-size: 14px;
    }
    @include respond-to(md) {
      min-height: 24px;
      font-size: 14px;
    }
  }
`;

export default staticStyles;
