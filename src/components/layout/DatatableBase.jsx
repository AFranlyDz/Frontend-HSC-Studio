import DataTable from "react-data-table-component"
import Checkbox from "@mui/material/Checkbox"
import ArrowDownward from "@mui/icons-material/ArrowDownward"

const sortIcon = <ArrowDownward />
const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate }

// Estilos personalizados para la tabla
const customStyles = {
  table: {
    style: {
      width: "100%",
      tableLayout: "fixed", // Fuerza un layout de tabla fijo
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
  return (
    <div className="w-full overflow-hidden">
      <DataTable
        customStyles={customStyles}
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={selectProps}
        sortIcon={sortIcon}
        {...props}
      />
    </div>
  )
}

export default DataTableBase

