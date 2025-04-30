import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';

// Registrar fuentes
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 },
  ],
});

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3366cc',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3366cc',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#444',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f9ff',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3366cc',
  },
  subsection: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f0f7ff',
    borderRadius: 3,
    borderLeftWidth: 2,
    borderLeftColor: '#99c2ff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3366cc',
    color: 'white',
    padding: 5,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    padding: 2,
  },
  tableCellSmall: {
    flex: 0.5,
    fontSize: 8,
    padding: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

const PlanillaRecoleccion = ({ paciente }) => {
  if (!paciente) return null;

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  // Función para formatear booleanos
  const formatBoolean = (value) => {
    return value ? 'Sí' : 'No';
  };

  // Función para formatear valores numéricos
  const formatNumber = (value) => {
    return value !== undefined && value !== null ? value.toString() : 'N/A';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>PLANILLA DE RECOLECCIÓN DE DATOS</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            Paciente: {paciente.seudonimo} ({paciente.nombre} {paciente.apellidos})
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 10, marginTop: 5 }}>
            Generado el: {new Date().toLocaleDateString('es-ES')}
          </Text>
        </View>

        {/* Datos básicos del paciente */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>INFORMACIÓN BÁSICA DEL PACIENTE</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>ID/Número:</Text>
            <Text style={styles.value}>{paciente.numero || 'N/A'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Nombre completo:</Text>
            <Text style={styles.value}>{paciente.nombre} {paciente.apellidos}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Seudónimo:</Text>
            <Text style={styles.value}>{paciente.seudonimo || 'N/A'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Edad:</Text>
            <Text style={styles.value}>{paciente.edad || 'N/A'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Sexo:</Text>
            <Text style={styles.value}>{paciente.sexo ? 'Masculino' : 'Femenino'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Historial trauma craneal:</Text>
            <Text style={styles.value}>{formatBoolean(paciente.historial_trauma_craneal)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Manualidad:</Text>
            <Text style={styles.value}>{paciente.manualidad ? 'Diestro' : 'Zurdo'}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Antecedentes familiares:</Text>
            <Text style={styles.value}>{formatBoolean(paciente.antecedentes_familiares)}</Text>
          </View>
        </View>

        {/* Factores predisponentes (RCG) */}
        {paciente.rcg?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>FACTORES PREDISPONENTES (RCG)</Text>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>ID</Text>
              <Text style={styles.tableCell}>Factor</Text>
              <Text style={styles.tableCell}>Nombre corto</Text>
              <Text style={styles.tableCell}>Descripción</Text>
              <Text style={styles.tableCell}>Clasificación</Text>
              <Text style={styles.tableCell}>Notas</Text>
            </View>
            
            {paciente.rcg.map((factor) => (
              <View key={factor.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{factor.id}</Text>
                <Text style={styles.tableCell}>{factor.codificador.nombre}</Text>
                <Text style={styles.tableCell}>{factor.codificador.nombre_corto}</Text>
                <Text style={styles.tableCell}>{factor.codificador.descripcion}</Text>
                <Text style={styles.tableCell}>{factor.codificador.clasificacion}</Text>
                <Text style={styles.tableCell}>{factor.notas || 'N/A'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Episodios */}
        {paciente.episodios?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>EPISODIOS CLÍNICOS</Text>
            
            {paciente.episodios.map((episodio) => (
              <View key={episodio.id} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#3366cc' }}>
                  EPISODIO {episodio.id} - {formatDate(episodio.inicio)} a {formatDate(episodio.fecha_alta)}
                </Text>
                
                <View style={styles.subsection}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Información General</Text>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Duración de la estadía:</Text>
                    <Text style={styles.value}>{episodio.tiempo_estadia} días</Text>
                  </View>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Estado al egreso:</Text>
                    <Text style={styles.value}>{formatBoolean(episodio.estado_al_egreso)}</Text>
                  </View>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Tiempo antecedente:</Text>
                    <Text style={styles.value}>{episodio.tiempo_antecedente || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Descripción antecedente:</Text>
                    <Text style={styles.value}>{episodio.descripcion_antecedente || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Edad del paciente:</Text>
                    <Text style={styles.value}>{episodio.edad_paciente || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Observaciones:</Text>
                    <Text style={styles.value}>{episodio.observaciones || 'N/A'}</Text>
                  </View>
                </View>

                {/* Rasgos clínicos del episodio (RCE) */}
                {episodio.rce?.length > 0 && (
                  <View style={styles.subsection}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Rasgos Clínicos del Episodio (RCE)</Text>
                    
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableCell, { flex: 0.5 }]}>ID</Text>
                      <Text style={styles.tableCell}>Rasgo Clínico</Text>
                      <Text style={styles.tableCell}>Nombre corto</Text>
                      <Text style={styles.tableCell}>Descripción</Text>
                      <Text style={styles.tableCell}>Clasificación</Text>
                      <Text style={styles.tableCell}>Tiempo</Text>
                      <Text style={styles.tableCell}>Notas</Text>
                    </View>
                    
                    {episodio.rce.map((rce) => (
                      <View key={rce.id} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 0.5 }]}>{rce.id}</Text>
                        <Text style={styles.tableCell}>{rce.codificador.nombre}</Text>
                        <Text style={styles.tableCell}>{rce.codificador.nombre_corto}</Text>
                        <Text style={styles.tableCell}>{rce.codificador.descripcion}</Text>
                        <Text style={styles.tableCell}>{rce.codificador.clasificacion}</Text>
                        <Text style={styles.tableCell}>{rce.tiempo || 'N/A'}</Text>
                        <Text style={styles.tableCell}>{rce.notas || 'N/A'}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Hematomas subdurales */}
                {episodio.hematomas_subdurales?.length > 0 && (
                  <View style={styles.subsection}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Hematomas Subdurales</Text>
                    
                    {episodio.hematomas_subdurales.map((hematoma) => (
                      <View key={hematoma.id} style={{ marginBottom: 10 }}>
                        <View style={styles.row}>
                          <Text style={styles.label}>ID Hematoma:</Text>
                          <Text style={styles.value}>{hematoma.id}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Escala Glasgow al ingreso:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.escala_glasgow_ingreso)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Escala McWalder:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.escala_mcwalder)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Escala Gordon Firing:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.escala_gordon_firing)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Escala pronóstica Oslo preoperatoria:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.escala_pronostica_oslo_preoperatoria)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Escala Nomura:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.escala_nomura)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Escala Nakagushi:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.escala_nakagushi)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Volumen TADA:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.volumen_tada)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Volumen:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.volumen)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Grupo volumen:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.grupo_volumen)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Grupo volumen residual posoperatorio:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.grupo_volumen_residual_posoperatorio)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Presencia de membrana:</Text>
                          <Text style={styles.value}>{formatBoolean(hematoma.presencia_membrana)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Tipo de membrana:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.tipo_membrana)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Localización:</Text>
                          <Text style={styles.value}>{hematoma.localización || 'N/A'}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Topografía:</Text>
                          <Text style={styles.value}>{hematoma.topografia || 'N/A'}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Desviación línea media:</Text>
                          <Text style={styles.value}>{formatNumber(hematoma.desviacion_linea_media)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Método de lectura:</Text>
                          <Text style={styles.value}>{formatBoolean(hematoma.metodo_lectura)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Observaciones:</Text>
                          <Text style={styles.value}>{hematoma.observaciones || 'N/A'}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Registros operatorios */}
                {episodio.registro_operatorio?.length > 0 && (
                  <View style={styles.subsection}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Registros Operatorios</Text>
                    
                    {episodio.registro_operatorio.map((registro) => (
                      <View key={registro.id} style={{ marginBottom: 15 }}>
                        <View style={styles.row}>
                          <Text style={styles.label}>ID Registro:</Text>
                          <Text style={styles.value}>{registro.id}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Fecha de operación:</Text>
                          <Text style={styles.value}>{formatDate(registro.fecha_operacion)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Es reintervención:</Text>
                          <Text style={styles.value}>{formatBoolean(registro.es_reintervencion)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Escala Glasgow resultados:</Text>
                          <Text style={styles.value}>{formatNumber(registro.escala_evaluacion_resultados_glasgow)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Estado al egreso:</Text>
                          <Text style={styles.value}>{formatBoolean(registro.estado_egreso)}</Text>
                        </View>
                        
                        <View style={styles.row}>
                          <Text style={styles.label}>Observaciones:</Text>
                          <Text style={styles.value}>{registro.observaciones || 'N/A'}</Text>
                        </View>

                        {/* Registros posoperatorios */}
                        {registro.registros_posoperatorios?.length > 0 && (
                          <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>Registros Posoperatorios</Text>
                            
                            <View style={styles.tableHeader}>
                              <Text style={[styles.tableCell, { flex: 0.5 }]}>ID</Text>
                              <Text style={styles.tableCell}>Fecha</Text>
                              <Text style={styles.tableCell}>Tiempo transcurrido</Text>
                              <Text style={styles.tableCell}>Escala pronóstica Oslo posoperatoria</Text>
                              <Text style={styles.tableCell}>Recurrencia hematoma</Text>
                              <Text style={styles.tableCell}>Gradación pronóstica para recurrencia HSC unilateral</Text>
                            </View>
                            
                            {registro.registros_posoperatorios.map((posop) => (
                              <View key={posop.id} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 0.5 }]}>{posop.id}</Text>
                                <Text style={styles.tableCell}>{formatDate(posop.fecha)}</Text>
                                <Text style={styles.tableCell}>{formatNumber(posop.tiempo_transcurrido)}</Text>
                                <Text style={styles.tableCell}>{formatNumber(posop.escala_pronostica_oslo_posoperatoria)}</Text>
                                <Text style={styles.tableCell}>{formatBoolean(posop.recurrencia_hematoma)}</Text>
                                <Text style={styles.tableCell}>{formatNumber(posop.gradacion_pronostica_para_recurrencia_hsc_unilateral)}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Rasgos clínicos operatorios */}
                        {registro.rasgos_clinicos_operatorios?.length > 0 && (
                          <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>Rasgos Clínicos Operatorios</Text>
                            
                            <View style={styles.tableHeader}>
                              <Text style={[styles.tableCell, { flex: 0.5 }]}>ID</Text>
                              <Text style={styles.tableCell}>Rasgo Clínico</Text>
                              <Text style={styles.tableCell}>Nombre corto</Text>
                              <Text style={styles.tableCell}>Descripción</Text>
                              <Text style={styles.tableCell}>Clasificación</Text>
                            </View>
                            
                            {registro.rasgos_clinicos_operatorios.map((rasgo) => (
                              <View key={rasgo.id} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 0.5 }]}>{rasgo.id}</Text>
                                <Text style={styles.tableCell}>{rasgo.codificador.nombre}</Text>
                                <Text style={styles.tableCell}>{rasgo.codificador.nombre_corto}</Text>
                                <Text style={styles.tableCell}>{rasgo.codificador.descripcion}</Text>
                                <Text style={styles.tableCell}>{rasgo.codificador.clasificacion}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Pie de página */}
        <Text style={styles.footer}>
          Documento generado automáticamente por el sistema - Confidencial
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default PlanillaRecoleccion;