import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .MobileTopPanelWrapper {
    display: none;
    @include respond-to(sm) {
      position: relative;
      display: block;
      width: calc(100% - 10px);
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-radius: 8px;
    }

    &__button {
      width: 100%;
      padding: 20px 10px 20px 20px;
    }

    &__content {
      width: 100%;
      padding: 0 10px 20px 20px;
      display: none;
    }
    &__contentVisible {
      display: block;
    }
  }
`;

export default staticStyles;
