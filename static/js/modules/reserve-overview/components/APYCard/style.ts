import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .APYCard {
    border-radius: 16px;
    margin-top: 5px;
    width: 100%;
    padding: 16px;

    @include respond-to(xl) {
      //width: 200px;
    }
    @include respond-to(lg) {
      //width: 150px;
      //margin: 0 7px;
    }
    @include respond-to(md) {
      //width: 200px;
    }
    @include respond-to(sm) {
      width: 100%;
    }

    &__title {
      padding: 5px;
      p {
        font-weight: 600;
        font-size: 18px;
        line-height: 22px;
        @include respond-to(xl) {
          font-size: 18px;
        }
        @include respond-to(sm) {
          font-size: 18px;
        }
      }
    }

    &__content {
      padding-top: 16px;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      @include respond-to(lg) {
        padding: 5px;
      }
      @include respond-to(md) {
        padding: 10px;
      }
    }
  }
`;

export default staticStyles;
