import { PluginObj } from '@babel/core';
import { transform } from '@babel/standalone';
import { ENTRY_FILE_NAME } from '../../files';
import { File, Files } from '../PlaygroundContext';

const getModuleFile = (files: Files, modulePath: string) => {
	let moduleName = modulePath.split('./').pop() || '';
	if (!moduleName.includes('.')) {
		const realModuleName = Object.keys(files)
			.filter((key) => {
				return ['.ts', '.tsx', '.js', '.jsx'].some((i) => key.endsWith(i));
			})
			.find((key) => {
				return key.split('.').includes(moduleName);
			});

		if (realModuleName) {
			moduleName = realModuleName;
		}
	}
	return files[moduleName];
};

const json2Js = (file: File) => {
	const js = `export default ${file.value}`;

	return URL.createObjectURL(
		new Blob([js], { type: 'application/javascript' })
	);
};

const css2Js = (file: File) => {
	const randomId = new Date().getTime();
	const js = `
  (() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
  })()
  `;

	return URL.createObjectURL(
		new Blob([js], { type: 'application/javascript' })
	);
};

function customResolver(files: Files): PluginObj {
	return {
		visitor: {
			ImportDeclaration(path) {
				const modulePath = path.node.source.value;
				if (modulePath.startsWith('.')) {
					const file = getModuleFile(files, modulePath);
					if (!file) {
						return;
					}
					if (file.name.endsWith('.css')) {
						path.node.source.value = css2Js(file);
					} else if (file.name.endsWith('.json')) {
						path.node.source.value = json2Js(file);
					} else {
						path.node.source.value = URL.createObjectURL(
							new Blob([babelTransfrom(file.name, file.value, files)], {
								type: 'application/javascript',
							})
						);
					}
				}
			},
		},
	};
}

export const beforeTransformCode = (fileName: string, code: string) => {
	let _code = code;
	const regexReact = /import\s+React/g;
	if (
		fileName.endsWith('.jsx') ||
		(fileName.endsWith('tsx') && !regexReact.test(code))
	) {
		_code = `import React from 'react';\n${code}`;
	}

	return _code;
};

export const babelTransfrom = (
	filename: string,
	code: string,
	files: Files
) => {
	let _code = beforeTransformCode(filename, code);
	let result = '';
	try {
		result = transform(_code, {
			presets: ['react', 'typescript'],
			filename,
			plugins: [customResolver(files)],
			retainLines: true,
		}).code!;
	} catch (e) {
		console.log('编译出错', e);
	}

	return result;
};

export const compile = (files: Files) => {
	const main = files[ENTRY_FILE_NAME];
	return babelTransfrom(ENTRY_FILE_NAME, main.value, files);
};
export const COMPILER_WORKER_SYM = 'COMPILED_CODES';
self.addEventListener('message', async ({ data }) => {
	try {
		self.postMessage({
			type: COMPILER_WORKER_SYM,
			data: compile(data),
		});
	} catch (error) {
		self.postMessage({ type: 'ERROR', error });
	}
});
