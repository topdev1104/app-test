import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .ActionsWrapper {
    width: 100%;
    border-radius: $borderRadius;
    display: flex;
    flex-direction: column;
    transition: $transition;
    padding: 5px;

    &__buttons {
      width: 100%;
      display: flex;
      color: white;
      &__button-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      &__button-title {
        display: flex;
        flex-direction: row;
        padding: 10px;
        font-weight: 600;
        font-size: 12px;
        color: #c8c5e9;
        p {
          margin-left: 10px;
        }
      }
    }
    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 8px;
      font-size: $small;
      flex: 1;
      font-weight: 400;
      transition: $transition;
      cursor: default;
      &:last-of-type {
        border-right: none !important;
      }
      span,
      p {
        opacity: 0.8;
      }
      span {
        font-weight: 600;
        margin-right: 5px;
      }
    }

    &__buttonActive,
    &__buttonSubmitted,
    &__buttonConfirmed,
    &__buttonError {
      span,
      p {
        opacity: 1;
      }
    }
  }
`;

export default staticStyles;
