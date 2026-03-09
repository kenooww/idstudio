import { useState, useCallback } from 'react';

export const DEFAULT_DESIGN = {
  bgColor: '#0f2557', bgColor2: '#1a3a8f', accentColor: '#f0c040',
  textColor: '#ffffff', idColor: '#f0c040',
  backBgColor: '#0a1a3a', backBgColor2: '#0f2557',
  orgName: 'ACME CORPORATION', orgSub: 'Official Identification Card', logoText: 'AC',
  photoX: 6, photoY: 22, photoSize: 22,
  nameX: 35, nameY: 38,
  idLabelX: 35, idLabelY: 52, idValX: 35, idValY: 58,
  nameFontSize: 13, idFontSize: 9,
  backGuardianX: 8, backGuardianY: 28,
  backAddressX: 8, backAddressY: 48,
  backContactX: 8, backContactY: 68,
  backFontSize: 8,
  pattern: 'circles', showBorder: true, borderColor: '#f0c040',
  roundness: 10, fontFamily: 'Georgia',
  bgImage: null, useImageBg: false,
  bgImageBack: null, useImageBgBack: false,
  photoShape: 'circle', showOrgHeader: true, showBarcode: true,
  textShadow: false, nameBold: true,
  orientation: 'landscape',
  photoBorderColor: '#f0c040', photoBorderWidth: 2,
};

export function useDesign() {
  const [design, setDesign] = useState(DEFAULT_DESIGN);
  const set = useCallback((key, val) => setDesign(d => ({ ...d, [key]: val })), []);
  const reset = useCallback(() => setDesign(DEFAULT_DESIGN), []);
  return { design, set, reset };
}
