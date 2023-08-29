import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .WithdrawAmount {
    @include respond-to(sm) {
      padding: 10px;
    }
  }
`;

export default staticStyles;
