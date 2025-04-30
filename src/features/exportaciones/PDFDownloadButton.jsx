// components/PDFGenerator/PDFDownloadButton.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PlanillaRecoleccion from './PlanillaRecoleccion';
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CircularProgress from '@mui/material/CircularProgress';

const PDFDownloadButton = () => {
  const paciente = useSelector((state) => state.historiaClinica.datos);

  if (!paciente) return null;

  return (
    <PDFDownloadLink
      document={<PlanillaRecoleccion paciente={paciente} />}
      fileName={`Planilla_Recoleccion_${paciente.seudonimo}.pdf`}
    >
      {({ loading }) => (
        <Button
          variant="contained"
          color="secondary"
          startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            padding: '8px 16px',
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          }}
        >
          {loading ? 'Generando PDF...' : 'Descargar Planilla PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;