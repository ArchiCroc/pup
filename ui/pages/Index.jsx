import React from 'react';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import StarIcon from '@ant-design/icons/StarOutlined';

import StyledIndex from './StyledIndex';

const Index = () => (
  <StyledIndex>
    <img
      src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
      alt="Clever Beagle"
    />
    <h1>{i18n.__('index_title')}</h1>
    <p>{i18n.__('index_subtitle')}</p>
    <div>
      <Button href="http://cleverbeagle.com/pup">{i18n.__('index_docs_button')}</Button>
      <> </>
      <Button href="https://github.com/cleverbeagle/pup" icon={<StarIcon />}>
        {i18n.__('index_star_button')}
      </Button>
    </div>
    <footer>
      <p>{i18n.___('index_footer')}</p>
    </footer>
  </StyledIndex>
);

export default Index;
