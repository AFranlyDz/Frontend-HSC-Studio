"use client"
import { Tabs, Tab, Box, useTheme } from "@mui/material"

// Componente TabPanel para el contenido de cada tab
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

// Función para generar props de accesibilidad
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export const MuiTabs = ({ tabs, activeTab = 0, onTabChange }) => {
  const theme = useTheme()

  const handleTabChange = (event, newValue) => {
    if (onTabChange) {
      onTabChange(newValue)
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="tabs"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: 3,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              minHeight: 48,
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              "&:hover": {
                color: theme.palette.primary.main,
                opacity: 0.8,
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  )
}

export default MuiTabs
