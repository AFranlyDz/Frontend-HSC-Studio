"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  alpha,
  TableSortLabel,
  Collapse,
} from "@mui/material"
import { FileDownload, ExpandMore, ExpandLess } from "@mui/icons-material"

// Función para convertir datos a CSV
function convertArrayOfObjectsToCSV(data) {
  if (!data || data.length === 0) return null

  const columnDelimiter = ";"
  const lineDelimiter = "\n"
  const keys = Object.keys(data[0])

  let result = ""
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  data.forEach((item) => {
    let ctr = 0
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter
      result += item[key] || ""
      ctr++
    })
    result += lineDelimiter
  })

  return result
}

// Función para descargar CSV
function downloadCSV(data, filename = "HSC-Studio.csv") {
  const link = document.createElement("a")
  let csv = convertArrayOfObjectsToCSV(data)
  if (csv == null) return

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`
  }

  link.setAttribute("href", encodeURI(csv))
  link.setAttribute("download", filename)
  link.click()
}

function MuiDataTable({
  title = "Tabla de Datos",
  columns = [],
  data = [],
  actions = null,
  expandableRows = false,
  expandableRowsComponent = null,
  onRowClick = null,
  pagination = true,
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [5, 10, 25, 50],
  selectable = false,
  loading = false,
  noDataComponent = null,
  showExportButton = true,
  sortByIdDesc = false, // Nueva opción para ordenar por ID descendente
  defaultSortOrder = "desc", // Orden descendente por defecto
  ...props
}) {
  const theme = useTheme()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(paginationPerPage)
  const [selected, setSelected] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [orderBy, setOrderBy] = useState("")
  const [order, setOrder] = useState(defaultSortOrder) // Usar el orden por defecto

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n, index) => index)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, index) => {
    if (!selectable) return

    const selectedIndex = selected.indexOf(index)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const handleExpandClick = (index) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  // Ordenar datos - por defecto descendente si no hay ordenamiento específico
  const sortedData = [...data].sort((a, b) => {
    if (!orderBy) {
      // Si hay sortByIdDesc habilitado, ordenar por ID descendente
      if (sortByIdDesc) {
        return (b.id || 0) - (a.id || 0)
      }
      return 0 // Sin ordenamiento por defecto
    }

    const column = columns.find((col) => col.selector && col.name === orderBy)
    if (!column) return 0

    const aValue = typeof column.selector === "function" ? column.selector(a) : a[column.selector]
    const bValue = typeof column.selector === "function" ? column.selector(b) : b[column.selector]

    if (order === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const paginatedData = pagination ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : sortedData

  const isSelected = (index) => selected.indexOf(index) !== -1

  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Toolbar integrado */}
      <Toolbar
        sx={{
          pl: 2,
          pr: 2,
          py: 1.5,
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: theme.palette.primary.main,
            fontSize: "1.1rem",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Botón de exportar CSV */}
          {showExportButton && data.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownload />}
              onClick={() => downloadCSV(data)}
              sx={{
                textTransform: "none",
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Exportar CSV
            </Button>
          )}

          {/* Acciones personalizadas */}
          {actions}
        </Box>
      </Toolbar>

      {/* Tabla */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {expandableRows && <TableCell sx={{ width: 48 }} />}
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.center ? "center" : column.right ? "right" : "left"}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.grey[50],
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    width: column.width,
                  }}
                  sortDirection={orderBy === column.name ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.name}
                      direction={orderBy === column.name ? order : "asc"}
                      onClick={() => handleRequestSort(column.name)}
                    >
                      {column.name}
                    </TableSortLabel>
                  ) : (
                    column.name
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (expandableRows ? 1 : 0)} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    Cargando...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (expandableRows ? 1 : 0)} align="center">
                  {noDataComponent || (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No hay datos disponibles
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const isItemSelected = isSelected(index)
                const isExpanded = expandedRows.has(index)

                return (
                  <>
                    <TableRow
                      key={index}
                      hover
                      onClick={(event) => {
                        // Solo expandir si no se hace click en un botón
                        if (
                          expandableRows &&
                          !event.target.closest("button") &&
                          !event.target.closest('[role="button"]')
                        ) {
                          handleExpandClick(index)
                        } else if (onRowClick && !event.target.closest("button")) {
                          onRowClick(row)
                        } else if (selectable && !event.target.closest("button")) {
                          handleClick(event, index)
                        }
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      sx={{
                        cursor: expandableRows || onRowClick || selectable ? "pointer" : "default",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" checked={isItemSelected} />
                        </TableCell>
                      )}
                      {expandableRows && (
                        <TableCell sx={{ width: 48 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExpandClick(index)
                            }}
                          >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          align={column.center ? "center" : column.right ? "right" : "left"}
                          sx={{
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            width: column.width,
                            textAlign: column.center ? "center" : column.right ? "right" : "left",
                            "& > *": {
                              display: column.center ? "flex" : "block",
                              justifyContent: column.center ? "center" : column.right ? "flex-end" : "flex-start",
                              alignItems: "center",
                              margin: column.center ? "0 auto" : "0",
                            },
                          }}
                        >
                          {column.cell
                            ? column.cell(row)
                            : typeof column.selector === "function"
                              ? column.selector(row)
                              : row[column.selector]}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* Fila expandible */}
                    {expandableRows && isExpanded && expandableRowsComponent && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length + (selectable ? 1 : 0) + (expandableRows ? 1 : 0)}
                          sx={{ py: 0, border: 0 }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 2 }}>{expandableRowsComponent({ data: row })}</Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={paginationRowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
        />
      )}
    </Paper>
  )
}

export default MuiDataTable
