import React from 'react';

import { ReferenceInput, SelectInput } from 'react-admin';
import { contentTypesSelector } from '../../selectors/adminSelectors';
import { useSelector } from 'react-redux';

const _ReferenceInput = props => {
  const { refTypeId, source } = props;
  const contentTypes = useSelector(contentTypesSelector);
  const type = contentTypes.find(contentType => contentType.id === refTypeId)?.type.toLowerCase();
  return (
    <ReferenceInput reference={type} source={source}>
      <SelectInput allowEmpty optionText="id" label="Content Type" />
    </ReferenceInput>
  );
};

export const ReferenceInputConfig = props => {
  const { source } = props;
  return (
    <>
      <ReferenceInput
        reference="content-types"
        source={`${source.substring(0, 9)}.refTypeId`}
        label="Content Type"
      >
        <SelectInput optionText="type" />
      </ReferenceInput>
    </>
  );
};

export default _ReferenceInput;
