import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css`
  @import 'src/_mixins/screen-size';
  @import 'src/_mixins/vars';

  .Caption {
    &__primary {
      color: white;
    }

    h2 {
      margin-bottom: 16px;
      font-weight: 600;
      font-size: 23px;
      line-height: 28px;
    }
    &__description {
      margin-bottom: 24px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
    }
  }
`;

export default staticStyles;
