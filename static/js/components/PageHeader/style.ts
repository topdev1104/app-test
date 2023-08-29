import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/_vars';
  @import 'src/_mixins/_screen-size';

  .PageHeader {
    font-weight: 600;
    font-size: 39px;
    letter-spacing: -0.02em;
    color: white;
    margin-bottom: 16px;
    @include respond-to(sm) {
      text-align: center;
    }
  }
`;

export default staticStyles;
