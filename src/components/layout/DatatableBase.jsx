import DataTable from "react-data-table-component"
import Checkbox from "@mui/material/Checkbox"
import ArrowDownward from "@mui/icons-material/ArrowDownward"
import Button from "@mui/material/Button" // Importamos el componente Button de MUI
import React from "react"

const sortIcon = <ArrowDownward />
const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate }

// Función para convertir datos a CSV (tomada de la documentación oficial)
function convertArrayOfObjectsToCSV(data) {
  let result

  const columnDelimiter = ';'
  const lineDelimiter = '\n'
  const keys = Object.keys(data[0])

  result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  data.forEach(item => {
    let ctr = 0
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter

      result += item[key]
      
      ctr++
    })
    result += lineDelimiter
  })

  return result
}

// Función para descargar CSV (tomada de la documentación oficial)
function downloadCSV(data) {
  const link = document.createElement('a')
  let csv = convertArrayOfObjectsToCSV(data)
  if (csv == null) return

  const filename = 'HSC-Studio.csv'

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`
  }

  link.setAttribute('href', encodeURI(csv))
  link.setAttribute('download', filename)
  link.click()
}

// Componente Export personalizado usando MUI Button
const Export = ({ onExport }) => (
  <Button 
    variant="contained" 
    color="primary" 
    onClick={() => onExport()}
    sx={{ marginRight: 2 }}
  >
    Exportar CSV
  </Button>
)

// Estilos personalizados para la tabla
const customStyles = {
  table: {
    style: {
      width: "100%",
      tableLayout: "fixed",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      fontWeight: "bold",
      minHeight: "52px",
    },
  },
  rows: {
    style: {
      minHeight: "60px",
      "&:not(:last-of-type)": {
        borderBottom: "1px solid #f3f4f6",
      },
    },
  },
  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  headCells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
      fontWeight: "bold",
    },
  },
}

function DataTableBase(props) {
  // Creamos las acciones memoizadas
  const actionsMemo = React.useMemo(
    () => <Export onExport={() => downloadCSV(props.data)} />,
    [props.data]
  )

  return (
    <div className="w-full overflow-hidden">
      <DataTable
        customStyles={customStyles}
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={selectProps}
        sortIcon={sortIcon}
        actions={actionsMemo}
        {...props}
      />
    </div>
  )
}

export default DataTableBase