import React from 'react';
import SchemaSettings from '../../components/SchemaSettings';
import { CHART_METADATA } from '../../constants';

const TableSettings = ({ option, onChange }) => {
    return (
        <SchemaSettings
            option={option}
            onChange={onChange}
            schema={CHART_METADATA.table.settingsSchema}
        />
    );
};

export default TableSettings;
