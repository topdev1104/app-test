import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/_vars';
  @import 'src/_mixins/screen-size';

  .BasicTableBorrow {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    width: calc(100% + 30px);
    margin: 0 0 0 -15px;
    position: relative;
    z-index: 1;
    @include respond-to(sm) {
      flex: none;
      display: block;
      margin: 0;
      width: 100%;
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    &__content {
      display: flex;
      flex-direction: column;
      flex: auto;
      @include respond-to(sm) {
        height: auto;
      }
    }

    &__content-inner {
      display: block;
      padding-top: 8px;
      @include respond-to(sm) {
        padding: 5px 5px 12px;
      }
    }

    &__header {
    }
  }
`;

export default staticStyles;
