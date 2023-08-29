import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .AssetsFilterPanel {
    margin-bottom: 30px;
    display: flex;
    .LabeledSwitch {
      &__inner {
        background: #0d0745;
      }
      &__pointer span {
        background: #312893;
        border-radius: 24px;
      }
    }
    @include respond-to(xl) {
      margin-bottom: 20px;
    }
    @include respond-to(sm) {
      margin-bottom: 30px;
      justify-content: center;
    }

    &__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      @include respond-to(sm) {
        justify-content: center;
      }
    }

    &__search-inner {
      @include respond-to(sm) {
        display: none;
      }
    }
  }
`;

export default staticStyles;
