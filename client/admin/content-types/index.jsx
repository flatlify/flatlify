import React from 'react';
import {
  ArrayInput,
  BooleanInput,
  Create,
  Edit,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  FormDataConsumer,
} from 'react-admin';
import BookIcon from '@material-ui/icons/Book';
import { ContentTypeList } from './ContentTypeList';
import { ImageInputConfig, ImageField } from '../components/ImageInput';
import { ReferenceInputConfig } from '../components/ReferenceInput';

import get from 'lodash/get';
import OrderedFormIterator from '../components/OrderedFormIterator';

const ContentTypeTitle = ({ record }) => {
  return <span>Content Type {record ? `"${record.type}"` : ''}</span>;
};
const getFieldConfig = (fieldType, source) => {
  switch (fieldType) {
    case 'ImageInput':
      return <ImageInputConfig source={source} />;
    case 'ReferenceInput':
      return <ReferenceInputConfig source={source} />;
    default:
      return <></>;
  }
};

const Fields = props => {
  return (
    <>
      <TextInput source="type" validate={required()} />
      <SelectInput source="icon" label="icon" choices={[{ id: 'BookIcon', name: 'BookIcon' }]} />
      <ArrayInput source="fields">
        <OrderedFormIterator>
          <TextInput required label="Field name" source="title" />
          <SelectInput
            source="fieldType"
            label="Field Type"
            defaultValue="TextInput"
            choices={[
              { id: 'TextInput', name: 'Text' },
              { id: 'RichTextInput', name: 'Rich Text' },
              { id: 'ImageInput', name: 'Image' },
              { id: 'ReferenceInput', name: 'ReferenceInput' },
            ]}
          />
          {getFieldConfig()}
          <FormDataConsumer>
            {props => {
              return getFieldConfig(
                get(props, `formData.${props.id.substring(0, 9)}.fieldType`),
                props.id,
              );
            }}
          </FormDataConsumer>
          <BooleanInput label="Is required?" source="isRequired" />
          <BooleanInput label="Display in list view?" source="_gridDisplay_" />
        </OrderedFormIterator>
      </ArrayInput>
    </>
  );
};

export const ContentTypeEdit = props => {
  return (
    <Edit title={<ContentTypeTitle />} {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <Fields />
      </SimpleForm>
    </Edit>
  );
};

export const ContentTypeCreate = props => {
  return (
    <Create title="Create a ContentType" {...props}>
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Create>
  );
};

export default {
  list: ContentTypeList,
  create: ContentTypeCreate,
  edit: ContentTypeEdit,
  show: ContentTypeEdit,
  icon: BookIcon,
};
