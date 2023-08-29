import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .MarketTable {
    @include respond-to(xl) {
    }
    @include respond-to(sm) {
      display: none !important;
    }
    padding-right: 12.5px;
    padding-left: 12.5px;

    &__header-column {
      &:first-of-type {
        align-items: flex-start;
        justify-content: flex-start;
        min-width: 270px;
        @media only screen and (max-width: 850px) {
          min-width: 80px;
        }
        @include respond-to(sm) {
          max-width: 60px;
          min-width: 60px;
        }
        @include respond-to(xs) {
          max-width: 60px;
          min-width: 35px;
        }
        @media only screen and (max-width: 400px) {
          max-width: 40px;
        }
      }
      &:nth-of-type(3) {
        @include respond-to(sm) {
          display: none;
        }
      }
    }
  }
`;

export default staticStyles;
