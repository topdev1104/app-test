import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TableButtonCol__button {
    width: 90px;
    min-height: 32px;
    margin: 5px 1px;
    font-size: 14px;
    border-radius: 24px;
    padding: 6px 12px;
    transition: 0.1s;
    overflow: hidden;
    &:hover {
      background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
    }
    @include respond-to(xl) {
      width: 70px;
      min-height: 24px;
      font-size: 14px;
    }
    @include respond-to(lg) {
      width: 80px;
      min-height: 28px;
      font-size: 14px;
    }
    @include respond-to(md) {
      width: 70px;
      min-height: 24px;
      font-size: 14px;
    }
  }
`;

export default staticStyles;
