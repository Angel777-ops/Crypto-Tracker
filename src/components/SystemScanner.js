import React from 'react';
import { LivePulseWrapper, PulseDot, ScannerWrapper, ScannerText, BlockGrid, Block } from '../pages/Home/styles';

const SystemScanner = () => {
  return (
    <>
      <LivePulseWrapper>
        <PulseDot />
        <span>SISTEMA: EN LÍNEA // FEED DE DATOS ACTIVO</span>
      </LivePulseWrapper>

      <ScannerWrapper>
        <ScannerText>Escaneando Bloques de Red... [OK]</ScannerText>
        <BlockGrid>
          {[...Array(15)].map((_, i) => (
            <Block key={i} $delay={i * 0.2} />
          ))}
        </BlockGrid>
      </ScannerWrapper>
    </>
  );
};

export default SystemScanner;
