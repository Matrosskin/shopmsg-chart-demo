"use strict";
import * as React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, DatePicker, Switch } from 'antd';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

interface ReportsFilterFormProps extends FormComponentProps {
  onChange: Function,
  filterParams: {optinsEnabled: boolean, recipientsEnabled: boolean, dateRange: Array<any>}
}

export const ReportsFilterForm = Form.create({
  onValuesChange(props: {onChange: Function}, changedValues, allValues) {
    props.onChange({
      dateRange: allValues.dateRange,
      optinsEnabled: allValues.optinsEnabled,
      recipientsEnabled: allValues.recipientsEnabled,
    });
  }
})(class extends React.Component<ReportsFilterFormProps, any> {
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      }
    };

    const { getFieldDecorator } = this.props['form'];

    return (
        <Form>

          <FormItem
            {...formItemLayout}
            label="Date Range:"
          >
            {getFieldDecorator('dateRange', { valuePropName: 'value', initialValue: this.props.filterParams.dateRange })(
              <RangePicker/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Show Optins:"
          >
            {getFieldDecorator('optinsEnabled', { valuePropName: 'checked', initialValue: this.props.filterParams.optinsEnabled })(
              <Switch/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Show Pecipients:"
          >
            {getFieldDecorator('recipientsEnabled', { valuePropName: 'checked', initialValue: this.props.filterParams.recipientsEnabled })(
              <Switch/>
            )}
          </FormItem>

        </Form>
    );
  }
})
