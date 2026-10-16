// Global Imports
import React from 'react';

// Components Imports
import TabScreen from '../../Components/TabScreen';
import QRCodeShowcase from './QRCodeTab';
import BarcodeShowcase from './BarcodeTab';

const TABS = [
  { key: 'qrcode', label: 'QR Code', component: QRCodeShowcase },
  { key: 'barcode', label: 'Barcode', component: BarcodeShowcase },
];

const Showcase = ({ route }) => {
  return <TabScreen title='Showcase' tabs={TABS} initialTab={route.params?.tab} />;
};

export default Showcase;
