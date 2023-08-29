import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .CollateralCompositionBar.Row {
    align-items: center;
  }

  .CompositionBar {
    height: 10px;
    &__wrapper {
      height: 10px;
    }
  }
`;

export default staticStyles;
