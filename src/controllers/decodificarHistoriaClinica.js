export function decodificarHistoriaClinica (historias_clinicas){
    historias_clinicas.forEach((hs) => {
        if (hs.historial_trauma_craneal==="1"){
          hs.historial_trauma_craneal = "Si";
        }else{
          hs.historial_trauma_craneal = "No";
        }
        if (hs.sexo==="1"){
          hs.sexo = "Masculino";
        }else{
          hs.sexo = "Femenino";
        }
        if (hs.manualidad==="1"){
          hs.manualidad = "Derecha";
        }else{
          hs.manualidad = "Izquierda";
        }
        if (hs.antecedentes_familiares==="1"){
          hs.antecedentes_familiares = "Si";
        }else{
          hs.antecedentes_familiares = "No";
        }
      });
    return historias_clinicas;
}