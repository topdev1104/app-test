import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .Footer {
    position: relative;
    z-index: 2;
    padding: 10px 15px 10px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    height: 76px;
    @include respond-to(xl) {
      padding: 10px 10px 5px;
    }
    @include respond-to(sm) {
      display: none;
    }

    &__inside {
      @include respond-to(md) {
        display: none;
      }
    }

    &__menu {
      display: flex;
      flex-direction: row;
      &__social {
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: rgba(255, 255, 255, 0.6);
      }
      &__social,
      &__info {
        display: flex;
        flex-direction: row;
      }

      &__info {
        margin-left: 32px;
      }

      &__social a,
      &__info a {
        color: rgba(255, 255, 255, 0.6);
        font-weight: 400;
        font-size: 14px;
        margin-right: 32px;
      }
    }
    &__block {
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;

      &__point {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background-color: #1bc35c;
        margin-right: 4px;
      }
    }

    .DarkModeSwitcher {
      margin-right: 10px;
    }
  }
`;

export default staticStyles;
