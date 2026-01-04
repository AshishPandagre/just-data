import React from 'react';
import SchemaSettings from '../../components/SchemaSettings';
import { CHART_METADATA } from '../../constants';

const RadarSettings = ({ option, onChange }) => {
    return (
        <SchemaSettings
            option={option}
            onChange={onChange}
            schema={CHART_METADATA.radar.settingsSchema}
        />
    );
};

export default RadarSettings;
