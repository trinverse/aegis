import React, { useState, useContext } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Security,
  BarChart,
  People,
  Public,
  ChevronLeft,
  ChevronRight,
  LightMode,
  DarkMode,
  SettingsBrightness,
} from '@mui/icons-material';
import type { View } from '../App';
import { ColorModeContext } from '../index';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  hasAnalysis: boolean;
}

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 72;

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, hasAnalysis }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const colorMode = useContext(ColorModeContext);

  const navItems = [
    { id: 'awareness', icon: <BarChart />, label: 'Situational Awareness' },
    { id: 'operations', icon: <People />, label: 'Operations Hub', disabled: !hasAnalysis },
    { id: 'preparedness', icon: <Public />, label: 'Public Preparedness' },
  ];

  const toggleDrawer = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getThemeIcon = () => {
    switch (colorMode.mode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'system':
        return <SettingsBrightness />;
      default:
        return <SettingsBrightness />;
    }
  };

  const getThemeLabel = () => {
    switch (colorMode.mode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System Theme';
      default:
        return 'System Theme';
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.2, 0, 0, 1)',
        '& .MuiDrawer-paper': {
          width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          boxSizing: 'border-box',
          borderRight: 'none',
          transition: 'width 0.3s cubic-bezier(0.2, 0, 0, 1)',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          pt: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 80,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6750A4 0%, #9A82DB 100%)',
              boxShadow: '0px 4px 8px rgba(103, 80, 164, 0.3)',
            }}
          >
            <Security sx={{ color: 'white', fontSize: '1.5rem' }} />
          </Box>
          {!isCollapsed && (
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #6750A4 0%, #9A82DB 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Aegis AI
            </Typography>
          )}
        </Box>
        {!isCollapsed && (
          <Tooltip title="Collapse" placement="right" arrow>
            <IconButton onClick={toggleDrawer} size="small" sx={{ color: 'primary.main' }}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <List sx={{ px: 1, pt: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={isCollapsed ? item.label : ''} placement="right" arrow>
              <ListItemButton
                selected={currentView === item.id}
                onClick={() => setCurrentView(item.id as View)}
                disabled={item.disabled}
                sx={{
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 1.5 : 2,
                  py: 1.5,
                  minHeight: 56,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 'auto' : 56,
                    justifyContent: 'center',
                    color: currentView === item.id ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: currentView === item.id ? 600 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2 }} />

      {/* Theme Toggle */}
      <Box sx={{ px: 1, py: 2 }}>
        <Tooltip title={isCollapsed ? getThemeLabel() : ''} placement="right" arrow>
          <ListItemButton
            onClick={colorMode.toggleColorMode}
            sx={{
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 1.5 : 2,
              py: 1.5,
              minHeight: 56,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: isCollapsed ? 'auto' : 56,
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              {getThemeIcon()}
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary={getThemeLabel()}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>

      {isCollapsed && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Expand" placement="right" arrow>
            <IconButton onClick={toggleDrawer} size="small" sx={{ color: 'primary.main' }}>
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {!isCollapsed && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            &copy; 2025 Aegis AI Systems
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;