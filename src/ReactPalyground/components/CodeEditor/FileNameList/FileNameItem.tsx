import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import Popconfirm from '../../common/Popconfirm'
export interface FileNameItemProps {
  value: string;
  actived: boolean;
  creating: boolean;
  readonly: boolean;
  onClick: () => void;
  onEditComplete: (name: string) => void;
  onRemove: () => void;
}
const FileNameItem: FC<FileNameItemProps> = (props) => {
  const {
    value,
    actived = false,
    creating,
    readonly,
    onClick,
    onEditComplete,
    onRemove,
  } = props;
  const [name, setName] = useState(value);
  const [editing, setEditing] = useState(creating);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  };
  const handleInputBlur = () => {
    setEditing(false);
    onEditComplete(name);
  };

  useEffect(() => {
    if (creating) {
      inputRef?.current?.focus();
    }
  }, [creating]);

  const cs = classNames(styles['tab-item'], actived ? styles.actived : null);
  return (
    <div className={cs} onClick={onClick}>
      {editing ? (
        <input
          ref={inputRef}
          className={styles['tabs-item-input']}
          value={name}
          onBlur={handleInputBlur}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <>
          <span onDoubleClick={handleDoubleClick}>{name}</span>
          {!readonly ? (
            <Popconfirm
              trigger={
                <span style={{ marginLeft: 5, display: 'flex' }}>
                  <svg width='12' height='12' viewBox='0 0 24 24'>
                    <line stroke='#999' x1='18' y1='6' x2='6' y2='18'></line>
                    <line stroke='#999' x1='6' y1='6' x2='18' y2='18'></line>
                  </svg>
                </span>
              }
              onConfirm={(e) => {
                e?.stopPropagation();
                onRemove();
              }}
              confirmText="确定"
              cancelText="取消"
              message="确定要删除吗？"
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default FileNameItem;
