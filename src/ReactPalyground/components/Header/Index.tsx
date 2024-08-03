import { useContext, useMemo, useState } from 'react';
import logoSvg from '../../../icons/logo.svg'
import styles from './index.module.scss';
import { createTheme, ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import { PlaygroundContext } from '../PlaygroundContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShareIcon from '@mui/icons-material/Share';
import copy from 'copy-to-clipboard';
import UnstyledSnackbarIntroduction from '../common/UnstyledSnackbarIntroduction';

const Header = () => {
  const { theme, setTheme } = useContext(PlaygroundContext);
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [open, setOpen] = useState(false);
  const themeMui = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  }), [darkMode]);

  const handleThemeToggle = () => {
    // 切换当前模式
    setTheme(darkMode ? 'light' : 'dark')
    setDarkMode((prevMode) => !prevMode);
  };

  const handleShareLink = () => {
    copy(window.location.href);
    setOpen(true);
  }
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img alt="logo" src={logoSvg} />
        <span>React Playground</span>
      </div>
      <div>
        <ThemeProvider theme={themeMui}>
          <CssBaseline />
          <div style={{ padding: 16 }}>
            <IconButton onClick={handleThemeToggle} color="inherit">
              {darkMode ? <LightbulbIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton onClick={handleShareLink} color="inherit">
              <ShareIcon />
            </IconButton>
          </div>
        </ThemeProvider>
      </div>
      <UnstyledSnackbarIntroduction isOpen={open} setOpen={(open) => { setOpen(open) }}>
        <div className="snackbar-message">
          <p className="snackbar-description">
            🌹 分享链接已复制～
          </p>
        </div>
      </UnstyledSnackbarIntroduction>
    </div>
  )
}

export default Header

