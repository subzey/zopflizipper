import JSZip from "jszip";

{
	document.documentElement.addEventListener('dragover', (e) => {
		const droppableOkay = ([...e.dataTransfer.items]
			.some(item => item.kind === 'file')
		);
		if (droppableOkay) {
			// Show our interest in the data dragged over
			e.preventDefault();
		}
	
		document.documentElement.classList.toggle('droppable-nope', !droppableOkay);
		document.documentElement.classList.toggle('droppable-okay', droppableOkay);
	});

	const resetClasses = () => {
		document.documentElement.classList.remove('droppable-nope');
		document.documentElement.classList.remove('droppable-okay');
	}
	
	document.documentElement.addEventListener('dragend', resetClasses);
	document.documentElement.addEventListener('dragleave', resetClasses);
	document.documentElement.addEventListener('drop', resetClasses);
}


document.documentElement.addEventListener('drop', async (e) => {
	const files = (Array.from(e.dataTransfer.items, item => item.getAsFile())
		.filter(Boolean)
	);
	if (files.length === 0) {
		throw new Error('No files dropped');
	}
	e.preventDefault();
	console.log(files);
	const zipArchive = await createZip(files);
	console.log(zipArchive);
	downloadFile(zipArchive);
});


/**
 * @param {ReadonlyArray<File>} files
 */
async function createZip(files) {
	const zip = new JSZip();
	for (const file of files) {
		zip.file(file.name, file, { compression: "DEFLATE" });
	}
	return zip.generateAsync({ type: 'blob' });
}

/**
 * @param {Blob} blob 
 * @param {string} [filename]
 */
function downloadFile(blob, filename) {
	filename ||= `${new Date().toISOString()}.zip`;
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	a.click();
}