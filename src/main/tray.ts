import { BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import path from 'path'

export function createTray(window: BrowserWindow) {
  const icon = nativeImage.createFromPath(
    path.resolve(__dirname, 'rotionTemplate.png'),
  )

  const tray = new Tray(icon)

  const menu = Menu.buildFromTemplate([
    { label: 'Rotion', enabled: false },
    { type: 'separator' },
    {
      label: 'Criar novo documento',
      click: () => window.webContents.send('new-document'),
    },
    { type: 'separator' },
    { label: 'Documentos recentes', enabled: false },
    {
      label: 'Documento 1',
      accelerator: 'CommandOrControl+1',
      acceleratorWorksWhenHidden: false,
    },
    {
      label: 'Documento 2',
      accelerator: 'CommandOrControl+2',
      acceleratorWorksWhenHidden: false,
    },
    {
      label: 'Documento 3',
      accelerator: 'CommandOrControl+3',
      acceleratorWorksWhenHidden: false,
    },
    { type: 'separator' },
    { label: 'Sair do Rotion', role: 'quit' },
  ])

  tray.setToolTip('Rotion')
  tray.setContextMenu(menu)
}
