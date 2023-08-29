import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TableHeader {
    display: block;
    width: 100%;
    padding: 0 10px;
    @include respond-to(sm) {
      padding: 0 20px;
    }

    &__inner {
      display: flex;
      flex-direction: row;
      flex: 2;
      width: 100%;
      margin-bottom: 10px;
      @include respond-to(sm) {
        margin-bottom: 3px;
      }
    }

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      text-align: center;
      flex: 1;

      &:nth-child(1) {
        align-items: start;
      }
      @include respond-to(sm) {
        &:last-child {
          align-items: flex-end;
        }
      }
    }

    &__title,
    .TextWithModal__text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      @include respond-to(xl) {
        font-size: $regular;
      }
      @include respond-to(lg) {
        font-size: $medium;
      }
      @include respond-to(md) {
        font-size: $small;
      }
    }
  }
`;

export default staticStyles;
