import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {useLocation} from 'react-router-dom'

const breadcrumbNameMap = {
    '/mainUser': 'Главная',
    '/mainTest': 'Файлы',
    '/testFile': 'Тест',
    '/profile': 'Профиль',
};

function handleClick(event) {
  event.preventDefault();
}

export default function BasicBreadcrumbs() {
    const location = useLocation();
    let currentLink = ''
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          MUI
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Core
        </Link>
        <Typography color="text.primary">Breadcrumbs</Typography>
      </Breadcrumbs>
    </div>
  );
}
