import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/screen-size';
  @import 'src/_mixins/vars';

  .SelectTokenField {
    .DropdownWrapper__content {
      width: 100%;
      top: 0;
    }

    &__select {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      box-shadow: $boxShadow;
      font-size: $regular;

      border-radius: 8px;
      @include respond-to(xl) {
        padding: 10px 12px;
        font-size: $small;
      }
      @include respond-to(sm) {
        font-size: $medium;
      }
    }

    &__select-value {
      display: flex;
      align-items: center;

      span {
        font-size: $large;
      }
    }

    &__selectValueActive {
      opacity: 1;
    }

    &__items {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: #1c165b;
      color: white;
    }
  }
`;

export default staticStyles;
