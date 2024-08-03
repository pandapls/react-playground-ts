import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';
import FileNameItem from './FileNameItem';
import styles from './index.module.scss'
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from '../../../files';
const FileNameList = () => {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    setSelectedFileName,
    selectedFileName,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState(['']);
  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name);
    setSelectedFileName(name);
  }

  const [creating, setCreating] = useState(false);
  const addTab = () => {
    const newFileName = 'Comp' + Math.random().toString().slice(2, 4) + '.tsx';
    addFile(newFileName);
    setSelectedFileName(newFileName);
    setCreating(true);
  }
  const handleRemove = (name: string) => {
    removeFile(name);
    setSelectedFileName(ENTRY_FILE_NAME)
  }
  const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME]
  return (
    <div className={styles.tabs}>
      {tabs.map((item, index, arr) => (
        <FileNameItem
          value={item}
          key={item + index}
          actived={selectedFileName === item}
          creating={creating && index === arr.length - 1}
          readonly={readonlyFileNames.includes(item)}
          onClick={() => {
            setSelectedFileName(item);
          }}
          onEditComplete={(name: string) => { handleEditComplete(name, item) }}
          onRemove={() => {
            handleRemove(item);
          }}
        />
      ))}
      <div className={styles.add} onClick={addTab}>
        +
      </div>
    </div>
  );
};

export default FileNameList;
