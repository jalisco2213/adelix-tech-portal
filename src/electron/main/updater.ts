import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';
import ProgressBar from 'electron-progressbar';

autoUpdater.autoDownload = false;

export const checkAndApplyUpdates = (): void => {
  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    dialog.showErrorBox('Ошибка', `${err} произошла при поиске обновлений`);
  });

  let progressBar: ProgressBar | undefined;

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'jalisco2213',
    repo: 'adelix-po',
  });

  autoUpdater.on('update-available', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Доступно обновление',
        message: 'Доступно новое обновление. Начать загрузку?',
        buttons: ['Да', 'Нет'],
      })
      .then((res) => {
        if (res.response === 0) {
          autoUpdater.downloadUpdate();
          progressBar = new ProgressBar({
            indeterminate: false,
            text: 'Загрузка обновления...',
            detail: 'Подождите...',
            abortOnError: true,
            closeOnComplete: false,
            browserWindow: {
              alwaysOnTop: true,
            },
          });
        }
      })
      .catch((err) => {
        dialog.showErrorBox('Ошибка', 'Ошибка при загрузке обновления: ' + err);
      });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (progressBar) {
      progressBar.value = progressObj.percent;
      progressBar.detail = `Загружено ${progressObj.transferred} из ${progressObj.total} байт`;
    }
  });

  autoUpdater.on('update-downloaded', () => {
    if (progressBar) {
      progressBar.close();
      progressBar = undefined;
    }

    autoUpdater.quitAndInstall(false, true);
  });

  autoUpdater.on('error', (err) => {
    dialog.showErrorBox(
      'Ошибка обновления',
      'Произошла ошибка во время процесса обновления: ' + err.message
    );
    if (progressBar) {
      progressBar.close();
      progressBar = undefined;
    }
  });
};
