// Global Imports
import React from 'react';

// Components Imports
import TabScreen from '../../Components/TabScreen';
import QRCodePlayground from './QRCodeTab';
import BarcodePlayground from './BarcodeTab';

const TABS = [
  { key: 'qrcode', label: 'QR Code', component: QRCodePlayground },
  { key: 'barcode', label: 'Barcode', component: BarcodePlayground },
];

const Playground = ({ route }) => {
  return <TabScreen title='Playground' tabs={TABS} initialTab={route.params?.tab} />;
};

export default Playground;
